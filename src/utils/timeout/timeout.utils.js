export const onTimeoutInvoke = (callback, seconds) =>
  new Promise(resolve =>
    setTimeout(async () => {
      await callback();
      resolve();
    }, seconds * 1000)
  );
