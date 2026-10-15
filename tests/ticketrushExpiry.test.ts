import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { parse } from "@vue/compiler-sfc";
import { ScriptTarget, transpileModule } from "typescript";
import { computed, ref } from "vue";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Execute the component's own setup so expiry tests exercise the actual handlers.
function demo() {
  const source = readFileSync(new URL("../src/components/demos/TicketRushDemo.vue", import.meta.url), "utf8");
  const script = parse(source).descriptor.scriptSetup!.content.replace(/^import .*;$/gm, "");
  const js = transpileModule(script, { compilerOptions: { target: ScriptTarget.ES2022 } }).outputText;
  return runInNewContext(`${js}\n({ seats, holdSeat, holdRemaining, confirmPayment, paymentState, outboxEvents, resetDemo, canConfirm })`, {
    ref, computed, onBeforeUnmount: () => {}, t: (ko: string) => ko, Date,
    window: { setInterval, clearInterval, setTimeout, clearTimeout },
  });
}

beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date("2026-10-14T00:00:00Z")); });
afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); });

describe("ticket demo hold expiry", () => {
  it("rejects a payment without a hold or after the exact expiry boundary", () => {
    const state = demo();
    state.confirmPayment();
    expect(state.paymentState.value).toBe("idle");
    state.holdSeat(state.seats.value[0]);
    vi.advanceTimersByTime(300_000);
    expect(state.canConfirm.value).toBe(false);
    expect(state.seats.value[0].state).toBe("free");
    state.confirmPayment();
    vi.advanceTimersByTime(2_000);
    expect(state.paymentState.value).toBe("idle");
    expect(state.outboxEvents.value).toEqual([]);
  });

  it("checks the deadline again if the hold expires while payment is processing", () => {
    const state = demo();
    state.holdSeat(state.seats.value[0]);
    vi.advanceTimersByTime(299_900);
    state.confirmPayment();
    vi.advanceTimersByTime(200);
    expect(state.paymentState.value).toBe("idle");
    expect(state.seats.value[0].state).toBe("free");
    expect(state.outboxEvents.value).toEqual([]);
  });

  it("rejects a stale hold even before a delayed display timer runs", () => {
    const state = demo();
    state.holdSeat(state.seats.value[0]);
    vi.setSystemTime(Date.now() + 300_000);
    state.confirmPayment();
    expect(state.paymentState.value).toBe("idle");
    expect(state.outboxEvents.value).toEqual([]);
  });

  it("allows reselecting after expiry and confirms only once on repeat requests", () => {
    const state = demo();
    state.holdSeat(state.seats.value[0]);
    vi.advanceTimersByTime(300_000);
    state.holdSeat(state.seats.value[0]);
    state.confirmPayment();
    state.confirmPayment();
    vi.advanceTimersByTime(1_500);
    state.confirmPayment();
    expect(state.paymentState.value).toBe("done");
    expect(state.seats.value[0].state).toBe("sold");
    expect(state.outboxEvents.value.map((event: { name: string }) => event.name)).toEqual(["PaymentApproved", "SeatConfirmed", "SeatStatusPushed"]);
    vi.advanceTimersByTime(300_000);
    expect(state.seats.value[0].state).toBe("sold");
  });

  it("cancels in-flight payment when the demo is reset", () => {
    const state = demo();
    state.holdSeat(state.seats.value[0]);
    state.confirmPayment();
    state.resetDemo();
    vi.advanceTimersByTime(2_000);
    expect(state.paymentState.value).toBe("idle");
    expect(state.outboxEvents.value).toEqual([]);
    expect(state.seats.value[0].state).toBe("free");
  });
});
