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

    scheduler.schedule(3);
    expect(queue).toHaveLength(2);
    queue[1](32);
    expect(write).toHaveBeenCalledTimes(2);
    expect(write).toHaveBeenLastCalledWith(3);
  });

  it("schedules a new frame after canceling a pending write", () => {
    const queue = new Map<number, FrameRequestCallback>();
    const write = vi.fn();
    let nextHandle = 0;
    const requestFrame = vi.fn((callback: FrameRequestCallback) => {
      nextHandle += 1;
      queue.set(nextHandle, callback);
      return nextHandle;
    });
    const cancelFrame = vi.fn((handle: number) => queue.delete(handle));
    const scheduler = createLatestFrameScheduler(write, requestFrame, cancelFrame);

    scheduler.schedule("cancelled");
    scheduler.cancel();
    expect(cancelFrame).toHaveBeenCalledWith(1);

    scheduler.schedule("new");
    expect(requestFrame).toHaveBeenCalledTimes(2);
    queue.get(2)?.(16);
    expect(write).toHaveBeenCalledTimes(1);
    expect(write).toHaveBeenCalledWith("new");
  });
});
