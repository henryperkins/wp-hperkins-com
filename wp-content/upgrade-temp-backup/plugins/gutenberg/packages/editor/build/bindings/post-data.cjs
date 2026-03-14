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

// packages/editor/src/bindings/post-data.js
var post_data_exports = {};
__export(post_data_exports, {
  default: () => post_data_default
});
module.exports = __toCommonJS(post_data_exports);
var import_i18n = require("@wordpress/i18n");
var import_core_data = require("@wordpress/core-data");
var import_block_editor = require("@wordpress/block-editor");
var NAVIGATION_BLOCK_TYPES = [
  "core/navigation-link",
  "core/navigation-submenu"
];
var postDataFields = [
  {
    label: (0, import_i18n.__)("Post Date"),
    args: { field: "date" },
    type: "string"
  },
  {
    label: (0, import_i18n.__)("Post Modified Date"),
    args: { field: "modified" },
    type: "string"
  },
  {
    label: (0, import_i18n.__)("Post Link"),
    args: { field: "link" },
    type: "string"
  }
];
var post_data_default = {
  name: "core/post-data",
  getValues({ select, context, bindings, clientId }) {
    const { getBlockAttributes, getBlockName } = select(import_block_editor.store);
    const blockName = getBlockName(clientId);
    const isNavigationBlock = NAVIGATION_BLOCK_TYPES.includes(blockName);
    let postId, postType;
    if (isNavigationBlock) {
      const blockAttributes = getBlockAttributes(clientId);
      postId = blockAttributes?.id;
      postType = blockAttributes?.type;
    } else {
      postId = context?.postId;
      postType = context?.postType;
    }
    const { getEditedEntityRecord } = select(import_core_data.store);
    const entityDataValues = getEditedEntityRecord(
      "postType",
      postType,
      postId
    );
    const newValues = {};
    for (const [attributeName, binding] of Object.entries(bindings)) {
      const postDataField = postDataFields.find(
        (field) => field.args.field === binding.args.field
      );
      if (!postDataField) {
        newValues[attributeName] = binding.args.field;
      } else if (!entityDataValues) {
        newValues[attributeName] = postDataField.label;
      } else {
        newValues[attributeName] = entityDataValues[binding.args.field];
      }
    }
    return newValues;
  },
  setValues({ dispatch, context, bindings, clientId, select }) {
    const { getBlockName } = select(import_block_editor.store);
    const blockName = getBlockName(clientId);
    if (NAVIGATION_BLOCK_TYPES.includes(blockName)) {
      return false;
    }
    const newData = {};
    Object.values(bindings).forEach(({ args, newValue }) => {
      newData[args.field] = newValue;
    });
    dispatch(import_core_data.store).editEntityRecord(
      "postType",
      context?.postType,
      context?.postId,
      newData
    );
  },
  canUserEditValue({ select, context }) {
    const { getBlockName, getSelectedBlockClientId } = select(import_block_editor.store);
    const clientId = getSelectedBlockClientId();
    const blockName = getBlockName(clientId);
    if (NAVIGATION_BLOCK_TYPES.includes(blockName)) {
      return false;
    }
    if (context?.query || context?.queryId) {
      return false;
    }
    if (!context?.postType) {
      return false;
    }
    const canUserEdit = select(import_core_data.store).canUser("update", {
      kind: "postType",
      name: context?.postType,
      id: context?.postId
    });
    if (!canUserEdit) {
      return false;
    }
    return true;
  },
  getFieldsList({ context, select }) {
    const selectedBlock = select(import_block_editor.store).getSelectedBlock();
    if (selectedBlock?.name !== "core/post-date") {
      return [];
    }
    if (!context || !context.postId || !context.postType) {
      return [];
    }
    return postDataFields;
  }
};
//# sourceMappingURL=post-data.cjs.map
