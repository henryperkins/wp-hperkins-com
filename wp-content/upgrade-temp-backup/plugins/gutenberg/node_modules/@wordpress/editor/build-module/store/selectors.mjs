// packages/editor/src/store/selectors.js
import {
  getFreeformContentHandlerName,
  getDefaultBlockName,
  __unstableSerializeAndClean,
  parse
} from "@wordpress/blocks";
import { isInTheFuture, getDate } from "@wordpress/date";
import { addQueryArgs, cleanForSlug } from "@wordpress/url";
import { createSelector, createRegistrySelector } from "@wordpress/data";
import deprecated from "@wordpress/deprecated";
import { Platform } from "@wordpress/element";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { store as coreStore } from "@wordpress/core-data";
import { store as preferencesStore } from "@wordpress/preferences";
import {
  ATTACHMENT_POST_TYPE,
  EDIT_MERGE_PROPERTIES,
  PERMALINK_POSTNAME_REGEX,
  ONE_MINUTE_IN_MS,
  AUTOSAVE_PROPERTIES
} from "./constants.mjs";
import { getPostRawValue } from "./reducer.mjs";
import { getTemplatePartIcon } from "../utils/get-template-part-icon.mjs";
import { unlock } from "../lock-unlock.mjs";
import { getTemplateInfo } from "../utils/get-template-info.mjs";
var EMPTY_OBJECT = {};
var hasEditorUndo = createRegistrySelector((select) => () => {
  return select(coreStore).hasUndo();
});
var hasEditorRedo = createRegistrySelector((select) => () => {
  return select(coreStore).hasRedo();
});
function isEditedPostNew(state) {
  return getCurrentPost(state).status === "auto-draft";
}
function hasChangedContent(state) {
  const edits = getPostEdits(state);
  return "content" in edits;
}
var isEditedPostDirty = createRegistrySelector(
  (select) => (state) => {
    const postType = getCurrentPostType(state);
    const postId = getCurrentPostId(state);
    return select(coreStore).hasEditsForEntityRecord(
      "postType",
      postType,
      postId
    );
  }
);
var hasNonPostEntityChanges = createRegistrySelector(
  (select) => (state) => {
    const dirtyEntityRecords = select(coreStore).__experimentalGetDirtyEntityRecords();
    const { type, id } = getCurrentPost(state);
    return dirtyEntityRecords.some(
      (entityRecord) => entityRecord.kind !== "postType" || entityRecord.name !== type || entityRecord.key !== id
    );
  }
);
function isCleanNewPost(state) {
  return !isEditedPostDirty(state) && isEditedPostNew(state);
}
var getCurrentPost = createRegistrySelector(
  (select) => (state) => {
    const postId = getCurrentPostId(state);
    const postType = getCurrentPostType(state);
    const post = select(coreStore).getRawEntityRecord(
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
var getPostEdits = createRegistrySelector((select) => (state) => {
  const postType = getCurrentPostType(state);
  const postId = getCurrentPostId(state);
  return select(coreStore).getEntityRecordEdits(
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
      return getPostRawValue(post[attributeName]);
  }
}
var getNestedEditedPostProperty = createSelector(
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
  if (EDIT_MERGE_PROPERTIES.has(attributeName)) {
    return getNestedEditedPostProperty(state, attributeName);
  }
  return edits[attributeName];
}
var getAutosaveAttribute = createRegistrySelector(
  (select) => (state, attributeName) => {
    if (!AUTOSAVE_PROPERTIES.includes(attributeName) && attributeName !== "preview_link") {
      return;
    }
    const postType = getCurrentPostType(state);
    const postId = getCurrentPostId(state);
    const currentUserId = select(coreStore).getCurrentUser()?.id;
    const autosave = select(coreStore).getAutosave(
      postType,
      postId,
      currentUserId
    );
    if (autosave) {
      return getPostRawValue(autosave[attributeName]);
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
  return ["publish", "private"].indexOf(post.status) !== -1 || post.status === "future" && !isInTheFuture(
    new Date(Number(getDate(post.date)) - ONE_MINUTE_IN_MS)
  );
}
function isCurrentPostScheduled(state) {
  return getCurrentPost(state).status === "future" && !isCurrentPostPublished(state);
}
function isEditedPostPublishable(state) {
  const post = getCurrentPost(state);
  if (post.type === ATTACHMENT_POST_TYPE) {
    return isEditedPostDirty(state);
  }
  return isEditedPostDirty(state) || ["publish", "private", "future"].indexOf(post.status) === -1;
}
function isEditedPostSaveable(state) {
  if (isSavingPost(state)) {
    return false;
  }
  return !!getEditedPostAttribute(state, "title") || !!getEditedPostAttribute(state, "excerpt") || !isEditedPostEmpty(state) || Platform.OS === "native";
}
var isEditedPostEmpty = createRegistrySelector(
  (select) => (state) => {
    const postId = getCurrentPostId(state);
    const postType = getCurrentPostType(state);
    const record = select(coreStore).getEditedEntityRecord(
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
    if (blockName !== getDefaultBlockName() && blockName !== getFreeformContentHandlerName()) {
      return false;
    }
    return !getEditedPostContent(state);
  }
);
var isEditedPostAutosaveable = createRegistrySelector(
  (select) => (state) => {
    if (!isEditedPostSaveable(state)) {
      return false;
    }
    if (isPostAutosavingLocked(state)) {
      return false;
    }
    const postType = getCurrentPostType(state);
    const postTypeObject = select(coreStore).getPostType(postType);
    if (!postTypeObject?.supports?.autosave) {
      return false;
    }
    const postId = getCurrentPostId(state);
    const hasFetchedAutosave = select(coreStore).hasFetchedAutosaves(
      postType,
      postId
    );
    const currentUserId = select(coreStore).getCurrentUser()?.id;
    const autosave = select(coreStore).getAutosave(
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
      (field) => getPostRawValue(autosave[field]) !== getEditedPostAttribute(state, field)
    );
  }
);
function isEditedPostBeingScheduled(state) {
  const date = getEditedPostAttribute(state, "date");
  const checkedDate = new Date(
    Number(getDate(date)) - ONE_MINUTE_IN_MS
  );
  return isInTheFuture(checkedDate);
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
var isSavingNonPostEntityChanges = createRegistrySelector(
  (select) => (state) => {
    const entitiesBeingSaved = select(coreStore).__experimentalGetEntitiesBeingSaved();
    const { type, id } = getCurrentPost(state);
    return entitiesBeingSaved.some(
      (entityRecord) => entityRecord.kind !== "postType" || entityRecord.name !== type || entityRecord.key !== id
    );
  }
);
var didPostSaveRequestSucceed = createRegistrySelector(
  (select) => (state) => {
    const postType = getCurrentPostType(state);
    const postId = getCurrentPostId(state);
    return !select(coreStore).getLastEntitySaveError(
      "postType",
      postType,
      postId
    );
  }
);
var didPostSaveRequestFail = createRegistrySelector(
  (select) => (state) => {
    const postType = getCurrentPostType(state);
    const postId = getCurrentPostId(state);
    return !!select(coreStore).getLastEntitySaveError(
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
      previewLink = addQueryArgs(previewLink, { preview: true });
    }
  }
  const featuredImageId = getEditedPostAttribute(state, "featured_media");
  if (previewLink && featuredImageId) {
    return addQueryArgs(previewLink, { _thumbnail_id: featuredImageId });
  }
  return previewLink;
}
var getSuggestedPostFormat = createRegistrySelector(
  (select) => () => {
    const blocks = select(blockEditorStore).getBlocks();
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
var getEditedPostContent = createRegistrySelector(
  (select) => (state) => {
    const postId = getCurrentPostId(state);
    const postType = getCurrentPostType(state);
    const record = select(coreStore).getEditedEntityRecord(
      "postType",
      postType,
      postId
    );
    if (record) {
      if (typeof record.content === "function") {
        return record.content(record);
      } else if (record.blocks) {
        return __unstableSerializeAndClean(record.blocks);
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
  return PERMALINK_POSTNAME_REGEX.test(permalinkTemplate);
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
  return getEditedPostAttribute(state, "slug") || cleanForSlug(getEditedPostAttribute(state, "title")) || getCurrentPostId(state);
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
    PERMALINK_POSTNAME_REGEX
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
var isPublishSidebarEnabled = createRegistrySelector(
  (select) => () => !!select(preferencesStore).get("core", "isPublishSidebarEnabled")
);
var getEditorBlocks = createSelector(
  (state) => {
    return getEditedPostAttribute(state, "blocks") || parse(getEditedPostContent(state));
  },
  (state) => [
    getEditedPostAttribute(state, "blocks"),
    getEditedPostContent(state)
  ]
);
function isEditorPanelRemoved(state, panelName) {
  return state.removedPanels.includes(panelName);
}
var isEditorPanelEnabled = createRegistrySelector(
  (select) => (state, panelName) => {
    const inactivePanels = select(preferencesStore).get(
      "core",
      "inactivePanels"
    );
    return !isEditorPanelRemoved(state, panelName) && !inactivePanels?.includes(panelName);
  }
);
var isEditorPanelOpened = createRegistrySelector(
  (select) => (state, panelName) => {
    const openPanels = select(preferencesStore).get(
      "core",
      "openPanels"
    );
    return !!openPanels?.includes(panelName);
  }
);
function getEditorSelectionStart(state) {
  deprecated("select('core/editor').getEditorSelectionStart", {
    since: "5.8",
    alternative: "select('core/editor').getEditorSelection"
  });
  return getEditedPostAttribute(state, "selection")?.selectionStart;
}
function getEditorSelectionEnd(state) {
  deprecated("select('core/editor').getEditorSelectionStart", {
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
var getDeviceType = createRegistrySelector(
  (select) => (state) => {
    const isZoomOut = unlock(select(blockEditorStore)).isZoomOut();
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
var getEditorMode = createRegistrySelector(
  (select) => () => select(preferencesStore).get("core", "editorMode") ?? "visual"
);
function getStateBeforeOptimisticTransaction() {
  deprecated("select('core/editor').getStateBeforeOptimisticTransaction", {
    since: "5.7",
    hint: "No state history is kept on this store anymore"
  });
  return null;
}
function inSomeHistory() {
  deprecated("select('core/editor').inSomeHistory", {
    since: "5.7",
    hint: "No state history is kept on this store anymore"
  });
  return false;
}
function getBlockEditorSelector(name) {
  return createRegistrySelector((select) => (state, ...args) => {
    deprecated("`wp.data.select( 'core/editor' )." + name + "`", {
      since: "5.3",
      alternative: "`wp.data.select( 'core/block-editor' )." + name + "`",
      version: "6.2"
    });
    return select(blockEditorStore)[name](...args);
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
var __experimentalGetDefaultTemplateTypes = createRegistrySelector(
  (select) => () => {
    deprecated(
      "select('core/editor').__experimentalGetDefaultTemplateTypes",
      {
        since: "6.8",
        alternative: "select('core/core-data').getCurrentTheme()?.default_template_types"
      }
    );
    return select(coreStore).getCurrentTheme()?.default_template_types;
  }
);
var __experimentalGetDefaultTemplatePartAreas = createRegistrySelector(
  (select) => createSelector(() => {
    deprecated(
      "select('core/editor').__experimentalGetDefaultTemplatePartAreas",
      {
        since: "6.8",
        alternative: "select('core/core-data').getCurrentTheme()?.default_template_part_areas"
      }
    );
    const areas = select(coreStore).getCurrentTheme()?.default_template_part_areas || [];
    return areas.map((item) => {
      return { ...item, icon: getTemplatePartIcon(item.icon) };
    });
  })
);
var __experimentalGetDefaultTemplateType = createRegistrySelector(
  (select) => createSelector((state, slug) => {
    deprecated(
      "select('core/editor').__experimentalGetDefaultTemplateType",
      {
        since: "6.8"
      }
    );
    const templateTypes = select(coreStore).getCurrentTheme()?.default_template_types;
    if (!templateTypes) {
      return EMPTY_OBJECT;
    }
    return Object.values(templateTypes).find(
      (type) => type.slug === slug
    ) ?? EMPTY_OBJECT;
  })
);
var __experimentalGetTemplateInfo = createRegistrySelector(
  (select) => createSelector((state, template) => {
    deprecated("select('core/editor').__experimentalGetTemplateInfo", {
      since: "6.8"
    });
    if (!template) {
      return EMPTY_OBJECT;
    }
    const currentTheme = select(coreStore).getCurrentTheme();
    const templateTypes = currentTheme?.default_template_types || [];
    const templateAreas = currentTheme?.default_template_part_areas || [];
    return getTemplateInfo({
      template,
      templateAreas,
      templateTypes
    });
  })
);
var getPostTypeLabel = createRegistrySelector(
  (select) => (state) => {
    const currentPostType = getCurrentPostType(state);
    const postType = select(coreStore).getPostType(currentPostType);
    return postType?.labels?.singular_name;
  }
);
function isPublishSidebarOpened(state) {
  return state.publishSidebarActive;
}
var isCollaborationEnabledForCurrentPost = createRegistrySelector(
  (select) => (state) => {
    if (!unlock(select(coreStore)).isCollaborationSupported()) {
      return false;
    }
    const currentPostType = getCurrentPostType(state);
    const entityConfig = select(coreStore).getEntityConfig(
      "postType",
      currentPostType
    );
    return Boolean(
      entityConfig?.syncConfig && window._wpCollaborationEnabled
    );
  }
);
export {
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
};
//# sourceMappingURL=selectors.mjs.map
