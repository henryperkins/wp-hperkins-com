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

// packages/editor/src/bindings/post-meta.js
var post_meta_exports = {};
__export(post_meta_exports, {
  default: () => post_meta_default
});
module.exports = __toCommonJS(post_meta_exports);
var import_core_data = require("@wordpress/core-data");
var import_store = require("../store/index.cjs");
var import_lock_unlock = require("../lock-unlock.cjs");
function getPostMetaFields(select, context) {
  const { getRegisteredPostMeta } = (0, import_lock_unlock.unlock)(select(import_core_data.store));
  const registeredFields = getRegisteredPostMeta(context?.postType);
  const metaFields = [];
  Object.entries(registeredFields).forEach(([key, props]) => {
    if (key === "footnotes" || key.charAt(0) === "_") {
      return;
    }
    metaFields.push({
      label: props.title || key,
      args: { key },
      default: props.default,
      type: props.type
    });
  });
  return metaFields;
}
function getValue({ select, context, args }) {
  const metaFields = getPostMetaFields(select, context);
  const metaField = metaFields.find(
    (field) => field.args.key === args.key
  );
  if (!metaField) {
    return args.key;
  }
  if (!context?.postId) {
    return metaField.default || metaField.label || args.key;
  }
  const { getEditedEntityRecord } = select(import_core_data.store);
  const entityMetaValues = getEditedEntityRecord(
    "postType",
    context?.postType,
    context?.postId
  ).meta;
  return entityMetaValues?.[args.key] ?? metaField?.label ?? args.key;
}
var post_meta_default = {
  name: "core/post-meta",
  getValues({ select, context, bindings }) {
    const newValues = {};
    for (const [attributeName, binding] of Object.entries(bindings)) {
      newValues[attributeName] = getValue({
        select,
        context,
        args: binding.args
      });
    }
    return newValues;
  },
  setValues({ dispatch, context, bindings }) {
    const newMeta = {};
    Object.values(bindings).forEach(({ args, newValue }) => {
      newMeta[args.key] = newValue;
    });
    dispatch(import_core_data.store).editEntityRecord(
      "postType",
      context?.postType,
      context?.postId,
      {
        meta: newMeta
      }
    );
  },
  canUserEditValue({ select, context, args }) {
    if (context?.query || context?.queryId) {
      return false;
    }
    if (!context?.postType) {
      return false;
    }
    const metaFields = getPostMetaFields(select, context);
    const hasMatchingMetaField = metaFields.some(
      (field) => field.args.key === args.key
    );
    if (!hasMatchingMetaField) {
      return false;
    }
    const areCustomFieldsEnabled = select(import_store.store).getEditorSettings().enableCustomFields;
    if (areCustomFieldsEnabled) {
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
  getFieldsList({ select, context }) {
    const metaFields = getPostMetaFields(select, context);
    return metaFields.map(
      ({ default: defaultProp, ...otherProps }) => ({
        ...otherProps
      })
    );
  }
};
//# sourceMappingURL=post-meta.cjs.map
