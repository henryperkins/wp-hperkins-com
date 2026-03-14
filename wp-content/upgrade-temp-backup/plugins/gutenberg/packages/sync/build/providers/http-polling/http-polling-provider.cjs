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

// packages/sync/src/providers/http-polling/http-polling-provider.ts
var http_polling_provider_exports = {};
__export(http_polling_provider_exports, {
  createHttpPollingProvider: () => createHttpPollingProvider
});
module.exports = __toCommonJS(http_polling_provider_exports);
var import_observable = require("lib0/observable");
var import_awareness = require("y-protocols/awareness");
var import_polling_manager = require("./polling-manager.cjs");
var HttpPollingProvider = class extends import_observable.ObservableV2 {
  constructor(options) {
    super();
    this.options = options;
    this.log("Initializing", { room: options.room });
    this.awareness = options.awareness ?? new import_awareness.Awareness(options.ydoc);
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
    import_polling_manager.pollingManager.registerRoom({
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
    import_polling_manager.pollingManager.unregisterRoom(this.options.room);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createHttpPollingProvider
});
//# sourceMappingURL=http-polling-provider.cjs.map
