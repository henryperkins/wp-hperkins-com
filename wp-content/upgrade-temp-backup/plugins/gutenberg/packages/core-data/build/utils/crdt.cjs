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

// packages/core-data/src/utils/crdt.ts
var crdt_exports = {};
__export(crdt_exports, {
  POST_META_KEY_FOR_CRDT_DOC_PERSISTENCE: () => POST_META_KEY_FOR_CRDT_DOC_PERSISTENCE,
  applyPostChangesToCRDTDoc: () => applyPostChangesToCRDTDoc,
  defaultSyncConfig: () => defaultSyncConfig,
  getPostChangesFromCRDTDoc: () => getPostChangesFromCRDTDoc
});
module.exports = __toCommonJS(crdt_exports);
var import_es6 = __toESM(require("fast-deep-equal/es6/index.js"));
var import_blocks = require("@wordpress/blocks");
var import_sync = require("@wordpress/sync");
var import_base_awareness = require("../awareness/base-awareness.cjs");
var import_crdt_blocks = require("./crdt-blocks.cjs");
var import_sync2 = require("../sync.cjs");
var import_crdt_selection = require("./crdt-selection.cjs");
var import_crdt_utils = require("./crdt-utils.cjs");
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
  const ymap = (0, import_crdt_utils.getRootMap)(ydoc, import_sync2.CRDT_RECORD_MAP_KEY);
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
  const ymap = (0, import_crdt_utils.getRootMap)(ydoc, import_sync2.CRDT_RECORD_MAP_KEY);
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
        if (!(currentBlocks instanceof import_sync.Y.Array)) {
          currentBlocks = new import_sync.Y.Array();
          ymap.set(key, currentBlocks);
        }
        const cursorPosition = changes.selection?.selectionStart?.offset ?? null;
        (0, import_crdt_blocks.mergeCrdtBlocks)(currentBlocks, newValue, cursorPosition);
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
        if (currentValue instanceof import_sync.Y.Text) {
          (0, import_crdt_blocks.mergeRichTextUpdate)(currentValue, rawValue ?? "");
        } else {
          const newYText = new import_sync.Y.Text(rawValue ?? "");
          ymap.set(key, newYText);
        }
        break;
      }
      // "Meta" is overloaded term; here, it refers to post meta.
      case "meta": {
        let metaMap = ymap.get("meta");
        if (!(0, import_crdt_utils.isYMap)(metaMap)) {
          metaMap = (0, import_crdt_utils.createYMap)();
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
      (0, import_crdt_selection.updateSelectionHistory)(ydoc, selection);
    }, 0);
  }
}
function defaultGetChangesFromCRDTDoc(crdtDoc) {
  return (0, import_crdt_utils.getRootMap)(crdtDoc, import_sync2.CRDT_RECORD_MAP_KEY).toJSON();
}
function getPostChangesFromCRDTDoc(ydoc, editedRecord, _postType) {
  const ymap = (0, import_crdt_utils.getRootMap)(ydoc, import_sync2.CRDT_RECORD_MAP_KEY);
  let allowedMetaChanges = {};
  const changes = Object.fromEntries(
    Object.entries(ymap.toJSON()).filter(([key, newValue]) => {
      if (!allowedPostProperties.has(key)) {
        return false;
      }
      const currentValue = editedRecord[key];
      switch (key) {
        case "blocks": {
          if (ydoc.meta?.get(import_sync2.CRDT_DOC_META_PERSISTENCE_KEY) && editedRecord.content) {
            const blocksJson = ymap.get("blocks")?.toJSON() ?? [];
            return (0, import_blocks.__unstableSerializeAndClean)(blocksJson).trim() !== getRawValue(editedRecord.content);
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
  const selectionHistory = (0, import_crdt_selection.getSelectionHistory)(ydoc);
  const shiftedSelection = (0, import_crdt_selection.getShiftedSelection)(ydoc, selectionHistory);
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
  createAwareness: (ydoc) => new import_base_awareness.BaseAwareness(ydoc),
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
  return !(0, import_es6.default)(currentValue, newValue);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  POST_META_KEY_FOR_CRDT_DOC_PERSISTENCE,
  applyPostChangesToCRDTDoc,
  defaultSyncConfig,
  getPostChangesFromCRDTDoc
});
//# sourceMappingURL=crdt.cjs.map
