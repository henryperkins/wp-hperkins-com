var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/preferences-persistence/src/create/debounce-async.js
var debounce_async_exports = {};
__export(debounce_async_exports, {
  default: () => debounceAsync
});
module.exports = __toCommonJS(debounce_async_exports);
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
//# sourceMappingURL=debounce-async.cjs.map
