// packages/editor/src/bindings/post-data.js
import { __ } from "@wordpress/i18n";
import { store as coreDataStore } from "@wordpress/core-data";
import { store as blockEditorStore } from "@wordpress/block-editor";
var NAVIGATION_BLOCK_TYPES = [
  "core/navigation-link",
  "core/navigation-submenu"
];
var postDataFields = [
  {
    label: __("Post Date"),
    args: { field: "date" },
    type: "string"
  },
  {
    label: __("Post Modified Date"),
    args: { field: "modified" },
    type: "string"
  },
  {
    label: __("Post Link"),
    args: { field: "link" },
    type: "string"
  }
];
var post_data_default = {
  name: "core/post-data",
  getValues({ select, context, bindings, clientId }) {
    const { getBlockAttributes, getBlockName } = select(blockEditorStore);
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
    const { getEditedEntityRecord } = select(coreDataStore);
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
    const { getBlockName } = select(blockEditorStore);
    const blockName = getBlockName(clientId);
    if (NAVIGATION_BLOCK_TYPES.includes(blockName)) {
      return false;
    }
    const newData = {};
    Object.values(bindings).forEach(({ args, newValue }) => {
      newData[args.field] = newValue;
    });
    dispatch(coreDataStore).editEntityRecord(
      "postType",
      context?.postType,
      context?.postId,
      newData
    );
  },
  canUserEditValue({ select, context }) {
    const { getBlockName, getSelectedBlockClientId } = select(blockEditorStore);
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
    const canUserEdit = select(coreDataStore).canUser("update", {
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
    const selectedBlock = select(blockEditorStore).getSelectedBlock();
    if (selectedBlock?.name !== "core/post-date") {
      return [];
    }
    if (!context || !context.postId || !context.postType) {
      return [];
    }
    return postDataFields;
  }
};
export {
  post_data_default as default
};
//# sourceMappingURL=post-data.mjs.map
