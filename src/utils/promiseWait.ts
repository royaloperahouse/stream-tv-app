export async function promiseWait(
  itemPromise: Promise<any>,
  timeout: number | undefined = 3000,
) {
  const waitingPromise = new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, timeout);
  });
  const item = (await Promise.allSettled([itemPromise, waitingPromise]))[0];
  if (item.status === 'fulfilled') {
    return item.value;
  }
  return Promise.reject(item.reason);
}
