import { describe, expect, it, vi } from "vitest";
import { createLatestFrameScheduler } from "../src/utils/frameScheduler";

describe("createLatestFrameScheduler", () => {
  it("writes only the latest value once per frame", () => {
    const queue: FrameRequestCallback[] = [];
    const write = vi.fn();
    const scheduler = createLatestFrameScheduler(write, (callback) => {
      queue.push(callback);
      return queue.length;
    }, vi.fn());

    scheduler.schedule(1);
    scheduler.schedule(2);
    expect(queue).toHaveLength(1);
    queue[0](16);
    expect(write).toHaveBeenCalledTimes(1);
    expect(write).toHaveBeenCalledWith(2);
  });

  it("cancels a pending write", () => {
    const cancelFrame = vi.fn();
    const scheduler = createLatestFrameScheduler(vi.fn(), () => 7, cancelFrame);
    scheduler.schedule("value");
    scheduler.cancel();
    expect(cancelFrame).toHaveBeenCalledWith(7);
  });
});
