// packages/editor/src/dataviews/store/private-actions.ts
import { store as coreStore } from "@wordpress/core-data";
import { doAction } from "@wordpress/hooks";
import {
  viewPost,
  viewPostRevisions,
  duplicatePost,
  duplicatePattern,
  reorderPage,
  exportPattern,
  permanentlyDeletePost,
  restorePost,
  trashPost,
  renamePost,
  resetPost,
  deletePost,
  duplicateTemplatePart,
  featuredImageField,
  dateField,
  parentField,
  passwordField,
  commentStatusField,
  pingStatusField,
  discussionField,
  slugField,
  statusField,
  authorField,
  titleField,
  templateField,
  templateTitleField,
  pageTitleField,
  patternTitleField,
  notesField,
  scheduledDateField
} from "@wordpress/fields";
import {
  altTextField,
  attachedToField,
  authorField as mediaAuthorField,
  captionField,
  dateAddedField,
  descriptionField,
  filenameField,
  filesizeField,
  mediaDimensionsField,
  mimeTypeField
} from "@wordpress/media-fields";
import { store as editorStore } from "../../store/index.mjs";
import { ATTACHMENT_POST_TYPE, DESIGN_POST_TYPES } from "../../store/constants.mjs";
import postPreviewField from "../fields/content-preview/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
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
  dateAddedField,
  mediaAuthorField,
  filenameField,
  mimeTypeField,
  filesizeField,
  mediaDimensionsField,
  attachedToField,
  // Regular layout fields (always visible).
  titleField,
  altTextField,
  captionField,
  descriptionField
];
var registerPostTypeSchema = (postType) => async ({ registry }) => {
  const isReady = unlock(registry.select(editorStore)).isEntityReady(
    "postType",
    postType
  );
  if (isReady) {
    return;
  }
  unlock(registry.dispatch(editorStore)).setIsReady(
    "postType",
    postType
  );
  const postTypeConfig = await registry.resolveSelect(coreStore).getPostType(postType);
  const canCreate = await registry.resolveSelect(coreStore).canUser("create", {
    kind: "postType",
    name: postType
  });
  const currentTheme = await registry.resolveSelect(coreStore).getCurrentTheme();
  let canDuplicate = !["wp_block", "wp_template_part"].includes(
    postTypeConfig.slug
  ) && canCreate && duplicatePost;
  if (!globalThis.IS_GUTENBERG_PLUGIN) {
    if ("wp_template" !== postTypeConfig.slug) {
      canDuplicate = void 0;
    }
  }
  if (postTypeConfig.slug === "wp_template" && !window?.__experimentalTemplateActivate) {
    canDuplicate = void 0;
  }
  const actions = [
    postTypeConfig.viewable ? viewPost : void 0,
    !!postTypeConfig.supports?.revisions ? viewPostRevisions : void 0,
    // @ts-ignore
    canDuplicate,
    postTypeConfig.slug === "wp_template_part" && canCreate && currentTheme?.is_block_theme ? duplicateTemplatePart : void 0,
    canCreate && postTypeConfig.slug === "wp_block" ? duplicatePattern : void 0,
    postTypeConfig.supports?.title ? renamePost : void 0,
    postTypeConfig.supports?.["page-attributes"] ? reorderPage : void 0,
    postTypeConfig.slug === "wp_block" ? exportPattern : void 0,
    restorePost,
    resetPost,
    deletePost,
    trashPost,
    permanentlyDeletePost
  ].filter(Boolean);
  let fields;
  if (postType === ATTACHMENT_POST_TYPE) {
    fields = ORDERED_MEDIA_FIELDS;
  } else {
    fields = [
      postTypeConfig.supports?.thumbnail && currentTheme?.theme_supports?.["post-thumbnails"] && featuredImageField,
      postTypeConfig.supports?.author && authorField,
      statusField,
      !DESIGN_POST_TYPES.includes(postTypeConfig.slug) && dateField,
      !DESIGN_POST_TYPES.includes(postTypeConfig.slug) && scheduledDateField,
      slugField,
      postTypeConfig.supports?.["page-attributes"] && parentField,
      postTypeConfig.supports?.comments && commentStatusField,
      postTypeConfig.supports?.trackbacks && pingStatusField,
      (postTypeConfig.supports?.comments || postTypeConfig.supports?.trackbacks) && discussionField,
      templateField,
      passwordField,
      postTypeConfig.supports?.editor && postTypeConfig.viewable && postPreviewField,
      hasEditorNotesSupport(postTypeConfig.supports) && notesField
    ].filter(Boolean);
    if (postTypeConfig.supports?.title) {
      let _titleField;
      if (postType === "page") {
        _titleField = pageTitleField;
      } else if (postType === "wp_template") {
        _titleField = templateTitleField;
      } else if (postType === "wp_block") {
        _titleField = patternTitleField;
      } else {
        _titleField = titleField;
      }
      fields.push(_titleField);
    }
  }
  registry.batch(() => {
    actions.forEach((action) => {
      unlock(registry.dispatch(editorStore)).registerEntityAction(
        "postType",
        postType,
        action
      );
    });
    fields.forEach((field) => {
      unlock(registry.dispatch(editorStore)).registerEntityField(
        "postType",
        postType,
        field
      );
    });
  });
  doAction("core.registerPostTypeSchema", postType);
};
export {
  registerEntityAction,
  registerEntityField,
  registerPostTypeSchema,
  setIsReady,
  unregisterEntityAction,
  unregisterEntityField
};
//# sourceMappingURL=private-actions.mjs.map
