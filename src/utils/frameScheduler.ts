export const createLatestFrameScheduler = <T>(
  write: (value: T) => void,
  requestFrame: (callback: FrameRequestCallback) => number = requestAnimationFrame,
  cancelFrame: (handle: number) => void = cancelAnimationFrame,
) => {
  let frameId: number | null = null;
  let latestValue: T;

  const schedule = (value: T) => {
    latestValue = value;
    if (frameId !== null) return;

    frameId = requestFrame(() => {
      frameId = null;
      write(latestValue);
    });
  };

  const cancel = () => {
    if (frameId === null) return;
    cancelFrame(frameId);
    frameId = null;
  };

  return { schedule, cancel };
};
