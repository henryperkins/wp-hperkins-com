// packages/sync/src/providers/http-polling/utils.ts
import apiFetch from "@wordpress/api-fetch";
import {
  SyncUpdateType
} from "./types.mjs";
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
        (u) => u.type !== SyncUpdateType.COMPACTION
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
  return apiFetch({
    method: "POST",
    path: SYNC_API_PATH,
    data: payload
  });
}
function postSyncUpdateNonBlocking(payload) {
  if (payload.rooms.length === 0) {
    return;
  }
  apiFetch({
    method: "POST",
    path: SYNC_API_PATH,
    data: payload,
    keepalive: true
  }).catch(() => {
  });
}
export {
  base64ToUint8Array,
  createSyncUpdate,
  createUpdateQueue,
  postSyncUpdate,
  postSyncUpdateNonBlocking,
  uint8ArrayToBase64
};
//# sourceMappingURL=utils.mjs.map
