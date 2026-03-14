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

// packages/editor/src/dataviews/store/private-actions.ts
var private_actions_exports = {};
__export(private_actions_exports, {
  registerEntityAction: () => registerEntityAction,
  registerEntityField: () => registerEntityField,
  registerPostTypeSchema: () => registerPostTypeSchema,
  setIsReady: () => setIsReady,
  unregisterEntityAction: () => unregisterEntityAction,
  unregisterEntityField: () => unregisterEntityField
});
module.exports = __toCommonJS(private_actions_exports);
var import_core_data = require("@wordpress/core-data");
var import_hooks = require("@wordpress/hooks");
var import_fields = require("@wordpress/fields");
var import_media_fields = require("@wordpress/media-fields");
var import_store = require("../../store/index.cjs");
var import_constants = require("../../store/constants.cjs");
var import_content_preview = __toESM(require("../fields/content-preview/index.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
function hasEditorNotesSupport(supports) {
  const editor = supports?.editor;
  if (Array.isArray(editor)) {
    return !!editor[0]?.notes;
  }
  return false;
}
function registerEntityAction(kind, name, config) {
  return {
    type: "REGISTER_ENTITY_ACTION",
    kind,
    name,
    config
  };
}
function unregisterEntityAction(kind, name, actionId) {
  return {
    type: "UNREGISTER_ENTITY_ACTION",
    kind,
    name,
    actionId
  };
}
function registerEntityField(kind, name, config) {
  return {
    type: "REGISTER_ENTITY_FIELD",
    kind,
    name,
    config
  };
}
function unregisterEntityField(kind, name, fieldId) {
  return {
    type: "UNREGISTER_ENTITY_FIELD",
    kind,
    name,
    fieldId
  };
}
function setIsReady(kind, name) {
  return {
    type: "SET_IS_READY",
    kind,
    name
  };
}
var ORDERED_MEDIA_FIELDS = [
  // Metadata in panels (collapsed by default).
  import_media_fields.dateAddedField,
  import_media_fields.authorField,
  import_media_fields.filenameField,
  import_media_fields.mimeTypeField,
  import_media_fields.filesizeField,
  import_media_fields.mediaDimensionsField,
  import_media_fields.attachedToField,
  // Regular layout fields (always visible).
  import_fields.titleField,
  import_media_fields.altTextField,
  import_media_fields.captionField,
  import_media_fields.descriptionField
];
var registerPostTypeSchema = (postType) => async ({ registry }) => {
  const isReady = (0, import_lock_unlock.unlock)(registry.select(import_store.store)).isEntityReady(
    "postType",
    postType
  );
  if (isReady) {
    return;
  }
  (0, import_lock_unlock.unlock)(registry.dispatch(import_store.store)).setIsReady(
    "postType",
    postType
  );
  const postTypeConfig = await registry.resolveSelect(import_core_data.store).getPostType(postType);
  const canCreate = await registry.resolveSelect(import_core_data.store).canUser("create", {
    kind: "postType",
    name: postType
  });
  const currentTheme = await registry.resolveSelect(import_core_data.store).getCurrentTheme();
  let canDuplicate = !["wp_block", "wp_template_part"].includes(
    postTypeConfig.slug
  ) && canCreate && import_fields.duplicatePost;
  if (!globalThis.IS_GUTENBERG_PLUGIN) {
    if ("wp_template" !== postTypeConfig.slug) {
      canDuplicate = void 0;
    }
  }
  if (postTypeConfig.slug === "wp_template" && !window?.__experimentalTemplateActivate) {
    canDuplicate = void 0;
  }
  const actions = [
    postTypeConfig.viewable ? import_fields.viewPost : void 0,
    !!postTypeConfig.supports?.revisions ? import_fields.viewPostRevisions : void 0,
    // @ts-ignore
    canDuplicate,
    postTypeConfig.slug === "wp_template_part" && canCreate && currentTheme?.is_block_theme ? import_fields.duplicateTemplatePart : void 0,
    canCreate && postTypeConfig.slug === "wp_block" ? import_fields.duplicatePattern : void 0,
    postTypeConfig.supports?.title ? import_fields.renamePost : void 0,
    postTypeConfig.supports?.["page-attributes"] ? import_fields.reorderPage : void 0,
    postTypeConfig.slug === "wp_block" ? import_fields.exportPattern : void 0,
    import_fields.restorePost,
    import_fields.resetPost,
    import_fields.deletePost,
    import_fields.trashPost,
    import_fields.permanentlyDeletePost
  ].filter(Boolean);
  let fields;
  if (postType === import_constants.ATTACHMENT_POST_TYPE) {
    fields = ORDERED_MEDIA_FIELDS;
  } else {
    fields = [
      postTypeConfig.supports?.thumbnail && currentTheme?.theme_supports?.["post-thumbnails"] && import_fields.featuredImageField,
      postTypeConfig.supports?.author && import_fields.authorField,
      import_fields.statusField,
      !import_constants.DESIGN_POST_TYPES.includes(postTypeConfig.slug) && import_fields.dateField,
      !import_constants.DESIGN_POST_TYPES.includes(postTypeConfig.slug) && import_fields.scheduledDateField,
      import_fields.slugField,
      postTypeConfig.supports?.["page-attributes"] && import_fields.parentField,
      postTypeConfig.supports?.comments && import_fields.commentStatusField,
      postTypeConfig.supports?.trackbacks && import_fields.pingStatusField,
      (postTypeConfig.supports?.comments || postTypeConfig.supports?.trackbacks) && import_fields.discussionField,
      import_fields.templateField,
      import_fields.passwordField,
      postTypeConfig.supports?.editor && postTypeConfig.viewable && import_content_preview.default,
      hasEditorNotesSupport(postTypeConfig.supports) && import_fields.notesField
    ].filter(Boolean);
    if (postTypeConfig.supports?.title) {
      let _titleField;
      if (postType === "page") {
        _titleField = import_fields.pageTitleField;
      } else if (postType === "wp_template") {
        _titleField = import_fields.templateTitleField;
      } else if (postType === "wp_block") {
        _titleField = import_fields.patternTitleField;
      } else {
        _titleField = import_fields.titleField;
      }
      fields.push(_titleField);
    }
  }
  registry.batch(() => {
    actions.forEach((action) => {
      (0, import_lock_unlock.unlock)(registry.dispatch(import_store.store)).registerEntityAction(
        "postType",
        postType,
        action
      );
    });
    fields.forEach((field) => {
      (0, import_lock_unlock.unlock)(registry.dispatch(import_store.store)).registerEntityField(
        "postType",
        postType,
        field
      );
    });
  });
  (0, import_hooks.doAction)("core.registerPostTypeSchema", postType);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  registerEntityAction,
  registerEntityField,
  registerPostTypeSchema,
  setIsReady,
  unregisterEntityAction,
  unregisterEntityField
});
//# sourceMappingURL=private-actions.cjs.map
