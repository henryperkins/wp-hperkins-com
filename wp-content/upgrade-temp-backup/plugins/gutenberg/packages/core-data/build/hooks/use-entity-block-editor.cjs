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

// packages/core-data/src/hooks/use-entity-block-editor.js
var use_entity_block_editor_exports = {};
__export(use_entity_block_editor_exports, {
  default: () => useEntityBlockEditor
});
module.exports = __toCommonJS(use_entity_block_editor_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_blocks = require("@wordpress/blocks");
var import_name = require("../name.cjs");
var import_use_entity_id = __toESM(require("./use-entity-id.cjs"));
var import_footnotes = require("../footnotes/index.cjs");
var EMPTY_ARRAY = [];
var parsedBlocksCache = /* @__PURE__ */ new Map();
function useEntityBlockEditor(kind, name, { id: _id } = {}) {
  const providerId = (0, import_use_entity_id.default)(kind, name);
  const id = _id ?? providerId;
  const { content, editedBlocks, meta } = (0, import_data.useSelect)(
    (select) => {
      if (!id) {
        return {};
      }
      const { getEditedEntityRecord } = select(import_name.STORE_NAME);
      const editedRecord = getEditedEntityRecord(kind, name, id);
      return {
        editedBlocks: editedRecord.blocks,
        content: editedRecord.content,
        meta: editedRecord.meta
      };
    },
    [kind, name, id]
  );
  const { __unstableCreateUndoLevel, editEntityRecord } = (0, import_data.useDispatch)(import_name.STORE_NAME);
  const blocks = (0, import_element.useMemo)(() => {
    if (!id) {
      return void 0;
    }
    if (editedBlocks) {
      return editedBlocks;
    }
    if (!content || typeof content !== "string") {
      return EMPTY_ARRAY;
    }
    const cacheKey = `${kind}:${name}:${id}`;
    const cached = parsedBlocksCache.get(cacheKey);
    let _blocks;
    if (cached && cached.content === content) {
      _blocks = cached.blocks;
    } else {
      _blocks = (0, import_blocks.parse)(content);
      parsedBlocksCache.set(cacheKey, { content, blocks: _blocks });
    }
    return _blocks;
  }, [kind, name, id, editedBlocks, content]);
  const onChange = (0, import_element.useCallback)(
    (newBlocks, options) => {
      const noChange = blocks === newBlocks;
      if (noChange) {
        return __unstableCreateUndoLevel(kind, name, id);
      }
      const { selection, ...rest } = options;
      const edits = {
        selection,
        content: ({ blocks: blocksForSerialization = [] }) => (0, import_blocks.__unstableSerializeAndClean)(blocksForSerialization),
        ...(0, import_footnotes.updateFootnotesFromMeta)(newBlocks, meta)
      };
      editEntityRecord(kind, name, id, edits, {
        isCached: false,
        ...rest
      });
    },
    [
      kind,
      name,
      id,
      blocks,
      meta,
      __unstableCreateUndoLevel,
      editEntityRecord
    ]
  );
  const onInput = (0, import_element.useCallback)(
    (newBlocks, options) => {
      const { selection, ...rest } = options;
      const edits = {
        selection,
        ...(0, import_footnotes.updateFootnotesFromMeta)(newBlocks, meta)
      };
      editEntityRecord(kind, name, id, edits, {
        isCached: true,
        ...rest
      });
    },
    [kind, name, id, meta, editEntityRecord]
  );
  return [blocks, onInput, onChange];
}
//# sourceMappingURL=use-entity-block-editor.cjs.map
