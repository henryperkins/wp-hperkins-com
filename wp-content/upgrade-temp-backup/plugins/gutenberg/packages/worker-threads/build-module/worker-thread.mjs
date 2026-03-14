// packages/worker-threads/src/worker-thread.ts
import {
  defineProxy
} from "comctx";
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
  const [provide] = defineProxy(() => target, {
    namespace: "__wordpress_worker__",
    heartbeatCheck: false,
    transfer: true
  });
  provide(new WorkerProvideAdapter());
}
export {
  expose
};
//# sourceMappingURL=worker-thread.mjs.map
