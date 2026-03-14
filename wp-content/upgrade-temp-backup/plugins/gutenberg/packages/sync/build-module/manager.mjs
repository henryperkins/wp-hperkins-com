// packages/sync/src/manager.ts
import * as Y from "yjs";
import {
  CRDT_RECORD_MAP_KEY,
  CRDT_STATE_MAP_KEY,
  CRDT_STATE_MAP_SAVED_AT_KEY as SAVED_AT_KEY,
  LOCAL_SYNC_MANAGER_ORIGIN
} from "./config.mjs";
import {
  logPerformanceTiming,
  passThru,
  yieldToEventLoop
} from "./performance.mjs";
import { getProviderCreators } from "./providers/index.mjs";
import { createUndoManager } from "./undo-manager.mjs";
import {
  createYjsDoc,
  deserializeCrdtDoc,
  initializeYjsDoc,
  markEntityAsSaved,
  serializeCrdtDoc
} from "./utils.mjs";
function getEntityId(objectType, objectId) {
  return `${objectType}_${objectId}`;
}
function createSyncManager(debug = false) {
  const debugWrap = debug ? logPerformanceTiming : passThru;
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
    const providerCreators = getProviderCreators();
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
    const ydoc = createYjsDoc({ objectType });
    const recordMap = ydoc.getMap(CRDT_RECORD_MAP_KEY);
    const stateMap = ydoc.getMap(CRDT_STATE_MAP_KEY);
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
          case SAVED_AT_KEY:
            const newValue = stateMap.get(SAVED_AT_KEY);
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
      undoManager = createUndoManager();
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
    initializeYjsDoc(ydoc);
    internal.applyPersistedCrdtDoc(objectType, objectId, record);
  }
  async function loadCollection(syncConfig, objectType, handlers) {
    const providerCreators = getProviderCreators();
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
    const ydoc = createYjsDoc({ collection: true, objectType });
    const stateMap = ydoc.getMap(CRDT_STATE_MAP_KEY);
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
          case SAVED_AT_KEY:
            const newValue = stateMap.get(SAVED_AT_KEY);
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
    initializeYjsDoc(ydoc);
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
    const tempDoc = serialized ? deserializeCrdtDoc(serialized) : null;
    if (!tempDoc) {
      log("applyPersistedCrdtDoc", "no persisted doc", entityId);
      targetDoc.transact(() => {
        applyChangesToCRDTDoc(targetDoc, record);
        handlers.saveRecord();
      }, LOCAL_SYNC_MANAGER_ORIGIN);
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
    }, LOCAL_SYNC_MANAGER_ORIGIN);
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
          markEntityAsSaved(ydoc);
        }
      }, origin2);
    }
    if (collectionState && isSave) {
      collectionState.ydoc.transact(() => {
        markEntityAsSaved(collectionState.ydoc);
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
    return serializeCrdtDoc(entityState.ydoc);
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
    update: debugWrap(yieldToEventLoop(updateCRDTDoc))
  };
}
export {
  createSyncManager
};
//# sourceMappingURL=manager.mjs.map
