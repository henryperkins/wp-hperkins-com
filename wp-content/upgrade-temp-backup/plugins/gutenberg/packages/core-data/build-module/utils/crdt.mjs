// packages/core-data/src/utils/crdt.ts
import fastDeepEqual from "fast-deep-equal/es6/index.js";
import { __unstableSerializeAndClean } from "@wordpress/blocks";
import {
  Y
} from "@wordpress/sync";
import { BaseAwareness } from "../awareness/base-awareness.mjs";
import {
  mergeCrdtBlocks,
  mergeRichTextUpdate
} from "./crdt-blocks.mjs";
import { CRDT_DOC_META_PERSISTENCE_KEY, CRDT_RECORD_MAP_KEY } from "../sync.mjs";
import {
  getSelectionHistory,
  getShiftedSelection,
  updateSelectionHistory
} from "./crdt-selection.mjs";
import {
  createYMap,
  getRootMap,
  isYMap
} from "./crdt-utils.mjs";
var POST_META_KEY_FOR_CRDT_DOC_PERSISTENCE = "_crdt_document";
var allowedPostProperties = /* @__PURE__ */ new Set([
  "author",
  "blocks",
  "content",
  "categories",
  "comment_status",
  "date",
  "excerpt",
  "featured_media",
  "format",
  "meta",
  "ping_status",
  "slug",
  "status",
  "sticky",
  "tags",
  "template",
  "title"
]);
var disallowedPostMetaKeys = /* @__PURE__ */ new Set([
  POST_META_KEY_FOR_CRDT_DOC_PERSISTENCE
]);
function defaultApplyChangesToCRDTDoc(ydoc, changes) {
  const ymap = getRootMap(ydoc, CRDT_RECORD_MAP_KEY);
  Object.entries(changes).forEach(([key, newValue]) => {
    if ("function" === typeof newValue) {
      return;
    }
    switch (key) {
      // Add support for additional data types here.
      default: {
        const currentValue = ymap.get(key);
        updateMapValue(ymap, key, currentValue, newValue);
      }
    }
  });
}
function applyPostChangesToCRDTDoc(ydoc, changes, _postType) {
  const ymap = getRootMap(ydoc, CRDT_RECORD_MAP_KEY);
  Object.keys(changes).forEach((key) => {
    if (!allowedPostProperties.has(key)) {
      return;
    }
    const newValue = changes[key];
    if ("function" === typeof newValue) {
      return;
    }
    switch (key) {
      case "blocks": {
        if (!newValue) {
          ymap.set(key, void 0);
          break;
        }
        let currentBlocks = ymap.get(key);
        if (!(currentBlocks instanceof Y.Array)) {
          currentBlocks = new Y.Array();
          ymap.set(key, currentBlocks);
        }
        const cursorPosition = changes.selection?.selectionStart?.offset ?? null;
        mergeCrdtBlocks(currentBlocks, newValue, cursorPosition);
        break;
      }
      case "content":
      case "excerpt":
      case "title": {
        const currentValue = ymap.get(key);
        let rawValue = getRawValue(newValue);
        if (key === "title" && !currentValue?.toString() && "Auto Draft" === rawValue) {
          rawValue = "";
        }
        if (currentValue instanceof Y.Text) {
          mergeRichTextUpdate(currentValue, rawValue ?? "");
        } else {
          const newYText = new Y.Text(rawValue ?? "");
          ymap.set(key, newYText);
        }
        break;
      }
      // "Meta" is overloaded term; here, it refers to post meta.
      case "meta": {
        let metaMap = ymap.get("meta");
        if (!isYMap(metaMap)) {
          metaMap = createYMap();
          ymap.set("meta", metaMap);
        }
        Object.entries(newValue ?? {}).forEach(
          ([metaKey, metaValue]) => {
            if (disallowedPostMetaKeys.has(metaKey)) {
              return;
            }
            updateMapValue(
              metaMap,
              metaKey,
              metaMap.get(metaKey),
              // current value in CRDT
              metaValue
              // new value from changes
            );
          }
        );
        break;
      }
      case "slug": {
        if (!newValue) {
          break;
        }
        const currentValue = ymap.get(key);
        updateMapValue(ymap, key, currentValue, newValue);
        break;
      }
      // Add support for additional properties here.
      default: {
        const currentValue = ymap.get(key);
        updateMapValue(ymap, key, currentValue, newValue);
      }
    }
  });
  if (changes.selection) {
    const selection = changes.selection;
    setTimeout(() => {
      updateSelectionHistory(ydoc, selection);
    }, 0);
  }
}
function defaultGetChangesFromCRDTDoc(crdtDoc) {
  return getRootMap(crdtDoc, CRDT_RECORD_MAP_KEY).toJSON();
}
function getPostChangesFromCRDTDoc(ydoc, editedRecord, _postType) {
  const ymap = getRootMap(ydoc, CRDT_RECORD_MAP_KEY);
  let allowedMetaChanges = {};
  const changes = Object.fromEntries(
    Object.entries(ymap.toJSON()).filter(([key, newValue]) => {
      if (!allowedPostProperties.has(key)) {
        return false;
      }
      const currentValue = editedRecord[key];
      switch (key) {
        case "blocks": {
          if (ydoc.meta?.get(CRDT_DOC_META_PERSISTENCE_KEY) && editedRecord.content) {
            const blocksJson = ymap.get("blocks")?.toJSON() ?? [];
            return __unstableSerializeAndClean(blocksJson).trim() !== getRawValue(editedRecord.content);
          }
          return true;
        }
        case "date": {
          const currentDateIsFloating = null === currentValue || editedRecord.modified === currentValue;
          if (currentDateIsFloating) {
            return false;
          }
          return haveValuesChanged(currentValue, newValue);
        }
        case "meta": {
          allowedMetaChanges = Object.fromEntries(
            Object.entries(newValue ?? {}).filter(
              ([metaKey]) => !disallowedPostMetaKeys.has(metaKey)
            )
          );
          const mergedValue = {
            ...currentValue,
            ...allowedMetaChanges
          };
          return haveValuesChanged(currentValue, mergedValue);
        }
        case "status": {
          if ("auto-draft" === newValue) {
            return false;
          }
          return haveValuesChanged(currentValue, newValue);
        }
        case "content":
        case "excerpt":
        case "title": {
          return haveValuesChanged(
            getRawValue(currentValue),
            newValue
          );
        }
        // Add support for additional data types here.
        default: {
          return haveValuesChanged(currentValue, newValue);
        }
      }
    })
  );
  if ("object" === typeof changes.meta) {
    changes.meta = {
      ...editedRecord.meta,
      ...allowedMetaChanges
    };
  }
  const selectionHistory = getSelectionHistory(ydoc);
  const shiftedSelection = getShiftedSelection(ydoc, selectionHistory);
  if (shiftedSelection) {
    changes.selection = {
      ...shiftedSelection,
      initialPosition: 0
    };
  }
  return changes;
}
var defaultSyncConfig = {
  applyChangesToCRDTDoc: defaultApplyChangesToCRDTDoc,
  createAwareness: (ydoc) => new BaseAwareness(ydoc),
  getChangesFromCRDTDoc: defaultGetChangesFromCRDTDoc
};
function getRawValue(value) {
  if ("string" === typeof value) {
    return value;
  }
  if (value && "object" === typeof value && "raw" in value && "string" === typeof value.raw) {
    return value.raw;
  }
  return void 0;
}
function haveValuesChanged(currentValue, newValue) {
  return !fastDeepEqual(currentValue, newValue);
}
function updateMapValue(map, key, currentValue, newValue) {
  if (void 0 === newValue) {
    map.delete(key);
    return;
  }
  if (haveValuesChanged(currentValue, newValue)) {
    map.set(key, newValue);
  }
}
export {
  POST_META_KEY_FOR_CRDT_DOC_PERSISTENCE,
  applyPostChangesToCRDTDoc,
  defaultSyncConfig,
  getPostChangesFromCRDTDoc
};
//# sourceMappingURL=crdt.mjs.map
