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

// packages/worker-threads/src/main-thread.ts
var main_thread_exports = {};
__export(main_thread_exports, {
  terminate: () => terminate,
  wrap: () => wrap
});
module.exports = __toCommonJS(main_thread_exports);
var import_comctx = require("comctx");
var import_types = require("./types.cjs");
var WorkerInjectAdapter = class {
  worker;
  constructor(worker) {
    this.worker = worker;
  }
  sendMessage = (message, transfer) => {
    this.worker.postMessage(message, transfer);
  };
  onMessage = (callback) => {
    const handler = (event) => callback(event.data);
    this.worker.addEventListener("message", handler);
    return () => this.worker.removeEventListener("message", handler);
  };
};
var remoteWorkers = /* @__PURE__ */ new WeakMap();
function wrap(worker) {
  const [, inject] = (0, import_comctx.defineProxy)(() => ({}), {
    namespace: "__wordpress_worker__",
    heartbeatCheck: false,
    transfer: true
  });
  const comctxRemote = inject(new WorkerInjectAdapter(worker));
  remoteWorkers.set(comctxRemote, worker);
  const proxy = new Proxy(comctxRemote, {
    get(target, prop) {
      if (prop === import_types.WORKER_SYMBOL) {
        return worker;
      }
      return Reflect.get(target, prop);
    }
  });
  remoteWorkers.set(proxy, worker);
  return proxy;
}
function terminate(remote) {
  const worker = remote[import_types.WORKER_SYMBOL];
  if (!worker) {
    return;
  }
  remoteWorkers.delete(remote);
  worker.terminate();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  terminate,
  wrap
});
//# sourceMappingURL=main-thread.cjs.map
