"use strict";
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

// packages/sync/src/performance.ts
var performance_exports = {};
__export(performance_exports, {
  logPerformanceTiming: () => logPerformanceTiming,
  passThru: () => passThru,
  yieldToEventLoop: () => yieldToEventLoop
});
module.exports = __toCommonJS(performance_exports);
function logPerformanceTiming(fn) {
  return function(...args) {
    const start = performance.now();
    const result = fn.apply(this, args);
    const end = performance.now();
    console.log(
      `[SyncManager][performance]: ${fn.name} took ${(end - start).toFixed(2)} ms`
    );
    return result;
  };
}
function passThru(fn) {
  return ((...args) => fn(...args));
}
function yieldToEventLoop(fn) {
  return function(...args) {
    setTimeout(() => {
      fn.apply(this, args);
    }, 0);
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  logPerformanceTiming,
  passThru,
  yieldToEventLoop
});
//# sourceMappingURL=performance.cjs.map
