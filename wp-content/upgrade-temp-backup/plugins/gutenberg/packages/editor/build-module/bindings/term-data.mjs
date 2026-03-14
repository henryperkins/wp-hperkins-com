// packages/editor/src/bindings/term-data.js
import { __ } from "@wordpress/i18n";
import { store as coreDataStore } from "@wordpress/core-data";
import { store as blockEditorStore } from "@wordpress/block-editor";
var NAVIGATION_BLOCK_TYPES = [
  "core/navigation-link",
  "core/navigation-submenu"
];
var termDataFields = [
  {
    label: __("Term ID"),
    args: { field: "id" },
    type: "string"
  },
  {
    label: __("Name"),
    args: { field: "name" },
    type: "string"
  },
  {
    label: __("Slug"),
    args: { field: "slug" },
    type: "string"
  },
  {
    label: __("Link"),
    args: { field: "link" },
    type: "string"
  },
  {
    label: __("Description"),
    args: { field: "description" },
    type: "string"
  },
  {
    label: __("Parent ID"),
    args: { field: "parent" },
    type: "string"
  },
  {
    label: __("Count"),
    args: { field: "count" },
    type: "string"
  }
];
var term_data_default = {
  name: "core/term-data",
  usesContext: ["taxonomy", "termId", "termData"],
  getValues({ select, context, bindings, clientId }) {
    const { getEntityRecord } = select(coreDataStore);
    const { getBlockAttributes, getBlockName } = select(blockEditorStore);
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
    const { getBlockName, getSelectedBlockClientId } = select(blockEditorStore);
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
    const { getBlockAttributes, getBlockName, getSelectedBlockClientId } = select(blockEditorStore);
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
export {
  term_data_default as default,
  termDataFields
};
//# sourceMappingURL=term-data.mjs.map
