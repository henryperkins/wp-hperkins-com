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

// packages/sync/src/providers/http-polling/polling-manager.ts
var polling_manager_exports = {};
__export(polling_manager_exports, {
  pollingManager: () => pollingManager
});
module.exports = __toCommonJS(polling_manager_exports);
var Y = __toESM(require("yjs"));
var encoding = __toESM(require("lib0/encoding"));
var decoding = __toESM(require("lib0/decoding"));
var import_awareness = require("y-protocols/awareness");
var syncProtocol = __toESM(require("y-protocols/sync"));
var import_types = require("./types.cjs");
var import_utils = require("./utils.cjs");
var POLLING_INTERVAL_IN_MS = 1e3;
var POLLING_INTERVAL_WITH_COLLABORATORS_IN_MS = 250;
var POLLING_INTERVAL_BACKGROUND_TAB_IN_MS = 25 * 1e3;
var MAX_ERROR_BACKOFF_IN_MS = 30 * 1e3;
var POLLING_MANAGER_ORIGIN = "polling-manager";
var roomStates = /* @__PURE__ */ new Map();
function createDeprecatedCompactionUpdate(updates) {
  const mergeable = updates.filter(
    (u) => [import_types.SyncUpdateType.COMPACTION, import_types.SyncUpdateType.UPDATE].includes(
      u.type
    )
  ).map((u) => (0, import_utils.base64ToUint8Array)(u.data));
  return (0, import_utils.createSyncUpdate)(
    Y.mergeUpdates(mergeable),
    import_types.SyncUpdateType.COMPACTION
  );
}
function createSyncStep1Update(doc) {
  const encoder = encoding.createEncoder();
  syncProtocol.writeSyncStep1(encoder, doc);
  return (0, import_utils.createSyncUpdate)(
    encoding.toUint8Array(encoder),
    import_types.SyncUpdateType.SYNC_STEP_1
  );
}
function createSyncStep2Update(doc, step1) {
  const decoder = decoding.createDecoder(step1);
  const encoder = encoding.createEncoder();
  syncProtocol.readSyncMessage(
    decoder,
    encoder,
    doc,
    POLLING_MANAGER_ORIGIN
  );
  return (0, import_utils.createSyncUpdate)(
    encoding.toUint8Array(encoder),
    import_types.SyncUpdateType.SYNC_STEP_2
  );
}
function processAwarenessUpdate(state, awareness) {
  const currentStates = awareness.getStates();
  const added = /* @__PURE__ */ new Set();
  const updated = /* @__PURE__ */ new Set();
  const removed = new Set(
    currentStates.keys().filter((clientId) => !state[clientId])
  );
  Object.entries(state).forEach(([clientIdString, awarenessState]) => {
    const clientId = Number(clientIdString);
    if (clientId === awareness.clientID) {
      return;
    }
    if (null === awarenessState) {
      currentStates.delete(clientId);
      removed.add(clientId);
      return;
    }
    if (!currentStates.has(clientId)) {
      currentStates.set(clientId, awarenessState);
      added.add(clientId);
      return;
    }
    const currentState = currentStates.get(clientId);
    if (JSON.stringify(currentState) !== JSON.stringify(awarenessState)) {
      currentStates.set(clientId, awarenessState);
      updated.add(clientId);
    }
  });
  if (added.size + updated.size > 0) {
    awareness.emit("change", [
      {
        added: Array.from(added),
        updated: Array.from(updated),
        // Left blank on purpose, as the removal of clients is handled in the if condition below.
        removed: []
      }
    ]);
  }
  if (removed.size > 0) {
    (0, import_awareness.removeAwarenessStates)(
      awareness,
      Array.from(removed),
      POLLING_MANAGER_ORIGIN
    );
  }
}
function processDocUpdate(update, doc, onSync) {
  const data = (0, import_utils.base64ToUint8Array)(update.data);
  switch (update.type) {
    case import_types.SyncUpdateType.SYNC_STEP_1: {
      return createSyncStep2Update(doc, data);
    }
    case import_types.SyncUpdateType.SYNC_STEP_2: {
      const decoder = decoding.createDecoder(data);
      const encoder = encoding.createEncoder();
      syncProtocol.readSyncMessage(
        decoder,
        encoder,
        doc,
        POLLING_MANAGER_ORIGIN
      );
      onSync();
      return;
    }
    case import_types.SyncUpdateType.COMPACTION:
    case import_types.SyncUpdateType.UPDATE: {
      Y.applyUpdate(doc, data, POLLING_MANAGER_ORIGIN);
    }
  }
}
var areListenersRegistered = false;
var hasCollaborators = false;
var isActiveBrowser = "visible" === document.visibilityState;
var isPolling = false;
var isUnloadPending = false;
var pollInterval = POLLING_INTERVAL_IN_MS;
var pollingTimeoutId = null;
function handleBeforeUnload() {
  isUnloadPending = true;
}
function handlePageHide() {
  const rooms = Array.from(roomStates.entries()).map(
    ([room, state]) => ({
      after: 0,
      awareness: null,
      client_id: state.clientId,
      room,
      updates: []
    })
  );
  (0, import_utils.postSyncUpdateNonBlocking)({ rooms });
}
function handleVisibilityChange() {
  const wasActive = isActiveBrowser;
  isActiveBrowser = document.visibilityState === "visible";
  if (isActiveBrowser && !wasActive) {
    if (pollingTimeoutId) {
      clearTimeout(pollingTimeoutId);
      pollingTimeoutId = null;
      poll();
    }
  }
}
function poll() {
  isPolling = true;
  pollingTimeoutId = null;
  async function start() {
    if (0 === roomStates.size) {
      isPolling = false;
      return;
    }
    isUnloadPending = false;
    roomStates.forEach((state) => {
      state.onStatusChange({ status: "connecting" });
    });
    const payload = {
      rooms: Array.from(roomStates.entries()).map(
        ([room, state]) => ({
          after: state.endCursor ?? 0,
          awareness: state.localAwarenessState,
          client_id: state.clientId,
          room,
          updates: state.updateQueue.get()
        })
      )
    };
    try {
      const { rooms } = await (0, import_utils.postSyncUpdate)(payload);
      roomStates.forEach((state) => {
        state.onStatusChange({ status: "connected" });
      });
      rooms.forEach((room) => {
        if (!roomStates.has(room.room)) {
          return;
        }
        const roomState = roomStates.get(room.room);
        roomState.endCursor = room.end_cursor;
        roomState.processAwarenessUpdate(room.awareness);
        if (Object.keys(room.awareness).length > 1) {
          hasCollaborators = true;
          roomState.updateQueue.resume();
        }
        const responseUpdates = room.updates.map((update) => roomState.processDocUpdate(update)).filter(
          (update) => Boolean(update)
        );
        roomState.updateQueue.addBulk(responseUpdates);
        if (room.should_compact) {
          roomState.log("Server requested compaction update");
          roomState.updateQueue.clear();
          roomState.updateQueue.add(
            roomState.createCompactionUpdate()
          );
        } else if (room.compaction_request) {
          roomState.log("Server requested (old) compaction update");
          roomState.updateQueue.add(
            createDeprecatedCompactionUpdate(
              room.compaction_request
            )
          );
        }
      });
      if (isActiveBrowser && hasCollaborators) {
        pollInterval = POLLING_INTERVAL_WITH_COLLABORATORS_IN_MS;
      } else if (isActiveBrowser) {
        pollInterval = POLLING_INTERVAL_IN_MS;
      } else {
        pollInterval = POLLING_INTERVAL_BACKGROUND_TAB_IN_MS;
      }
    } catch (error) {
      pollInterval = Math.min(
        pollInterval * 2,
        MAX_ERROR_BACKOFF_IN_MS
      );
      for (const room of payload.rooms) {
        if (!roomStates.has(room.room)) {
          continue;
        }
        const state = roomStates.get(room.room);
        state.updateQueue.restore(room.updates);
        state.log(
          "Error posting sync update, will retry with backoff",
          {
            error,
            nextPoll: pollInterval
          }
        );
      }
      if (!isUnloadPending) {
        roomStates.forEach((state) => {
          state.onStatusChange({
            status: "disconnected",
            retryInMs: pollInterval
          });
        });
      }
    }
    pollingTimeoutId = setTimeout(poll, pollInterval);
  }
  void start();
}
function registerRoom({
  room,
  doc,
  awareness,
  log,
  onSync,
  onStatusChange
}) {
  if (roomStates.has(room)) {
    return;
  }
  const updateQueue = (0, import_utils.createUpdateQueue)([createSyncStep1Update(doc)]);
  function onAwarenessUpdate() {
    roomState.localAwarenessState = awareness.getLocalState() ?? {};
  }
  function onDocUpdate(update, origin) {
    if (POLLING_MANAGER_ORIGIN === origin) {
      return;
    }
    updateQueue.add((0, import_utils.createSyncUpdate)(update, import_types.SyncUpdateType.UPDATE));
  }
  function unregister() {
    doc.off("update", onDocUpdate);
    awareness.off("change", onAwarenessUpdate);
    updateQueue.clear();
  }
  const roomState = {
    clientId: doc.clientID,
    createCompactionUpdate: () => (0, import_utils.createSyncUpdate)(
      Y.encodeStateAsUpdate(doc),
      import_types.SyncUpdateType.COMPACTION
    ),
    endCursor: 0,
    localAwarenessState: awareness.getLocalState() ?? {},
    log,
    onStatusChange,
    processAwarenessUpdate: (state) => processAwarenessUpdate(state, awareness),
    processDocUpdate: (update) => processDocUpdate(update, doc, onSync),
    unregister,
    updateQueue
  };
  doc.on("update", onDocUpdate);
  awareness.on("change", onAwarenessUpdate);
  roomStates.set(room, roomState);
  if (!areListenersRegistered) {
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    areListenersRegistered = true;
  }
  if (!isPolling) {
    poll();
  }
}
function unregisterRoom(room) {
  const state = roomStates.get(room);
  if (state) {
    const rooms = [
      {
        after: 0,
        awareness: null,
        client_id: state.clientId,
        room,
        updates: []
      }
    ];
    (0, import_utils.postSyncUpdateNonBlocking)({ rooms });
    state.unregister();
    roomStates.delete(room);
  }
  if (0 === roomStates.size && areListenersRegistered) {
    window.removeEventListener("beforeunload", handleBeforeUnload);
    window.removeEventListener("pagehide", handlePageHide);
    document.removeEventListener(
      "visibilitychange",
      handleVisibilityChange
    );
    areListenersRegistered = false;
  }
}
function retryNow() {
  pollInterval = POLLING_INTERVAL_IN_MS * 2;
  if (pollingTimeoutId) {
    clearTimeout(pollingTimeoutId);
    pollingTimeoutId = null;
    poll();
  }
}
var pollingManager = {
  registerRoom,
  retryNow,
  unregisterRoom
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  pollingManager
});
//# sourceMappingURL=polling-manager.cjs.map
