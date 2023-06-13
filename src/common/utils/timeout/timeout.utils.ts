export const onTimeoutInvoke = (
  callback: Function,
  seconds: number
): Promise<void> =>
  new Promise(resolve =>
    setTimeout(async () => {
      await callback();
      resolve();
    }, seconds * 1000)
  );
