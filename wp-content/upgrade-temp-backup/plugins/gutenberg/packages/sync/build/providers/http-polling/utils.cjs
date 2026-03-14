"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/sync/src/providers/http-polling/utils.ts
var utils_exports = {};
__export(utils_exports, {
  base64ToUint8Array: () => base64ToUint8Array,
  createSyncUpdate: () => createSyncUpdate,
  createUpdateQueue: () => createUpdateQueue,
  postSyncUpdate: () => postSyncUpdate,
  postSyncUpdateNonBlocking: () => postSyncUpdateNonBlocking,
  uint8ArrayToBase64: () => uint8ArrayToBase64
});
module.exports = __toCommonJS(utils_exports);
var import_api_fetch = __toESM(require("@wordpress/api-fetch"));
var import_types = require("./types.cjs");
var SYNC_API_PATH = "/wp-sync/v1/updates";
function uint8ArrayToBase64(data) {
  let binary = "";
  const len = data.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(data[i]);
  }
  return globalThis.btoa(binary);
}
function base64ToUint8Array(base64) {
  const binaryString = globalThis.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
function createSyncUpdate(data, type) {
  return {
    data: uint8ArrayToBase64(data),
    type
  };
}
function createUpdateQueue(initial = [], paused = true) {
  let isPaused = paused;
  const updates = [...initial];
  return {
    add(update) {
      updates.push(update);
    },
    addBulk(bulkUpdates) {
      if (0 === bulkUpdates.length) {
        return;
      }
      updates.push(...bulkUpdates);
    },
    clear() {
      updates.splice(0, updates.length);
    },
    get() {
      if (isPaused) {
        return [];
      }
      return updates.splice(0, updates.length);
    },
    pause() {
      isPaused = true;
    },
    restore(restoredUpdates) {
      const filtered = restoredUpdates.filter(
        (u) => u.type !== import_types.SyncUpdateType.COMPACTION
      );
      if (0 === filtered.length) {
        return;
      }
      updates.unshift(...filtered);
    },
    resume() {
      isPaused = false;
    },
    size() {
      return updates.length;
    }
  };
}
function postSyncUpdate(payload) {
  return (0, import_api_fetch.default)({
    method: "POST",
    path: SYNC_API_PATH,
    data: payload
  });
}
function postSyncUpdateNonBlocking(payload) {
  if (payload.rooms.length === 0) {
    return;
  }
  (0, import_api_fetch.default)({
    method: "POST",
    path: SYNC_API_PATH,
    data: payload,
    keepalive: true
  }).catch(() => {
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  base64ToUint8Array,
  createSyncUpdate,
  createUpdateQueue,
  postSyncUpdate,
  postSyncUpdateNonBlocking,
  uint8ArrayToBase64
});
//# sourceMappingURL=utils.cjs.map
