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

// packages/editor/src/store/selectors.js
var selectors_exports = {};
__export(selectors_exports, {
  __experimentalGetDefaultTemplatePartAreas: () => __experimentalGetDefaultTemplatePartAreas,
  __experimentalGetDefaultTemplateType: () => __experimentalGetDefaultTemplateType,
  __experimentalGetDefaultTemplateTypes: () => __experimentalGetDefaultTemplateTypes,
  __experimentalGetTemplateInfo: () => __experimentalGetTemplateInfo,
  __unstableIsEditorReady: () => __unstableIsEditorReady,
  canInsertBlockType: () => canInsertBlockType,
  canUserUseUnfilteredHTML: () => canUserUseUnfilteredHTML,
  didPostSaveRequestFail: () => didPostSaveRequestFail,
  didPostSaveRequestSucceed: () => didPostSaveRequestSucceed,
  getActivePostLock: () => getActivePostLock,
  getAdjacentBlockClientId: () => getAdjacentBlockClientId,
  getAutosaveAttribute: () => getAutosaveAttribute,
  getBlock: () => getBlock,
  getBlockAttributes: () => getBlockAttributes,
  getBlockCount: () => getBlockCount,
  getBlockHierarchyRootClientId: () => getBlockHierarchyRootClientId,
  getBlockIndex: () => getBlockIndex,
  getBlockInsertionPoint: () => getBlockInsertionPoint,
  getBlockListSettings: () => getBlockListSettings,
  getBlockMode: () => getBlockMode,
  getBlockName: () => getBlockName,
  getBlockOrder: () => getBlockOrder,
  getBlockRootClientId: () => getBlockRootClientId,
  getBlockSelectionEnd: () => getBlockSelectionEnd,
  getBlockSelectionStart: () => getBlockSelectionStart,
  getBlocks: () => getBlocks,
  getBlocksByClientId: () => getBlocksByClientId,
  getClientIdsOfDescendants: () => getClientIdsOfDescendants,
  getClientIdsWithDescendants: () => getClientIdsWithDescendants,
  getCurrentPost: () => getCurrentPost,
  getCurrentPostAttribute: () => getCurrentPostAttribute,
  getCurrentPostId: () => getCurrentPostId,
  getCurrentPostLastRevisionId: () => getCurrentPostLastRevisionId,
  getCurrentPostRevisionsCount: () => getCurrentPostRevisionsCount,
  getCurrentPostType: () => getCurrentPostType,
  getCurrentTemplateId: () => getCurrentTemplateId,
  getDeviceType: () => getDeviceType,
  getEditedPostAttribute: () => getEditedPostAttribute,
  getEditedPostContent: () => getEditedPostContent,
  getEditedPostPreviewLink: () => getEditedPostPreviewLink,
  getEditedPostSlug: () => getEditedPostSlug,
  getEditedPostVisibility: () => getEditedPostVisibility,
  getEditorBlocks: () => getEditorBlocks,
  getEditorMode: () => getEditorMode,
  getEditorSelection: () => getEditorSelection,
  getEditorSelectionEnd: () => getEditorSelectionEnd,
  getEditorSelectionStart: () => getEditorSelectionStart,
  getEditorSettings: () => getEditorSettings,
  getFirstMultiSelectedBlockClientId: () => getFirstMultiSelectedBlockClientId,
  getGlobalBlockCount: () => getGlobalBlockCount,
  getInserterItems: () => getInserterItems,
  getLastMultiSelectedBlockClientId: () => getLastMultiSelectedBlockClientId,
  getMultiSelectedBlockClientIds: () => getMultiSelectedBlockClientIds,
  getMultiSelectedBlocks: () => getMultiSelectedBlocks,
  getMultiSelectedBlocksEndClientId: () => getMultiSelectedBlocksEndClientId,
  getMultiSelectedBlocksStartClientId: () => getMultiSelectedBlocksStartClientId,
  getNextBlockClientId: () => getNextBlockClientId,
  getPermalink: () => getPermalink,
  getPermalinkParts: () => getPermalinkParts,
  getPostEdits: () => getPostEdits,
  getPostLockUser: () => getPostLockUser,
  getPostTypeLabel: () => getPostTypeLabel,
  getPreviousBlockClientId: () => getPreviousBlockClientId,
  getRenderingMode: () => getRenderingMode,
  getSelectedBlock: () => getSelectedBlock,
  getSelectedBlockClientId: () => getSelectedBlockClientId,
  getSelectedBlockCount: () => getSelectedBlockCount,
  getSelectedBlocksInitialCaretPosition: () => getSelectedBlocksInitialCaretPosition,
  getStateBeforeOptimisticTransaction: () => getStateBeforeOptimisticTransaction,
  getSuggestedPostFormat: () => getSuggestedPostFormat,
  getTemplate: () => getTemplate,
  getTemplateLock: () => getTemplateLock,
  hasChangedContent: () => hasChangedContent,
  hasEditorRedo: () => hasEditorRedo,
  hasEditorUndo: () => hasEditorUndo,
  hasInserterItems: () => hasInserterItems,
  hasMultiSelection: () => hasMultiSelection,
  hasNonPostEntityChanges: () => hasNonPostEntityChanges,
  hasSelectedBlock: () => hasSelectedBlock,
  hasSelectedInnerBlock: () => hasSelectedInnerBlock,
  inSomeHistory: () => inSomeHistory,
  isAncestorMultiSelected: () => isAncestorMultiSelected,
  isAutosavingPost: () => isAutosavingPost,
  isBlockInsertionPointVisible: () => isBlockInsertionPointVisible,
  isBlockMultiSelected: () => isBlockMultiSelected,
  isBlockSelected: () => isBlockSelected,
  isBlockValid: () => isBlockValid,
  isBlockWithinSelection: () => isBlockWithinSelection,
  isCaretWithinFormattedText: () => isCaretWithinFormattedText,
  isCleanNewPost: () => isCleanNewPost,
  isCollaborationEnabledForCurrentPost: () => isCollaborationEnabledForCurrentPost,
  isCurrentPostPending: () => isCurrentPostPending,
  isCurrentPostPublished: () => isCurrentPostPublished,
  isCurrentPostScheduled: () => isCurrentPostScheduled,
  isDeletingPost: () => isDeletingPost,
  isEditedPostAutosaveable: () => isEditedPostAutosaveable,
  isEditedPostBeingScheduled: () => isEditedPostBeingScheduled,
  isEditedPostDateFloating: () => isEditedPostDateFloating,
  isEditedPostDirty: () => isEditedPostDirty,
  isEditedPostEmpty: () => isEditedPostEmpty,
  isEditedPostNew: () => isEditedPostNew,
  isEditedPostPublishable: () => isEditedPostPublishable,
  isEditedPostSaveable: () => isEditedPostSaveable,
  isEditorPanelEnabled: () => isEditorPanelEnabled,
  isEditorPanelOpened: () => isEditorPanelOpened,
  isEditorPanelRemoved: () => isEditorPanelRemoved,
  isFirstMultiSelectedBlock: () => isFirstMultiSelectedBlock,
  isInserterOpened: () => isInserterOpened,
  isListViewOpened: () => isListViewOpened,
  isMultiSelecting: () => isMultiSelecting,
  isPermalinkEditable: () => isPermalinkEditable,
  isPostAutosavingLocked: () => isPostAutosavingLocked,
  isPostLockTakeover: () => isPostLockTakeover,
  isPostLocked: () => isPostLocked,
  isPostSavingLocked: () => isPostSavingLocked,
  isPreviewingPost: () => isPreviewingPost,
  isPublishSidebarEnabled: () => isPublishSidebarEnabled,
  isPublishSidebarOpened: () => isPublishSidebarOpened,
  isPublishingPost: () => isPublishingPost,
  isSavingNonPostEntityChanges: () => isSavingNonPostEntityChanges,
  isSavingPost: () => isSavingPost,
  isSelectionEnabled: () => isSelectionEnabled,
  isTyping: () => isTyping,
  isValidTemplate: () => isValidTemplate
});
module.exports = __toCommonJS(selectors_exports);
var import_blocks = require("@wordpress/blocks");
var import_date = require("@wordpress/date");
var import_url = require("@wordpress/url");
var import_data = require("@wordpress/data");
var import_deprecated = __toESM(require("@wordpress/deprecated"));
var import_element = require("@wordpress/element");
var import_block_editor = require("@wordpress/block-editor");
var import_core_data = require("@wordpress/core-data");
var import_preferences = require("@wordpress/preferences");
var import_constants = require("./constants.cjs");
var import_reducer = require("./reducer.cjs");
var import_get_template_part_icon = require("../utils/get-template-part-icon.cjs");
var import_lock_unlock = require("../lock-unlock.cjs");
var import_get_template_info = require("../utils/get-template-info.cjs");
var EMPTY_OBJECT = {};
var hasEditorUndo = (0, import_data.createRegistrySelector)((select) => () => {
  return select(import_core_data.store).hasUndo();
});
var hasEditorRedo = (0, import_data.createRegistrySelector)((select) => () => {
  return select(import_core_data.store).hasRedo();
});
function isEditedPostNew(state) {
  return getCurrentPost(state).status === "auto-draft";
}
function hasChangedContent(state) {
  const edits = getPostEdits(state);
  return "content" in edits;
}
var isEditedPostDirty = (0, import_data.createRegistrySelector)(
  (select) => (state) => {
    const postType = getCurrentPostType(state);
    const postId = getCurrentPostId(state);
    return select(import_core_data.store).hasEditsForEntityRecord(
      "postType",
      postType,
      postId
    );
  }
);
var hasNonPostEntityChanges = (0, import_data.createRegistrySelector)(
  (select) => (state) => {
    const dirtyEntityRecords = select(import_core_data.store).__experimentalGetDirtyEntityRecords();
    const { type, id } = getCurrentPost(state);
    return dirtyEntityRecords.some(
      (entityRecord) => entityRecord.kind !== "postType" || entityRecord.name !== type || entityRecord.key !== id
    );
  }
);
function isCleanNewPost(state) {
  return !isEditedPostDirty(state) && isEditedPostNew(state);
}
var getCurrentPost = (0, import_data.createRegistrySelector)(
  (select) => (state) => {
    const postId = getCurrentPostId(state);
    const postType = getCurrentPostType(state);
    const post = select(import_core_data.store).getRawEntityRecord(
      "postType",
      postType,
      postId
    );
    if (post) {
      return post;
    }
    return EMPTY_OBJECT;
  }
);
function getCurrentPostType(state) {
  return state.postType;
}
function getCurrentPostId(state) {
  return state.postId;
}
function getCurrentTemplateId(state) {
  return state.templateId;
}
function getCurrentPostRevisionsCount(state) {
  return getCurrentPost(state)._links?.["version-history"]?.[0]?.count ?? 0;
}
function getCurrentPostLastRevisionId(state) {
  return getCurrentPost(state)._links?.["predecessor-version"]?.[0]?.id ?? null;
}
var getPostEdits = (0, import_data.createRegistrySelector)((select) => (state) => {
  const postType = getCurrentPostType(state);
  const postId = getCurrentPostId(state);
  return select(import_core_data.store).getEntityRecordEdits(
    "postType",
    postType,
    postId
  ) || EMPTY_OBJECT;
});
function getCurrentPostAttribute(state, attributeName) {
  switch (attributeName) {
    case "type":
      return getCurrentPostType(state);
    case "id":
      return getCurrentPostId(state);
    default:
      const post = getCurrentPost(state);
      if (!post.hasOwnProperty(attributeName)) {
        break;
      }
      return (0, import_reducer.getPostRawValue)(post[attributeName]);
  }
}
var getNestedEditedPostProperty = (0, import_data.createSelector)(
  (state, attributeName) => {
    const edits = getPostEdits(state);
    if (!edits.hasOwnProperty(attributeName)) {
      return getCurrentPostAttribute(state, attributeName);
    }
    return {
      ...getCurrentPostAttribute(state, attributeName),
      ...edits[attributeName]
    };
  },
  (state, attributeName) => [
    getCurrentPostAttribute(state, attributeName),
    getPostEdits(state)[attributeName]
  ]
);
function getEditedPostAttribute(state, attributeName) {
  switch (attributeName) {
    case "content":
      return getEditedPostContent(state);
  }
  const edits = getPostEdits(state);
  if (!edits.hasOwnProperty(attributeName)) {
    return getCurrentPostAttribute(state, attributeName);
  }
  if (import_constants.EDIT_MERGE_PROPERTIES.has(attributeName)) {
    return getNestedEditedPostProperty(state, attributeName);
  }
  return edits[attributeName];
}
var getAutosaveAttribute = (0, import_data.createRegistrySelector)(
  (select) => (state, attributeName) => {
    if (!import_constants.AUTOSAVE_PROPERTIES.includes(attributeName) && attributeName !== "preview_link") {
      return;
    }
    const postType = getCurrentPostType(state);
    const postId = getCurrentPostId(state);
    const currentUserId = select(import_core_data.store).getCurrentUser()?.id;
    const autosave = select(import_core_data.store).getAutosave(
      postType,
      postId,
      currentUserId
    );
    if (autosave) {
      return (0, import_reducer.getPostRawValue)(autosave[attributeName]);
    }
  }
);
function getEditedPostVisibility(state) {
  const status = getEditedPostAttribute(state, "status");
  if (status === "private") {
    return "private";
  }
  const password = getEditedPostAttribute(state, "password");
  if (password) {
    return "password";
  }
  return "public";
}
function isCurrentPostPending(state) {
  return getCurrentPost(state).status === "pending";
}
function isCurrentPostPublished(state, currentPost) {
  const post = currentPost || getCurrentPost(state);
  return ["publish", "private"].indexOf(post.status) !== -1 || post.status === "future" && !(0, import_date.isInTheFuture)(
    new Date(Number((0, import_date.getDate)(post.date)) - import_constants.ONE_MINUTE_IN_MS)
  );
}
function isCurrentPostScheduled(state) {
  return getCurrentPost(state).status === "future" && !isCurrentPostPublished(state);
}
function isEditedPostPublishable(state) {
  const post = getCurrentPost(state);
  if (post.type === import_constants.ATTACHMENT_POST_TYPE) {
    return isEditedPostDirty(state);
  }
  return isEditedPostDirty(state) || ["publish", "private", "future"].indexOf(post.status) === -1;
}
function isEditedPostSaveable(state) {
  if (isSavingPost(state)) {
    return false;
  }
  return !!getEditedPostAttribute(state, "title") || !!getEditedPostAttribute(state, "excerpt") || !isEditedPostEmpty(state) || import_element.Platform.OS === "native";
}
var isEditedPostEmpty = (0, import_data.createRegistrySelector)(
  (select) => (state) => {
    const postId = getCurrentPostId(state);
    const postType = getCurrentPostType(state);
    const record = select(import_core_data.store).getEditedEntityRecord(
      "postType",
      postType,
      postId
    );
    if (typeof record.content !== "function") {
      return !record.content;
    }
    const blocks = getEditedPostAttribute(state, "blocks");
    if (blocks.length === 0) {
      return true;
    }
    if (blocks.length > 1) {
      return false;
    }
    const blockName = blocks[0].name;
    if (blockName !== (0, import_blocks.getDefaultBlockName)() && blockName !== (0, import_blocks.getFreeformContentHandlerName)()) {
      return false;
    }
    return !getEditedPostContent(state);
  }
);
var isEditedPostAutosaveable = (0, import_data.createRegistrySelector)(
  (select) => (state) => {
    if (!isEditedPostSaveable(state)) {
      return false;
    }
    if (isPostAutosavingLocked(state)) {
      return false;
    }
    const postType = getCurrentPostType(state);
    const postTypeObject = select(import_core_data.store).getPostType(postType);
    if (!postTypeObject?.supports?.autosave) {
      return false;
    }
    const postId = getCurrentPostId(state);
    const hasFetchedAutosave = select(import_core_data.store).hasFetchedAutosaves(
      postType,
      postId
    );
    const currentUserId = select(import_core_data.store).getCurrentUser()?.id;
    const autosave = select(import_core_data.store).getAutosave(
      postType,
      postId,
      currentUserId
    );
    if (!hasFetchedAutosave) {
      return false;
    }
    if (!autosave) {
      return true;
    }
    if (hasChangedContent(state)) {
      return true;
    }
    return ["title", "excerpt", "meta"].some(
      (field) => (0, import_reducer.getPostRawValue)(autosave[field]) !== getEditedPostAttribute(state, field)
    );
  }
);
function isEditedPostBeingScheduled(state) {
  const date = getEditedPostAttribute(state, "date");
  const checkedDate = new Date(
    Number((0, import_date.getDate)(date)) - import_constants.ONE_MINUTE_IN_MS
  );
  return (0, import_date.isInTheFuture)(checkedDate);
}
function isEditedPostDateFloating(state) {
  const date = getEditedPostAttribute(state, "date");
  const modified = getEditedPostAttribute(state, "modified");
  const status = getCurrentPost(state).status;
  if (status === "draft" || status === "auto-draft" || status === "pending") {
    return date === modified || date === null;
  }
  return false;
}
function isDeletingPost(state) {
  return !!state.deleting.pending;
}
function isSavingPost(state) {
  return !!state.saving.pending;
}
var isSavingNonPostEntityChanges = (0, import_data.createRegistrySelector)(
  (select) => (state) => {
    const entitiesBeingSaved = select(import_core_data.store).__experimentalGetEntitiesBeingSaved();
    const { type, id } = getCurrentPost(state);
    return entitiesBeingSaved.some(
      (entityRecord) => entityRecord.kind !== "postType" || entityRecord.name !== type || entityRecord.key !== id
    );
  }
);
var didPostSaveRequestSucceed = (0, import_data.createRegistrySelector)(
  (select) => (state) => {
    const postType = getCurrentPostType(state);
    const postId = getCurrentPostId(state);
    return !select(import_core_data.store).getLastEntitySaveError(
      "postType",
      postType,
      postId
    );
  }
);
var didPostSaveRequestFail = (0, import_data.createRegistrySelector)(
  (select) => (state) => {
    const postType = getCurrentPostType(state);
    const postId = getCurrentPostId(state);
    return !!select(import_core_data.store).getLastEntitySaveError(
      "postType",
      postType,
      postId
    );
  }
);
function isAutosavingPost(state) {
  return isSavingPost(state) && Boolean(state.saving.options?.isAutosave);
}
function isPreviewingPost(state) {
  return isSavingPost(state) && Boolean(state.saving.options?.isPreview);
}
function getEditedPostPreviewLink(state) {
  if (state.saving.pending || isSavingPost(state)) {
    return;
  }
  let previewLink = getAutosaveAttribute(state, "preview_link");
  if (!previewLink || "draft" === getCurrentPost(state).status) {
    previewLink = getEditedPostAttribute(state, "link");
    if (previewLink) {
      previewLink = (0, import_url.addQueryArgs)(previewLink, { preview: true });
    }
  }
  const featuredImageId = getEditedPostAttribute(state, "featured_media");
  if (previewLink && featuredImageId) {
    return (0, import_url.addQueryArgs)(previewLink, { _thumbnail_id: featuredImageId });
  }
  return previewLink;
}
var getSuggestedPostFormat = (0, import_data.createRegistrySelector)(
  (select) => () => {
    const blocks = select(import_block_editor.store).getBlocks();
    if (blocks.length > 2) {
      return null;
    }
    let name;
    if (blocks.length === 1) {
      name = blocks[0].name;
      if (name === "core/embed") {
        const provider = blocks[0].attributes?.providerNameSlug;
        if (["youtube", "vimeo"].includes(provider)) {
          name = "core/video";
        } else if (["spotify", "soundcloud"].includes(provider)) {
          name = "core/audio";
        }
      }
    }
    if (blocks.length === 2 && blocks[1].name === "core/paragraph") {
      name = blocks[0].name;
    }
    switch (name) {
      case "core/image":
        return "image";
      case "core/quote":
      case "core/pullquote":
        return "quote";
      case "core/gallery":
        return "gallery";
      case "core/video":
        return "video";
      case "core/audio":
        return "audio";
      default:
        return null;
    }
  }
);
var getEditedPostContent = (0, import_data.createRegistrySelector)(
  (select) => (state) => {
    const postId = getCurrentPostId(state);
    const postType = getCurrentPostType(state);
    const record = select(import_core_data.store).getEditedEntityRecord(
      "postType",
      postType,
      postId
    );
    if (record) {
      if (typeof record.content === "function") {
        return record.content(record);
      } else if (record.blocks) {
        return (0, import_blocks.__unstableSerializeAndClean)(record.blocks);
      } else if (record.content) {
        return record.content;
      }
    }
    return "";
  }
);
function isPublishingPost(state) {
  return isSavingPost(state) && !isCurrentPostPublished(state) && getEditedPostAttribute(state, "status") === "publish";
}
function isPermalinkEditable(state) {
  const permalinkTemplate = getEditedPostAttribute(
    state,
    "permalink_template"
  );
  return import_constants.PERMALINK_POSTNAME_REGEX.test(permalinkTemplate);
}
function getPermalink(state) {
  const permalinkParts = getPermalinkParts(state);
  if (!permalinkParts) {
    return null;
  }
  const { prefix, postName, suffix } = permalinkParts;
  if (isPermalinkEditable(state)) {
    return prefix + postName + suffix;
  }
  return prefix;
}
function getEditedPostSlug(state) {
  return getEditedPostAttribute(state, "slug") || (0, import_url.cleanForSlug)(getEditedPostAttribute(state, "title")) || getCurrentPostId(state);
}
function getPermalinkParts(state) {
  const permalinkTemplate = getEditedPostAttribute(
    state,
    "permalink_template"
  );
  if (!permalinkTemplate) {
    return null;
  }
  const postName = getEditedPostAttribute(state, "slug") || getEditedPostAttribute(state, "generated_slug");
  const [prefix, suffix] = permalinkTemplate.split(
    import_constants.PERMALINK_POSTNAME_REGEX
  );
  return {
    prefix,
    postName,
    suffix
  };
}
function isPostLocked(state) {
  return state.postLock.isLocked;
}
function isPostSavingLocked(state) {
  return Object.keys(state.postSavingLock).length > 0;
}
function isPostAutosavingLocked(state) {
  return Object.keys(state.postAutosavingLock).length > 0;
}
function isPostLockTakeover(state) {
  return state.postLock.isTakeover;
}
function getPostLockUser(state) {
  return state.postLock.user;
}
function getActivePostLock(state) {
  return state.postLock.activePostLock;
}
function canUserUseUnfilteredHTML(state) {
  return Boolean(
    getCurrentPost(state)._links?.hasOwnProperty(
      "wp:action-unfiltered-html"
    )
  );
}
var isPublishSidebarEnabled = (0, import_data.createRegistrySelector)(
  (select) => () => !!select(import_preferences.store).get("core", "isPublishSidebarEnabled")
);
var getEditorBlocks = (0, import_data.createSelector)(
  (state) => {
    return getEditedPostAttribute(state, "blocks") || (0, import_blocks.parse)(getEditedPostContent(state));
  },
  (state) => [
    getEditedPostAttribute(state, "blocks"),
    getEditedPostContent(state)
  ]
);
function isEditorPanelRemoved(state, panelName) {
  return state.removedPanels.includes(panelName);
}
var isEditorPanelEnabled = (0, import_data.createRegistrySelector)(
  (select) => (state, panelName) => {
    const inactivePanels = select(import_preferences.store).get(
      "core",
      "inactivePanels"
    );
    return !isEditorPanelRemoved(state, panelName) && !inactivePanels?.includes(panelName);
  }
);
var isEditorPanelOpened = (0, import_data.createRegistrySelector)(
  (select) => (state, panelName) => {
    const openPanels = select(import_preferences.store).get(
      "core",
      "openPanels"
    );
    return !!openPanels?.includes(panelName);
  }
);
function getEditorSelectionStart(state) {
  (0, import_deprecated.default)("select('core/editor').getEditorSelectionStart", {
    since: "5.8",
    alternative: "select('core/editor').getEditorSelection"
  });
  return getEditedPostAttribute(state, "selection")?.selectionStart;
}
function getEditorSelectionEnd(state) {
  (0, import_deprecated.default)("select('core/editor').getEditorSelectionStart", {
    since: "5.8",
    alternative: "select('core/editor').getEditorSelection"
  });
  return getEditedPostAttribute(state, "selection")?.selectionEnd;
}
function getEditorSelection(state) {
  return getEditedPostAttribute(state, "selection");
}
function __unstableIsEditorReady(state) {
  return !!state.postId;
}
function getEditorSettings(state) {
  return state.editorSettings;
}
function getRenderingMode(state) {
  return state.renderingMode;
}
var getDeviceType = (0, import_data.createRegistrySelector)(
  (select) => (state) => {
    const isZoomOut = (0, import_lock_unlock.unlock)(select(import_block_editor.store)).isZoomOut();
    if (isZoomOut) {
      return "Desktop";
    }
    return state.deviceType;
  }
);
function isListViewOpened(state) {
  return state.listViewPanel;
}
function isInserterOpened(state) {
  return !!state.blockInserterPanel;
}
var getEditorMode = (0, import_data.createRegistrySelector)(
  (select) => () => select(import_preferences.store).get("core", "editorMode") ?? "visual"
);
function getStateBeforeOptimisticTransaction() {
  (0, import_deprecated.default)("select('core/editor').getStateBeforeOptimisticTransaction", {
    since: "5.7",
    hint: "No state history is kept on this store anymore"
  });
  return null;
}
function inSomeHistory() {
  (0, import_deprecated.default)("select('core/editor').inSomeHistory", {
    since: "5.7",
    hint: "No state history is kept on this store anymore"
  });
  return false;
}
function getBlockEditorSelector(name) {
  return (0, import_data.createRegistrySelector)((select) => (state, ...args) => {
    (0, import_deprecated.default)("`wp.data.select( 'core/editor' )." + name + "`", {
      since: "5.3",
      alternative: "`wp.data.select( 'core/block-editor' )." + name + "`",
      version: "6.2"
    });
    return select(import_block_editor.store)[name](...args);
  });
}
var getBlockName = getBlockEditorSelector("getBlockName");
var isBlockValid = getBlockEditorSelector("isBlockValid");
var getBlockAttributes = getBlockEditorSelector("getBlockAttributes");
var getBlock = getBlockEditorSelector("getBlock");
var getBlocks = getBlockEditorSelector("getBlocks");
var getClientIdsOfDescendants = getBlockEditorSelector(
  "getClientIdsOfDescendants"
);
var getClientIdsWithDescendants = getBlockEditorSelector(
  "getClientIdsWithDescendants"
);
var getGlobalBlockCount = getBlockEditorSelector(
  "getGlobalBlockCount"
);
var getBlocksByClientId = getBlockEditorSelector(
  "getBlocksByClientId"
);
var getBlockCount = getBlockEditorSelector("getBlockCount");
var getBlockSelectionStart = getBlockEditorSelector(
  "getBlockSelectionStart"
);
var getBlockSelectionEnd = getBlockEditorSelector(
  "getBlockSelectionEnd"
);
var getSelectedBlockCount = getBlockEditorSelector(
  "getSelectedBlockCount"
);
var hasSelectedBlock = getBlockEditorSelector("hasSelectedBlock");
var getSelectedBlockClientId = getBlockEditorSelector(
  "getSelectedBlockClientId"
);
var getSelectedBlock = getBlockEditorSelector("getSelectedBlock");
var getBlockRootClientId = getBlockEditorSelector(
  "getBlockRootClientId"
);
var getBlockHierarchyRootClientId = getBlockEditorSelector(
  "getBlockHierarchyRootClientId"
);
var getAdjacentBlockClientId = getBlockEditorSelector(
  "getAdjacentBlockClientId"
);
var getPreviousBlockClientId = getBlockEditorSelector(
  "getPreviousBlockClientId"
);
var getNextBlockClientId = getBlockEditorSelector(
  "getNextBlockClientId"
);
var getSelectedBlocksInitialCaretPosition = getBlockEditorSelector(
  "getSelectedBlocksInitialCaretPosition"
);
var getMultiSelectedBlockClientIds = getBlockEditorSelector(
  "getMultiSelectedBlockClientIds"
);
var getMultiSelectedBlocks = getBlockEditorSelector(
  "getMultiSelectedBlocks"
);
var getFirstMultiSelectedBlockClientId = getBlockEditorSelector(
  "getFirstMultiSelectedBlockClientId"
);
var getLastMultiSelectedBlockClientId = getBlockEditorSelector(
  "getLastMultiSelectedBlockClientId"
);
var isFirstMultiSelectedBlock = getBlockEditorSelector(
  "isFirstMultiSelectedBlock"
);
var isBlockMultiSelected = getBlockEditorSelector(
  "isBlockMultiSelected"
);
var isAncestorMultiSelected = getBlockEditorSelector(
  "isAncestorMultiSelected"
);
var getMultiSelectedBlocksStartClientId = getBlockEditorSelector(
  "getMultiSelectedBlocksStartClientId"
);
var getMultiSelectedBlocksEndClientId = getBlockEditorSelector(
  "getMultiSelectedBlocksEndClientId"
);
var getBlockOrder = getBlockEditorSelector("getBlockOrder");
var getBlockIndex = getBlockEditorSelector("getBlockIndex");
var isBlockSelected = getBlockEditorSelector("isBlockSelected");
var hasSelectedInnerBlock = getBlockEditorSelector(
  "hasSelectedInnerBlock"
);
var isBlockWithinSelection = getBlockEditorSelector(
  "isBlockWithinSelection"
);
var hasMultiSelection = getBlockEditorSelector("hasMultiSelection");
var isMultiSelecting = getBlockEditorSelector("isMultiSelecting");
var isSelectionEnabled = getBlockEditorSelector("isSelectionEnabled");
var getBlockMode = getBlockEditorSelector("getBlockMode");
var isTyping = getBlockEditorSelector("isTyping");
var isCaretWithinFormattedText = getBlockEditorSelector(
  "isCaretWithinFormattedText"
);
var getBlockInsertionPoint = getBlockEditorSelector(
  "getBlockInsertionPoint"
);
var isBlockInsertionPointVisible = getBlockEditorSelector(
  "isBlockInsertionPointVisible"
);
var isValidTemplate = getBlockEditorSelector("isValidTemplate");
var getTemplate = getBlockEditorSelector("getTemplate");
var getTemplateLock = getBlockEditorSelector("getTemplateLock");
var canInsertBlockType = getBlockEditorSelector("canInsertBlockType");
var getInserterItems = getBlockEditorSelector("getInserterItems");
var hasInserterItems = getBlockEditorSelector("hasInserterItems");
var getBlockListSettings = getBlockEditorSelector(
  "getBlockListSettings"
);
var __experimentalGetDefaultTemplateTypes = (0, import_data.createRegistrySelector)(
  (select) => () => {
    (0, import_deprecated.default)(
      "select('core/editor').__experimentalGetDefaultTemplateTypes",
      {
        since: "6.8",
        alternative: "select('core/core-data').getCurrentTheme()?.default_template_types"
      }
    );
    return select(import_core_data.store).getCurrentTheme()?.default_template_types;
  }
);
var __experimentalGetDefaultTemplatePartAreas = (0, import_data.createRegistrySelector)(
  (select) => (0, import_data.createSelector)(() => {
    (0, import_deprecated.default)(
      "select('core/editor').__experimentalGetDefaultTemplatePartAreas",
      {
        since: "6.8",
        alternative: "select('core/core-data').getCurrentTheme()?.default_template_part_areas"
      }
    );
    const areas = select(import_core_data.store).getCurrentTheme()?.default_template_part_areas || [];
    return areas.map((item) => {
      return { ...item, icon: (0, import_get_template_part_icon.getTemplatePartIcon)(item.icon) };
    });
  })
);
var __experimentalGetDefaultTemplateType = (0, import_data.createRegistrySelector)(
  (select) => (0, import_data.createSelector)((state, slug) => {
    (0, import_deprecated.default)(
      "select('core/editor').__experimentalGetDefaultTemplateType",
      {
        since: "6.8"
      }
    );
    const templateTypes = select(import_core_data.store).getCurrentTheme()?.default_template_types;
    if (!templateTypes) {
      return EMPTY_OBJECT;
    }
    return Object.values(templateTypes).find(
      (type) => type.slug === slug
    ) ?? EMPTY_OBJECT;
  })
);
var __experimentalGetTemplateInfo = (0, import_data.createRegistrySelector)(
  (select) => (0, import_data.createSelector)((state, template) => {
    (0, import_deprecated.default)("select('core/editor').__experimentalGetTemplateInfo", {
      since: "6.8"
    });
    if (!template) {
      return EMPTY_OBJECT;
    }
    const currentTheme = select(import_core_data.store).getCurrentTheme();
    const templateTypes = currentTheme?.default_template_types || [];
    const templateAreas = currentTheme?.default_template_part_areas || [];
    return (0, import_get_template_info.getTemplateInfo)({
      template,
      templateAreas,
      templateTypes
    });
  })
);
var getPostTypeLabel = (0, import_data.createRegistrySelector)(
  (select) => (state) => {
    const currentPostType = getCurrentPostType(state);
    const postType = select(import_core_data.store).getPostType(currentPostType);
    return postType?.labels?.singular_name;
  }
);
function isPublishSidebarOpened(state) {
  return state.publishSidebarActive;
}
var isCollaborationEnabledForCurrentPost = (0, import_data.createRegistrySelector)(
  (select) => (state) => {
    if (!(0, import_lock_unlock.unlock)(select(import_core_data.store)).isCollaborationSupported()) {
      return false;
    }
    const currentPostType = getCurrentPostType(state);
    const entityConfig = select(import_core_data.store).getEntityConfig(
      "postType",
      currentPostType
    );
    return Boolean(
      entityConfig?.syncConfig && window._wpCollaborationEnabled
    );
  }
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  __experimentalGetDefaultTemplatePartAreas,
  __experimentalGetDefaultTemplateType,
  __experimentalGetDefaultTemplateTypes,
  __experimentalGetTemplateInfo,
  __unstableIsEditorReady,
  canInsertBlockType,
  canUserUseUnfilteredHTML,
  didPostSaveRequestFail,
  didPostSaveRequestSucceed,
  getActivePostLock,
  getAdjacentBlockClientId,
  getAutosaveAttribute,
  getBlock,
  getBlockAttributes,
  getBlockCount,
  getBlockHierarchyRootClientId,
  getBlockIndex,
  getBlockInsertionPoint,
  getBlockListSettings,
  getBlockMode,
  getBlockName,
  getBlockOrder,
  getBlockRootClientId,
  getBlockSelectionEnd,
  getBlockSelectionStart,
  getBlocks,
  getBlocksByClientId,
  getClientIdsOfDescendants,
  getClientIdsWithDescendants,
  getCurrentPost,
  getCurrentPostAttribute,
  getCurrentPostId,
  getCurrentPostLastRevisionId,
  getCurrentPostRevisionsCount,
  getCurrentPostType,
  getCurrentTemplateId,
  getDeviceType,
  getEditedPostAttribute,
  getEditedPostContent,
  getEditedPostPreviewLink,
  getEditedPostSlug,
  getEditedPostVisibility,
  getEditorBlocks,
  getEditorMode,
  getEditorSelection,
  getEditorSelectionEnd,
  getEditorSelectionStart,
  getEditorSettings,
  getFirstMultiSelectedBlockClientId,
  getGlobalBlockCount,
  getInserterItems,
  getLastMultiSelectedBlockClientId,
  getMultiSelectedBlockClientIds,
  getMultiSelectedBlocks,
  getMultiSelectedBlocksEndClientId,
  getMultiSelectedBlocksStartClientId,
  getNextBlockClientId,
  getPermalink,
  getPermalinkParts,
  getPostEdits,
  getPostLockUser,
  getPostTypeLabel,
  getPreviousBlockClientId,
  getRenderingMode,
  getSelectedBlock,
  getSelectedBlockClientId,
  getSelectedBlockCount,
  getSelectedBlocksInitialCaretPosition,
  getStateBeforeOptimisticTransaction,
  getSuggestedPostFormat,
  getTemplate,
  getTemplateLock,
  hasChangedContent,
  hasEditorRedo,
  hasEditorUndo,
  hasInserterItems,
  hasMultiSelection,
  hasNonPostEntityChanges,
  hasSelectedBlock,
  hasSelectedInnerBlock,
  inSomeHistory,
  isAncestorMultiSelected,
  isAutosavingPost,
  isBlockInsertionPointVisible,
  isBlockMultiSelected,
  isBlockSelected,
  isBlockValid,
  isBlockWithinSelection,
  isCaretWithinFormattedText,
  isCleanNewPost,
  isCollaborationEnabledForCurrentPost,
  isCurrentPostPending,
  isCurrentPostPublished,
  isCurrentPostScheduled,
  isDeletingPost,
  isEditedPostAutosaveable,
  isEditedPostBeingScheduled,
  isEditedPostDateFloating,
  isEditedPostDirty,
  isEditedPostEmpty,
  isEditedPostNew,
  isEditedPostPublishable,
  isEditedPostSaveable,
  isEditorPanelEnabled,
  isEditorPanelOpened,
  isEditorPanelRemoved,
  isFirstMultiSelectedBlock,
  isInserterOpened,
  isListViewOpened,
  isMultiSelecting,
  isPermalinkEditable,
  isPostAutosavingLocked,
  isPostLockTakeover,
  isPostLocked,
  isPostSavingLocked,
  isPreviewingPost,
  isPublishSidebarEnabled,
  isPublishSidebarOpened,
  isPublishingPost,
  isSavingNonPostEntityChanges,
  isSavingPost,
  isSelectionEnabled,
  isTyping,
  isValidTemplate
});
//# sourceMappingURL=selectors.cjs.map
