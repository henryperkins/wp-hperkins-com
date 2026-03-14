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

// packages/editor/src/bindings/term-data.js
var term_data_exports = {};
__export(term_data_exports, {
  default: () => term_data_default,
  termDataFields: () => termDataFields
});
module.exports = __toCommonJS(term_data_exports);
var import_i18n = require("@wordpress/i18n");
var import_core_data = require("@wordpress/core-data");
var import_block_editor = require("@wordpress/block-editor");
var NAVIGATION_BLOCK_TYPES = [
  "core/navigation-link",
  "core/navigation-submenu"
];
var termDataFields = [
  {
    label: (0, import_i18n.__)("Term ID"),
    args: { field: "id" },
    type: "string"
  },
  {
    label: (0, import_i18n.__)("Name"),
    args: { field: "name" },
    type: "string"
  },
  {
    label: (0, import_i18n.__)("Slug"),
    args: { field: "slug" },
    type: "string"
  },
  {
    label: (0, import_i18n.__)("Link"),
    args: { field: "link" },
    type: "string"
  },
  {
    label: (0, import_i18n.__)("Description"),
    args: { field: "description" },
    type: "string"
  },
  {
    label: (0, import_i18n.__)("Parent ID"),
    args: { field: "parent" },
    type: "string"
  },
  {
    label: (0, import_i18n.__)("Count"),
    args: { field: "count" },
    type: "string"
  }
];
var term_data_default = {
  name: "core/term-data",
  usesContext: ["taxonomy", "termId", "termData"],
  getValues({ select, context, bindings, clientId }) {
    const { getEntityRecord } = select(import_core_data.store);
    const { getBlockAttributes, getBlockName } = select(import_block_editor.store);
    const blockName = getBlockName(clientId);
    const isNavigationBlock = NAVIGATION_BLOCK_TYPES.includes(blockName);
    let termDataValues;
    if (isNavigationBlock) {
      const blockAttributes = getBlockAttributes(clientId);
      const typeFromAttributes = blockAttributes?.type;
      const taxonomy = typeFromAttributes === "tag" ? "post_tag" : typeFromAttributes;
      termDataValues = getEntityRecord(
        "taxonomy",
        taxonomy,
        blockAttributes?.id
      );
    } else if (context.termId && context.taxonomy) {
      termDataValues = getEntityRecord(
        "taxonomy",
        context.taxonomy,
        context.termId
      );
    }
    if (!termDataValues && context?.termData && !isNavigationBlock) {
      termDataValues = context.termData;
    }
    const newValues = {};
    for (const [attributeName, binding] of Object.entries(bindings)) {
      const termDataField = termDataFields.find(
        (field) => field.args.field === binding.args.field
      );
      if (!termDataField) {
        newValues[attributeName] = binding.args.field;
      } else if (!termDataValues || termDataValues[binding.args.field] === void 0) {
        newValues[attributeName] = termDataField.label;
      } else if (binding.args.field === "count") {
        newValues[attributeName] = "(" + termDataValues[binding.args.field] + ")";
      } else {
        newValues[attributeName] = termDataValues[binding.args.field];
      }
    }
    return newValues;
  },
  // eslint-disable-next-line no-unused-vars
  setValues({ dispatch, context, bindings }) {
    return false;
  },
  canUserEditValue({ select, context }) {
    const { getBlockName, getSelectedBlockClientId } = select(import_block_editor.store);
    const clientId = getSelectedBlockClientId();
    const blockName = getBlockName(clientId);
    if (NAVIGATION_BLOCK_TYPES.includes(blockName)) {
      return false;
    }
    if (context?.termQuery) {
      return false;
    }
    if (!context?.taxonomy || !context?.termId) {
      return false;
    }
    return false;
  },
  getFieldsList({ context, select }) {
    const { getBlockAttributes, getBlockName, getSelectedBlockClientId } = select(import_block_editor.store);
    const clientId = getSelectedBlockClientId();
    const blockName = getBlockName(clientId);
    if (NAVIGATION_BLOCK_TYPES.includes(blockName)) {
      const blockAttributes = getBlockAttributes(clientId);
      if (!blockAttributes || !blockAttributes.id || !blockAttributes.type) {
        return [];
      }
      return termDataFields;
    }
    if (!context) {
      return [];
    }
    if (context.taxonomy && context.termId || context.termData) {
      return termDataFields;
    }
    return [];
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  termDataFields
});
//# sourceMappingURL=term-data.cjs.map
