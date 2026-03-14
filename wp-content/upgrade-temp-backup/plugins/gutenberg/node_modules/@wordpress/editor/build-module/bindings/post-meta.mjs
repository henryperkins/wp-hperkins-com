// packages/editor/src/bindings/post-meta.js
import { store as coreDataStore } from "@wordpress/core-data";
import { store as editorStore } from "../store/index.mjs";
import { unlock } from "../lock-unlock.mjs";
function getPostMetaFields(select, context) {
  const { getRegisteredPostMeta } = unlock(select(coreDataStore));
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
  const { getEditedEntityRecord } = select(coreDataStore);
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
    dispatch(coreDataStore).editEntityRecord(
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
    const areCustomFieldsEnabled = select(editorStore).getEditorSettings().enableCustomFields;
    if (areCustomFieldsEnabled) {
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
  getFieldsList({ select, context }) {
    const metaFields = getPostMetaFields(select, context);
    return metaFields.map(
      ({ default: defaultProp, ...otherProps }) => ({
        ...otherProps
      })
    );
  }
};
export {
  post_meta_default as default
};
//# sourceMappingURL=post-meta.mjs.map
