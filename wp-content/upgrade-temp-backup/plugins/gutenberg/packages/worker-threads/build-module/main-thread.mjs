// packages/worker-threads/src/main-thread.ts
import {
  defineProxy
} from "comctx";
import { WORKER_SYMBOL } from "./types.mjs";
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
  const [, inject] = defineProxy(() => ({}), {
    namespace: "__wordpress_worker__",
    heartbeatCheck: false,
    transfer: true
  });
  const comctxRemote = inject(new WorkerInjectAdapter(worker));
  remoteWorkers.set(comctxRemote, worker);
  const proxy = new Proxy(comctxRemote, {
    get(target, prop) {
      if (prop === WORKER_SYMBOL) {
        return worker;
      }
      return Reflect.get(target, prop);
    }
  });
  remoteWorkers.set(proxy, worker);
  return proxy;
}
function terminate(remote) {
  const worker = remote[WORKER_SYMBOL];
  if (!worker) {
    return;
  }
  remoteWorkers.delete(remote);
  worker.terminate();
}
export {
  terminate,
  wrap
};
//# sourceMappingURL=main-thread.mjs.map
