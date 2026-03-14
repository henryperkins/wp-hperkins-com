// packages/editor/src/store/actions.js
import { speak } from "@wordpress/a11y";
import apiFetch from "@wordpress/api-fetch";
import deprecated from "@wordpress/deprecated";
import {
  parse,
  synchronizeBlocksWithTemplate,
  __unstableSerializeAndClean
} from "@wordpress/blocks";
import { store as noticesStore } from "@wordpress/notices";
import { store as coreStore } from "@wordpress/core-data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import {
  applyFilters,
  applyFiltersAsync,
  doActionAsync
} from "@wordpress/hooks";
import { store as preferencesStore } from "@wordpress/preferences";
import { __, sprintf } from "@wordpress/i18n";
import { localAutosaveSet } from "./local-autosave.mjs";
import {
  getNotificationArgumentsForSaveSuccess,
  getNotificationArgumentsForSaveFail,
  getNotificationArgumentsForTrashFail
} from "./utils/notice-builder.mjs";
import { unlock } from "../lock-unlock.mjs";
var setupEditor = (post, edits, template) => ({ dispatch }) => {
  dispatch.setEditedPost(post.type, post.id);
  const isNewPost = post.status === "auto-draft";
  if (isNewPost && template) {
    let content;
    if ("content" in edits) {
      content = edits.content;
    } else {
      content = post.content.raw;
    }
    let blocks = parse(content);
    blocks = synchronizeBlocksWithTemplate(blocks, template);
    dispatch.resetEditorBlocks(blocks, {
      __unstableShouldCreateUndoLevel: false
    });
  }
  if (edits && Object.entries(edits).some(
    ([key, edit]) => edit !== (post[key]?.raw ?? post[key])
  )) {
    dispatch.editPost(edits);
  }
};
function __experimentalTearDownEditor() {
  deprecated(
    "wp.data.dispatch( 'core/editor' ).__experimentalTearDownEditor",
    {
      since: "6.5"
    }
  );
  return { type: "DO_NOTHING" };
}
function resetPost() {
  deprecated("wp.data.dispatch( 'core/editor' ).resetPost", {
    since: "6.0",
    version: "6.3",
    alternative: "Initialize the editor with the setupEditorState action"
  });
  return { type: "DO_NOTHING" };
}
function updatePost() {
  deprecated("wp.data.dispatch( 'core/editor' ).updatePost", {
    since: "5.7",
    alternative: "Use the core entities store instead"
  });
  return {
    type: "DO_NOTHING"
  };
}
function setupEditorState(post) {
  deprecated("wp.data.dispatch( 'core/editor' ).setupEditorState", {
    since: "6.5",
    alternative: "wp.data.dispatch( 'core/editor' ).setEditedPost"
  });
  return setEditedPost(post.type, post.id);
}
function setEditedPost(postType, postId) {
  return {
    type: "SET_EDITED_POST",
    postType,
    postId
  };
}
var editPost = (edits, options) => ({ select, registry }) => {
  const { id, type } = select.getCurrentPost();
  registry.dispatch(coreStore).editEntityRecord("postType", type, id, edits, options);
};
var savePost = (options = {}) => async ({ select, dispatch, registry }) => {
  if (!select.isEditedPostSaveable()) {
    return;
  }
  const content = select.getEditedPostContent();
  if (!options.isAutosave) {
    dispatch.editPost({ content }, { undoIgnore: true });
  }
  const previousRecord = select.getCurrentPost();
  let edits = {
    id: previousRecord.id,
    ...registry.select(coreStore).getEntityRecordNonTransientEdits(
      "postType",
      previousRecord.type,
      previousRecord.id
    ),
    content
  };
  dispatch({ type: "REQUEST_POST_UPDATE_START", options });
  let error = false;
  try {
    edits = await applyFiltersAsync(
      "editor.preSavePost",
      edits,
      options
    );
  } catch (err) {
    error = err;
  }
  if (!error) {
    try {
      await registry.dispatch(coreStore).saveEntityRecord(
        "postType",
        previousRecord.type,
        edits,
        options
      );
    } catch (err) {
      error = err.message && err.code !== "unknown_error" ? err.message : __("An error occurred while updating.");
    }
  }
  if (!error) {
    error = registry.select(coreStore).getLastEntitySaveError(
      "postType",
      previousRecord.type,
      previousRecord.id
    );
  }
  if (!error) {
    try {
      await applyFilters(
        "editor.__unstableSavePost",
        Promise.resolve(),
        options
      );
    } catch (err) {
      error = err;
    }
  }
  if (!error) {
    try {
      await doActionAsync(
        "editor.savePost",
        { id: previousRecord.id, type: previousRecord.type },
        options
      );
    } catch (err) {
      error = err;
    }
  }
  dispatch({ type: "REQUEST_POST_UPDATE_FINISH", options });
  if (typeof window !== "undefined" && window.__experimentalTemplateActivate && !options.isAutosave && previousRecord.type === "wp_template" && (typeof previousRecord.id === "number" || /^\d+$/.test(previousRecord.id))) {
    templateActivationNotice({ select, dispatch, registry });
  }
  if (error) {
    const args = getNotificationArgumentsForSaveFail({
      post: previousRecord,
      edits,
      error
    });
    if (args.length) {
      registry.dispatch(noticesStore).createErrorNotice(...args);
    }
  } else {
    const updatedRecord = select.getCurrentPost();
    const args = getNotificationArgumentsForSaveSuccess({
      previousPost: previousRecord,
      post: updatedRecord,
      postType: await registry.resolveSelect(coreStore).getPostType(updatedRecord.type),
      options
    });
    if (args.length) {
      registry.dispatch(noticesStore).createSuccessNotice(...args);
    }
    if (!options.isAutosave) {
      registry.dispatch(blockEditorStore).__unstableMarkLastChangeAsPersistent();
    }
  }
};
async function templateActivationNotice({ select, registry }) {
  const editorSettings = select.getEditorSettings();
  if (editorSettings.onNavigateToPreviousEntityRecord) {
    return;
  }
  const { id, slug } = select.getCurrentPost();
  const site = await registry.select(coreStore).getEntityRecord("root", "site");
  if (site.active_templates[slug] === id) {
    return;
  }
  const currentTheme = await registry.resolveSelect(coreStore).getCurrentTheme();
  const templateType = currentTheme?.default_template_types.find(
    (type) => type.slug === slug
  );
  await registry.dispatch(noticesStore).createNotice(
    "info",
    sprintf(
      // translators: %s: The name (or slug) of the type of template.
      __('Do you want to activate this "%s" template?'),
      templateType?.title ?? slug
    ),
    {
      id: "template-activate-notice",
      actions: [
        {
          label: __("Activate"),
          onClick: async () => {
            await registry.dispatch(noticesStore).createNotice(
              "info",
              __("Activating template\u2026"),
              { id: "template-activate-notice" }
            );
            try {
              const currentSite = await registry.select(coreStore).getEntityRecord("root", "site");
              await registry.dispatch(coreStore).saveEntityRecord(
                "root",
                "site",
                {
                  active_templates: {
                    ...currentSite.active_templates,
                    [slug]: id
                  }
                },
                { throwOnError: true }
              );
              await registry.dispatch(noticesStore).createSuccessNotice(
                __("Template activated."),
                { id: "template-activate-notice" }
              );
            } catch (error) {
              await registry.dispatch(noticesStore).createErrorNotice(
                __("Template activation failed."),
                { id: "template-activate-notice" }
              );
              throw error;
            }
          }
        }
      ]
    }
  );
}
function refreshPost() {
  deprecated("wp.data.dispatch( 'core/editor' ).refreshPost", {
    since: "6.0",
    version: "6.3",
    alternative: "Use the core entities store instead"
  });
  return { type: "DO_NOTHING" };
}
var trashPost = () => async ({ select, dispatch, registry }) => {
  const postTypeSlug = select.getCurrentPostType();
  const postType = await registry.resolveSelect(coreStore).getPostType(postTypeSlug);
  const { rest_base: restBase, rest_namespace: restNamespace = "wp/v2" } = postType;
  dispatch({ type: "REQUEST_POST_DELETE_START" });
  try {
    const post = select.getCurrentPost();
    await apiFetch({
      path: `/${restNamespace}/${restBase}/${post.id}`,
      method: "DELETE"
    });
    await dispatch.savePost();
  } catch (error) {
    registry.dispatch(noticesStore).createErrorNotice(
      ...getNotificationArgumentsForTrashFail({ error })
    );
  }
  dispatch({ type: "REQUEST_POST_DELETE_FINISH" });
};
var autosave = ({ local = false, ...options } = {}) => async ({ select, dispatch }) => {
  const post = select.getCurrentPost();
  if (local) {
    const isPostNew = select.isEditedPostNew();
    const title = select.getEditedPostAttribute("title");
    const content = select.getEditedPostAttribute("content");
    const excerpt = select.getEditedPostAttribute("excerpt");
    localAutosaveSet(post.id, isPostNew, title, content, excerpt);
  } else {
    await dispatch.savePost({ isAutosave: true, ...options });
  }
};
var __unstableSaveForPreview = ({ forceIsAutosaveable } = {}) => async ({ select, dispatch }) => {
  if ((forceIsAutosaveable || select.isEditedPostAutosaveable()) && !select.isPostLocked()) {
    const isDraft = ["draft", "auto-draft"].includes(
      select.getEditedPostAttribute("status")
    );
    if (isDraft) {
      await dispatch.savePost({ isPreview: true });
    } else {
      await dispatch.autosave({ isPreview: true });
    }
  }
  return select.getEditedPostPreviewLink();
};
var redo = () => ({ registry }) => {
  registry.dispatch(coreStore).redo();
};
var undo = () => ({ registry }) => {
  registry.dispatch(coreStore).undo();
};
function createUndoLevel() {
  deprecated("wp.data.dispatch( 'core/editor' ).createUndoLevel", {
    since: "6.0",
    version: "6.3",
    alternative: "Use the core entities store instead"
  });
  return { type: "DO_NOTHING" };
}
function updatePostLock(lock) {
  return {
    type: "UPDATE_POST_LOCK",
    lock
  };
}
var enablePublishSidebar = () => ({ registry }) => {
  registry.dispatch(preferencesStore).set("core", "isPublishSidebarEnabled", true);
};
var disablePublishSidebar = () => ({ registry }) => {
  registry.dispatch(preferencesStore).set("core", "isPublishSidebarEnabled", false);
};
function lockPostSaving(lockName) {
  return {
    type: "LOCK_POST_SAVING",
    lockName
  };
}
function unlockPostSaving(lockName) {
  return {
    type: "UNLOCK_POST_SAVING",
    lockName
  };
}
function lockPostAutosaving(lockName) {
  return {
    type: "LOCK_POST_AUTOSAVING",
    lockName
  };
}
function unlockPostAutosaving(lockName) {
  return {
    type: "UNLOCK_POST_AUTOSAVING",
    lockName
  };
}
var resetEditorBlocks = (blocks, options = {}) => ({ select, dispatch, registry }) => {
  const { __unstableShouldCreateUndoLevel, selection } = options;
  const edits = { blocks, selection };
  if (__unstableShouldCreateUndoLevel !== false) {
    const { id, type } = select.getCurrentPost();
    const noChange = registry.select(coreStore).getEditedEntityRecord("postType", type, id).blocks === edits.blocks;
    if (noChange) {
      registry.dispatch(coreStore).__unstableCreateUndoLevel("postType", type, id);
      return;
    }
    edits.content = ({ blocks: blocksForSerialization = [] }) => __unstableSerializeAndClean(blocksForSerialization);
  }
  dispatch.editPost(edits);
};
function updateEditorSettings(settings) {
  return {
    type: "UPDATE_EDITOR_SETTINGS",
    settings
  };
}
var setRenderingMode = (mode) => ({ dispatch, registry, select }) => {
  if (select.__unstableIsEditorReady() && !select.getEditorSettings().isPreviewMode) {
    registry.dispatch(blockEditorStore).clearSelectedBlock();
  }
  dispatch({
    type: "SET_RENDERING_MODE",
    mode
  });
};
function setDeviceType(deviceType) {
  return {
    type: "SET_DEVICE_TYPE",
    deviceType
  };
}
var toggleEditorPanelEnabled = (panelName) => ({ registry }) => {
  const inactivePanels = registry.select(preferencesStore).get("core", "inactivePanels") ?? [];
  const isPanelInactive = !!inactivePanels?.includes(panelName);
  let updatedInactivePanels;
  if (isPanelInactive) {
    updatedInactivePanels = inactivePanels.filter(
      (invactivePanelName) => invactivePanelName !== panelName
    );
  } else {
    updatedInactivePanels = [...inactivePanels, panelName];
  }
  registry.dispatch(preferencesStore).set("core", "inactivePanels", updatedInactivePanels);
};
var toggleEditorPanelOpened = (panelName) => ({ registry }) => {
  const openPanels = registry.select(preferencesStore).get("core", "openPanels") ?? [];
  const isPanelOpen = !!openPanels?.includes(panelName);
  let updatedOpenPanels;
  if (isPanelOpen) {
    updatedOpenPanels = openPanels.filter(
      (openPanelName) => openPanelName !== panelName
    );
  } else {
    updatedOpenPanels = [...openPanels, panelName];
  }
  registry.dispatch(preferencesStore).set("core", "openPanels", updatedOpenPanels);
};
function removeEditorPanel(panelName) {
  return {
    type: "REMOVE_PANEL",
    panelName
  };
}
var setIsInserterOpened = (value) => ({ dispatch, registry }) => {
  if (typeof value === "object" && value.hasOwnProperty("rootClientId") && value.hasOwnProperty("insertionIndex")) {
    unlock(registry.dispatch(blockEditorStore)).setInsertionPoint({
      rootClientId: value.rootClientId,
      index: value.insertionIndex
    });
  }
  dispatch({
    type: "SET_IS_INSERTER_OPENED",
    value
  });
};
function setIsListViewOpened(isOpen) {
  return {
    type: "SET_IS_LIST_VIEW_OPENED",
    isOpen
  };
}
var toggleDistractionFree = ({ createNotice = true } = {}) => ({ dispatch, registry }) => {
  const isDistractionFree = registry.select(preferencesStore).get("core", "distractionFree");
  if (isDistractionFree) {
    registry.dispatch(preferencesStore).set("core", "fixedToolbar", false);
  }
  if (!isDistractionFree) {
    registry.batch(() => {
      registry.dispatch(preferencesStore).set("core", "fixedToolbar", true);
      dispatch.setIsInserterOpened(false);
      dispatch.setIsListViewOpened(false);
      unlock(
        registry.dispatch(blockEditorStore)
      ).resetZoomLevel();
    });
  }
  registry.batch(() => {
    registry.dispatch(preferencesStore).set("core", "distractionFree", !isDistractionFree);
    if (createNotice) {
      registry.dispatch(noticesStore).createInfoNotice(
        isDistractionFree ? __("Distraction free mode deactivated.") : __("Distraction free mode activated."),
        {
          id: "core/editor/distraction-free-mode/notice",
          type: "snackbar",
          actions: [
            {
              label: __("Undo"),
              onClick: () => {
                registry.batch(() => {
                  registry.dispatch(preferencesStore).set(
                    "core",
                    "fixedToolbar",
                    isDistractionFree
                  );
                  registry.dispatch(preferencesStore).toggle(
                    "core",
                    "distractionFree"
                  );
                });
              }
            }
          ]
        }
      );
    }
  });
};
var toggleSpotlightMode = () => ({ registry }) => {
  registry.dispatch(preferencesStore).toggle("core", "focusMode");
  const isFocusMode = registry.select(preferencesStore).get("core", "focusMode");
  registry.dispatch(noticesStore).createInfoNotice(
    isFocusMode ? __("Spotlight mode activated.") : __("Spotlight mode deactivated."),
    {
      id: "core/editor/toggle-spotlight-mode/notice",
      type: "snackbar",
      actions: [
        {
          label: __("Undo"),
          onClick: () => {
            registry.dispatch(preferencesStore).toggle("core", "focusMode");
          }
        }
      ]
    }
  );
};
var toggleTopToolbar = () => ({ registry }) => {
  registry.dispatch(preferencesStore).toggle("core", "fixedToolbar");
  const isTopToolbar = registry.select(preferencesStore).get("core", "fixedToolbar");
  registry.dispatch(noticesStore).createInfoNotice(
    isTopToolbar ? __("Top toolbar activated.") : __("Top toolbar deactivated."),
    {
      id: "core/editor/toggle-top-toolbar/notice",
      type: "snackbar",
      actions: [
        {
          label: __("Undo"),
          onClick: () => {
            registry.dispatch(preferencesStore).toggle("core", "fixedToolbar");
          }
        }
      ]
    }
  );
};
var switchEditorMode = (mode) => ({ dispatch, registry }) => {
  registry.dispatch(preferencesStore).set("core", "editorMode", mode);
  if (mode !== "visual") {
    registry.dispatch(blockEditorStore).clearSelectedBlock();
    unlock(registry.dispatch(blockEditorStore)).resetZoomLevel();
  }
  if (mode === "visual") {
    speak(__("Visual editor selected"), "assertive");
  } else if (mode === "text") {
    const isDistractionFree = registry.select(preferencesStore).get("core", "distractionFree");
    if (isDistractionFree) {
      dispatch.toggleDistractionFree();
    }
    speak(__("Code editor selected"), "assertive");
  }
};
function openPublishSidebar() {
  return {
    type: "OPEN_PUBLISH_SIDEBAR"
  };
}
function closePublishSidebar() {
  return {
    type: "CLOSE_PUBLISH_SIDEBAR"
  };
}
function togglePublishSidebar() {
  return {
    type: "TOGGLE_PUBLISH_SIDEBAR"
  };
}
var getBlockEditorAction = (name) => (...args) => ({ registry }) => {
  deprecated("`wp.data.dispatch( 'core/editor' )." + name + "`", {
    since: "5.3",
    alternative: "`wp.data.dispatch( 'core/block-editor' )." + name + "`",
    version: "6.2"
  });
  registry.dispatch(blockEditorStore)[name](...args);
};
var resetBlocks = getBlockEditorAction("resetBlocks");
var receiveBlocks = getBlockEditorAction("receiveBlocks");
var updateBlock = getBlockEditorAction("updateBlock");
var updateBlockAttributes = getBlockEditorAction(
  "updateBlockAttributes"
);
var selectBlock = getBlockEditorAction("selectBlock");
var startMultiSelect = getBlockEditorAction("startMultiSelect");
var stopMultiSelect = getBlockEditorAction("stopMultiSelect");
var multiSelect = getBlockEditorAction("multiSelect");
var clearSelectedBlock = getBlockEditorAction("clearSelectedBlock");
var toggleSelection = getBlockEditorAction("toggleSelection");
var replaceBlocks = getBlockEditorAction("replaceBlocks");
var replaceBlock = getBlockEditorAction("replaceBlock");
var moveBlocksDown = getBlockEditorAction("moveBlocksDown");
var moveBlocksUp = getBlockEditorAction("moveBlocksUp");
var moveBlockToPosition = getBlockEditorAction(
  "moveBlockToPosition"
);
var insertBlock = getBlockEditorAction("insertBlock");
var insertBlocks = getBlockEditorAction("insertBlocks");
var showInsertionPoint = getBlockEditorAction("showInsertionPoint");
var hideInsertionPoint = getBlockEditorAction("hideInsertionPoint");
var setTemplateValidity = getBlockEditorAction(
  "setTemplateValidity"
);
var synchronizeTemplate = getBlockEditorAction(
  "synchronizeTemplate"
);
var mergeBlocks = getBlockEditorAction("mergeBlocks");
var removeBlocks = getBlockEditorAction("removeBlocks");
var removeBlock = getBlockEditorAction("removeBlock");
var toggleBlockMode = getBlockEditorAction("toggleBlockMode");
var startTyping = getBlockEditorAction("startTyping");
var stopTyping = getBlockEditorAction("stopTyping");
var enterFormattedText = getBlockEditorAction("enterFormattedText");
var exitFormattedText = getBlockEditorAction("exitFormattedText");
var insertDefaultBlock = getBlockEditorAction("insertDefaultBlock");
var updateBlockListSettings = getBlockEditorAction(
  "updateBlockListSettings"
);
export {
  __experimentalTearDownEditor,
  __unstableSaveForPreview,
  autosave,
  clearSelectedBlock,
  closePublishSidebar,
  createUndoLevel,
  disablePublishSidebar,
  editPost,
  enablePublishSidebar,
  enterFormattedText,
  exitFormattedText,
  hideInsertionPoint,
  insertBlock,
  insertBlocks,
  insertDefaultBlock,
  lockPostAutosaving,
  lockPostSaving,
  mergeBlocks,
  moveBlockToPosition,
  moveBlocksDown,
  moveBlocksUp,
  multiSelect,
  openPublishSidebar,
  receiveBlocks,
  redo,
  refreshPost,
  removeBlock,
  removeBlocks,
  removeEditorPanel,
  replaceBlock,
  replaceBlocks,
  resetBlocks,
  resetEditorBlocks,
  resetPost,
  savePost,
  selectBlock,
  setDeviceType,
  setEditedPost,
  setIsInserterOpened,
  setIsListViewOpened,
  setRenderingMode,
  setTemplateValidity,
  setupEditor,
  setupEditorState,
  showInsertionPoint,
  startMultiSelect,
  startTyping,
  stopMultiSelect,
  stopTyping,
  switchEditorMode,
  synchronizeTemplate,
  toggleBlockMode,
  toggleDistractionFree,
  toggleEditorPanelEnabled,
  toggleEditorPanelOpened,
  togglePublishSidebar,
  toggleSelection,
  toggleSpotlightMode,
  toggleTopToolbar,
  trashPost,
  undo,
  unlockPostAutosaving,
  unlockPostSaving,
  updateBlock,
  updateBlockAttributes,
  updateBlockListSettings,
  updateEditorSettings,
  updatePost,
  updatePostLock
};
//# sourceMappingURL=actions.mjs.map
