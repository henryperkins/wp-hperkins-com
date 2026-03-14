// packages/preferences-persistence/src/create/debounce-async.js
function debounceAsync(func, delayMS) {
  let timeoutId;
  let activePromise;
  return async function debounced(...args) {
    if (!activePromise && !timeoutId) {
      return new Promise((resolve, reject) => {
        activePromise = func(...args).then((...thenArgs) => {
          resolve(...thenArgs);
        }).catch((error) => {
          reject(error);
        }).finally(() => {
          activePromise = null;
        });
      });
    }
    if (activePromise) {
      await activePromise;
    }
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(() => {
        activePromise = func(...args).then((...thenArgs) => {
          resolve(...thenArgs);
        }).catch((error) => {
          reject(error);
        }).finally(() => {
          activePromise = null;
          timeoutId = null;
        });
      }, delayMS);
    });
  };
}
export {
  debounceAsync as default
};
//# sourceMappingURL=debounce-async.mjs.map
