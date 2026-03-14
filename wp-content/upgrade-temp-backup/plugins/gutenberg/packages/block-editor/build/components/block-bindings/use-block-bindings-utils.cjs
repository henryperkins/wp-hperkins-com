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

// packages/block-editor/src/components/block-bindings/use-block-bindings-utils.js
var use_block_bindings_utils_exports = {};
__export(use_block_bindings_utils_exports, {
  default: () => useBlockBindingsUtils
});
module.exports = __toCommonJS(use_block_bindings_utils_exports);
var import_data = require("@wordpress/data");
var import_store = require("../../store/index.cjs");
var import_block_edit = require("../block-edit/index.cjs");
function isObjectEmpty(object) {
  return !object || Object.keys(object).length === 0;
}
function useBlockBindingsUtils(clientId) {
  const { clientId: contextClientId } = (0, import_block_edit.useBlockEditContext)();
  const blockClientId = clientId || contextClientId;
  const { updateBlockAttributes } = (0, import_data.useDispatch)(import_store.store);
  const { getBlockAttributes } = (0, import_data.useRegistry)().select(import_store.store);
  const updateBlockBindings = (bindings) => {
    const { metadata: { bindings: currentBindings, ...metadata } = {} } = getBlockAttributes(blockClientId);
    const newBindings = { ...currentBindings };
    Object.entries(bindings).forEach(([attribute, binding]) => {
      if (!binding && newBindings[attribute]) {
        delete newBindings[attribute];
        return;
      }
      newBindings[attribute] = binding;
    });
    const newMetadata = {
      ...metadata,
      bindings: newBindings
    };
    if (isObjectEmpty(newMetadata.bindings)) {
      delete newMetadata.bindings;
    }
    updateBlockAttributes(blockClientId, {
      metadata: isObjectEmpty(newMetadata) ? void 0 : newMetadata
    });
  };
  const removeAllBlockBindings = () => {
    const { metadata: { bindings, ...metadata } = {} } = getBlockAttributes(blockClientId);
    updateBlockAttributes(blockClientId, {
      metadata: isObjectEmpty(metadata) ? void 0 : metadata
    });
  };
  return { updateBlockBindings, removeAllBlockBindings };
}
//# sourceMappingURL=use-block-bindings-utils.cjs.map
