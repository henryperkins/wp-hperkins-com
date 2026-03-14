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

// packages/sync/src/manager.ts
var manager_exports = {};
__export(manager_exports, {
  createSyncManager: () => createSyncManager
});
module.exports = __toCommonJS(manager_exports);
var Y = __toESM(require("yjs"));
var import_config = require("./config.cjs");
var import_performance = require("./performance.cjs");
var import_providers = require("./providers/index.cjs");
var import_undo_manager = require("./undo-manager.cjs");
var import_utils = require("./utils.cjs");
function getEntityId(objectType, objectId) {
  return `${objectType}_${objectId}`;
}
function createSyncManager(debug = false) {
  const debugWrap = debug ? import_performance.logPerformanceTiming : import_performance.passThru;
  const collectionStates = /* @__PURE__ */ new Map();
  const entityStates = /* @__PURE__ */ new Map();
  let undoManager;
  function log(component, message, entityId, context = {}) {
    if (!debug) {
      return;
    }
    console.log(`[SyncManager][${component}]: ${message}`, {
      ...context,
      entityId
    });
  }
  async function loadEntity(syncConfig, objectType, objectId, record, handlers) {
    const providerCreators = (0, import_providers.getProviderCreators)();
    const entityId = getEntityId(objectType, objectId);
    if (0 === providerCreators.length) {
      log("loadEntity", "no providers, skipping", entityId);
      return;
    }
    if (entityStates.has(entityId)) {
      log("loadEntity", "already loaded", entityId);
      return;
    }
    log("loadEntity", "loading", entityId);
    handlers = {
      addUndoMeta: debugWrap(handlers.addUndoMeta),
      editRecord: debugWrap(handlers.editRecord),
      getEditedRecord: debugWrap(handlers.getEditedRecord),
      onStatusChange: debugWrap(handlers.onStatusChange),
      refetchRecord: debugWrap(handlers.refetchRecord),
      restoreUndoMeta: debugWrap(handlers.restoreUndoMeta),
      saveRecord: debugWrap(handlers.saveRecord)
    };
    const ydoc = (0, import_utils.createYjsDoc)({ objectType });
    const recordMap = ydoc.getMap(import_config.CRDT_RECORD_MAP_KEY);
    const stateMap = ydoc.getMap(import_config.CRDT_STATE_MAP_KEY);
    const now = Date.now();
    const unload = () => {
      log("loadEntity", "unloading", entityId);
      providerResults.forEach((result) => result.destroy());
      handlers.onStatusChange(null);
      recordMap.unobserveDeep(onRecordUpdate);
      stateMap.unobserve(onStateMapUpdate);
      ydoc.destroy();
      entityStates.delete(entityId);
    };
    const awareness = syncConfig.createAwareness?.(ydoc, objectId);
    const onRecordUpdate = (_events, transaction) => {
      if (transaction.local && !(transaction.origin instanceof Y.UndoManager)) {
        return;
      }
      void internal.updateEntityRecord(objectType, objectId);
    };
    const onStateMapUpdate = (event, transaction) => {
      if (transaction.local) {
        return;
      }
      event.keysChanged.forEach((key) => {
        switch (key) {
          case import_config.CRDT_STATE_MAP_SAVED_AT_KEY:
            const newValue = stateMap.get(import_config.CRDT_STATE_MAP_SAVED_AT_KEY);
            if ("number" === typeof newValue && newValue > now) {
              log("loadEntity", "refetching record", entityId);
              void handlers.refetchRecord().catch(() => {
              });
            }
            break;
        }
      });
    };
    if (!undoManager) {
      undoManager = (0, import_undo_manager.createUndoManager)();
    }
    const { addUndoMeta, restoreUndoMeta } = handlers;
    undoManager.addToScope(recordMap, {
      addUndoMeta,
      restoreUndoMeta
    });
    const entityState = {
      awareness,
      handlers,
      objectId,
      objectType,
      syncConfig,
      unload,
      ydoc
    };
    entityStates.set(entityId, entityState);
    log("loadEntity", "connecting", entityId);
    const providerResults = await Promise.all(
      providerCreators.map(async (create) => {
        const provider = await create({
          objectType,
          objectId,
          ydoc,
          awareness
        });
        provider.on("status", handlers.onStatusChange);
        return provider;
      })
    );
    recordMap.observeDeep(onRecordUpdate);
    stateMap.observe(onStateMapUpdate);
    (0, import_utils.initializeYjsDoc)(ydoc);
    internal.applyPersistedCrdtDoc(objectType, objectId, record);
  }
  async function loadCollection(syncConfig, objectType, handlers) {
    const providerCreators = (0, import_providers.getProviderCreators)();
    const entityId = getEntityId(objectType, null);
    if (0 === providerCreators.length) {
      log("loadCollection", "no providers, skipping", entityId);
      return;
    }
    if (collectionStates.has(objectType)) {
      log("loadCollection", "already loaded", entityId);
      return;
    }
    log("loadCollection", "loading", entityId);
    const ydoc = (0, import_utils.createYjsDoc)({ collection: true, objectType });
    const stateMap = ydoc.getMap(import_config.CRDT_STATE_MAP_KEY);
    const now = Date.now();
    const unload = () => {
      log("loadCollection", "unloading", entityId);
      providerResults.forEach((result) => result.destroy());
      handlers.onStatusChange(null);
      stateMap.unobserve(onStateMapUpdate);
      ydoc.destroy();
      collectionStates.delete(objectType);
    };
    const onStateMapUpdate = (event, transaction) => {
      if (transaction.local) {
        return;
      }
      event.keysChanged.forEach((key) => {
        switch (key) {
          case import_config.CRDT_STATE_MAP_SAVED_AT_KEY:
            const newValue = stateMap.get(import_config.CRDT_STATE_MAP_SAVED_AT_KEY);
            if ("number" === typeof newValue && newValue > now) {
              void handlers.refetchRecords().catch(() => {
              });
            }
            break;
        }
      });
    };
    const awareness = syncConfig.createAwareness?.(ydoc);
    const collectionState = {
      awareness,
      handlers,
      syncConfig,
      unload,
      ydoc
    };
    collectionStates.set(objectType, collectionState);
    log("loadCollection", "connecting", entityId);
    const providerResults = await Promise.all(
      providerCreators.map(async (create) => {
        const provider = await create({
          awareness,
          objectType,
          objectId: null,
          ydoc
        });
        provider.on("status", handlers.onStatusChange);
        return provider;
      })
    );
    stateMap.observe(onStateMapUpdate);
    (0, import_utils.initializeYjsDoc)(ydoc);
  }
  function unloadEntity(objectType, objectId) {
    const entityId = getEntityId(objectType, objectId);
    log("unloadEntity", "unloading", entityId);
    entityStates.get(entityId)?.unload();
    updateCRDTDoc(objectType, null, {}, origin, { isSave: true });
  }
  function getAwareness(objectType, objectId) {
    const entityId = getEntityId(objectType, objectId);
    const entityState = entityStates.get(entityId);
    if (!entityState || !entityState.awareness) {
      return void 0;
    }
    return entityState.awareness;
  }
  function _applyPersistedCrdtDoc(objectType, objectId, record) {
    const entityId = getEntityId(objectType, objectId);
    const entityState = entityStates.get(entityId);
    if (!entityState) {
      log("applyPersistedCrdtDoc", "no entity state", entityId);
      return;
    }
    const {
      handlers,
      syncConfig: {
        applyChangesToCRDTDoc,
        getChangesFromCRDTDoc,
        getPersistedCRDTDoc
      },
      ydoc: targetDoc
    } = entityState;
    const serialized = getPersistedCRDTDoc?.(record);
    const tempDoc = serialized ? (0, import_utils.deserializeCrdtDoc)(serialized) : null;
    if (!tempDoc) {
      log("applyPersistedCrdtDoc", "no persisted doc", entityId);
      targetDoc.transact(() => {
        applyChangesToCRDTDoc(targetDoc, record);
        handlers.saveRecord();
      }, import_config.LOCAL_SYNC_MANAGER_ORIGIN);
      return;
    }
    const update = Y.encodeStateAsUpdateV2(tempDoc);
    Y.applyUpdateV2(targetDoc, update);
    const invalidations = getChangesFromCRDTDoc(tempDoc, record);
    const invalidatedKeys = Object.keys(invalidations);
    tempDoc.destroy();
    if (0 === invalidatedKeys.length) {
      log("applyPersistedCrdtDoc", "valid persisted doc", entityId);
      return;
    }
    log("applyPersistedCrdtDoc", "invalidated keys", entityId, {
      invalidatedKeys
    });
    const changes = invalidatedKeys.reduce(
      (acc, key) => Object.assign(acc, {
        [key]: record[key]
      }),
      {}
    );
    targetDoc.transact(() => {
      applyChangesToCRDTDoc(targetDoc, changes);
      handlers.saveRecord();
    }, import_config.LOCAL_SYNC_MANAGER_ORIGIN);
  }
  function updateCRDTDoc(objectType, objectId, changes, origin2, options = {}) {
    const { isSave = false, isNewUndoLevel = false } = options;
    const entityId = getEntityId(objectType, objectId);
    const entityState = entityStates.get(entityId);
    const collectionState = collectionStates.get(objectType);
    if (entityState) {
      const { syncConfig, ydoc } = entityState;
      if (isNewUndoLevel && undoManager) {
        undoManager.stopCapturing?.();
      }
      ydoc.transact(() => {
        log("updateCRDTDoc", "applying changes", entityId, {
          changedKeys: Object.keys(changes)
        });
        syncConfig.applyChangesToCRDTDoc(ydoc, changes);
        if (isSave) {
          (0, import_utils.markEntityAsSaved)(ydoc);
        }
      }, origin2);
    }
    if (collectionState && isSave) {
      collectionState.ydoc.transact(() => {
        (0, import_utils.markEntityAsSaved)(collectionState.ydoc);
      }, origin2);
    }
  }
  async function _updateEntityRecord(objectType, objectId) {
    const entityId = getEntityId(objectType, objectId);
    const entityState = entityStates.get(entityId);
    if (!entityState) {
      log("updateEntityRecord", "no entity state", entityId);
      return;
    }
    const { handlers, syncConfig, ydoc } = entityState;
    const changes = syncConfig.getChangesFromCRDTDoc(
      ydoc,
      await handlers.getEditedRecord()
    );
    const changedKeys = Object.keys(changes);
    if (0 === changedKeys.length) {
      return;
    }
    log("updateEntityRecord", "changes", entityId, {
      changedKeys
    });
    handlers.editRecord(changes);
  }
  async function createPersistedCRDTDoc(objectType, objectId) {
    const entityId = getEntityId(objectType, objectId);
    const entityState = entityStates.get(entityId);
    if (!entityState?.ydoc) {
      return null;
    }
    await new Promise((resolve) => setTimeout(resolve, 0));
    return (0, import_utils.serializeCrdtDoc)(entityState.ydoc);
  }
  const internal = {
    applyPersistedCrdtDoc: debugWrap(_applyPersistedCrdtDoc),
    updateEntityRecord: debugWrap(_updateEntityRecord)
  };
  return {
    createPersistedCRDTDoc: debugWrap(createPersistedCRDTDoc),
    getAwareness,
    load: debugWrap(loadEntity),
    loadCollection: debugWrap(loadCollection),
    // Use getter to ensure we always return the current value of `undoManager`.
    get undoManager() {
      return undoManager;
    },
    unload: debugWrap(unloadEntity),
    update: debugWrap((0, import_performance.yieldToEventLoop)(updateCRDTDoc))
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createSyncManager
});
//# sourceMappingURL=manager.cjs.map
