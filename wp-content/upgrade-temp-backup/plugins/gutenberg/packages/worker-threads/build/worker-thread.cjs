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

// packages/worker-threads/src/worker-thread.ts
var worker_thread_exports = {};
__export(worker_thread_exports, {
  expose: () => expose
});
module.exports = __toCommonJS(worker_thread_exports);
var import_comctx = require("comctx");
var WorkerProvideAdapter = class {
  sendMessage = (message, transfer) => {
    self.postMessage(message, { transfer });
  };
  onMessage = (callback) => {
    const handler = (event) => callback(event.data);
    self.addEventListener("message", handler);
    return () => self.removeEventListener("message", handler);
  };
};
function expose(target) {
  const [provide] = (0, import_comctx.defineProxy)(() => target, {
    namespace: "__wordpress_worker__",
    heartbeatCheck: false,
    transfer: true
  });
  provide(new WorkerProvideAdapter());
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  expose
});
//# sourceMappingURL=worker-thread.cjs.map
