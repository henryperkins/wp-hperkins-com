// packages/sync/src/providers/http-polling/http-polling-provider.ts
import { ObservableV2 } from "lib0/observable";
import { Awareness } from "y-protocols/awareness";
import { pollingManager } from "./polling-manager.mjs";
var HttpPollingProvider = class extends ObservableV2 {
  constructor(options) {
    super();
    this.options = options;
    this.log("Initializing", { room: options.room });
    this.awareness = options.awareness ?? new Awareness(options.ydoc);
    this.connect();
  }
  awareness;
  status = "disconnected";
  synced = false;
  /**
   * Connect to the endpoint and initialize sync.
   */
  connect() {
    this.log("Connecting");
    pollingManager.registerRoom({
      room: this.options.room,
      doc: this.options.ydoc,
      awareness: this.awareness,
      log: this.log,
      onStatusChange: this.emitStatus,
      onSync: this.onSync
    });
  }
  /**
   * Destroy the provider and cleanup resources.
   */
  destroy() {
    this.disconnect();
    super.destroy();
  }
  /**
   * Disconnect the provider and allow reconnection later.
   */
  disconnect() {
    this.log("Disconnecting");
    pollingManager.unregisterRoom(this.options.room);
    this.emitStatus({ status: "disconnected" });
  }
  /**
   * Emit connection status, passing the full object through so that
   * additional fields (e.g. `retryInMs`) are preserved for consumers.
   *
   * @param connectionStatus The connection status object
   */
  emitStatus = (connectionStatus) => {
    const { status } = connectionStatus;
    const error = status === "disconnected" ? connectionStatus.error : void 0;
    if (this.status === status && !error) {
      return;
    }
    if (status === "connecting" && this.status !== "disconnected") {
      return;
    }
    this.log("Status change", { status, error });
    this.status = status;
    this.emit("status", [connectionStatus]);
  };
  /**
   * Log debug messages if debugging is enabled.
   *
   * @param message The debug message
   * @param debug   Additional debug information
   */
  log = (message, debug = {}) => {
    if (this.options.debug) {
      console.log(`[${this.constructor.name}]: ${message}`, {
        room: this.options.room,
        ...debug
      });
    }
  };
  /**
   * Handle synchronization events from the polling manager.
   */
  onSync = () => {
    if (!this.synced) {
      this.synced = true;
      this.log("Synced");
    }
  };
};
function createHttpPollingProvider() {
  return async ({
    awareness,
    objectType,
    objectId,
    ydoc
  }) => {
    const room = objectId ? `${objectType}:${objectId}` : objectType;
    const provider = new HttpPollingProvider({
      awareness,
      // debug: true,
      room,
      ydoc
    });
    return {
      destroy: () => provider.destroy(),
      // Adapter: ObservableV2.on is compatible with ProviderOn
      // The callback receives data as the first parameter
      on: (event, callback) => {
        provider.on(event, callback);
      }
    };
  };
}
export {
  createHttpPollingProvider
};
//# sourceMappingURL=http-polling-provider.mjs.map
