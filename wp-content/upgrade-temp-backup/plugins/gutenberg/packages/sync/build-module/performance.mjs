// packages/sync/src/performance.ts
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
export {
  logPerformanceTiming,
  passThru,
  yieldToEventLoop
};
//# sourceMappingURL=performance.mjs.map
