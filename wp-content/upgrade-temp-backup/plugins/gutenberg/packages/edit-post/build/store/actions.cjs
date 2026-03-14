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

// packages/edit-post/src/store/actions.js
var actions_exports = {};
__export(actions_exports, {
  __experimentalSetPreviewDeviceType: () => __experimentalSetPreviewDeviceType,
  __unstableCreateTemplate: () => __unstableCreateTemplate,
  closeGeneralSidebar: () => closeGeneralSidebar,
  closeModal: () => closeModal,
  closePublishSidebar: () => closePublishSidebar,
  hideBlockTypes: () => hideBlockTypes,
  initializeMetaBoxes: () => initializeMetaBoxes,
  metaBoxUpdatesFailure: () => metaBoxUpdatesFailure,
  metaBoxUpdatesSuccess: () => metaBoxUpdatesSuccess,
  openGeneralSidebar: () => openGeneralSidebar,
  openModal: () => openModal,
  openPublishSidebar: () => openPublishSidebar,
  removeEditorPanel: () => removeEditorPanel,
  requestMetaBoxUpdates: () => requestMetaBoxUpdates,
  setAvailableMetaBoxesPerLocation: () => setAvailableMetaBoxesPerLocation,
  setIsEditingTemplate: () => setIsEditingTemplate,
  setIsInserterOpened: () => setIsInserterOpened,
  setIsListViewOpened: () => setIsListViewOpened,
  showBlockTypes: () => showBlockTypes,
  switchEditorMode: () => switchEditorMode,
  toggleDistractionFree: () => toggleDistractionFree,
  toggleEditorPanelEnabled: () => toggleEditorPanelEnabled,
  toggleEditorPanelOpened: () => toggleEditorPanelOpened,
  toggleFeature: () => toggleFeature,
  toggleFullscreenMode: () => toggleFullscreenMode,
  togglePinnedPluginItem: () => togglePinnedPluginItem,
  togglePublishSidebar: () => togglePublishSidebar,
  updatePreferredStyleVariations: () => updatePreferredStyleVariations
});
module.exports = __toCommonJS(actions_exports);
var import_api_fetch = __toESM(require("@wordpress/api-fetch"));
var import_preferences = require("@wordpress/preferences");
var import_editor = require("@wordpress/editor");
var import_deprecated = __toESM(require("@wordpress/deprecated"));
var import_hooks = require("@wordpress/hooks");
var import_core_data = require("@wordpress/core-data");
var import_notices = require("@wordpress/notices");
var import_i18n = require("@wordpress/i18n");
var import_meta_boxes = require("../utils/meta-boxes.cjs");
var import_lock_unlock = require("../lock-unlock.cjs");
var { interfaceStore } = (0, import_lock_unlock.unlock)(import_editor.privateApis);
var openGeneralSidebar = (name) => ({ registry }) => {
  registry.dispatch(interfaceStore).enableComplementaryArea("core", name);
};
var closeGeneralSidebar = () => ({ registry }) => registry.dispatch(interfaceStore).disableComplementaryArea("core");
var openModal = (name) => ({ registry }) => {
  (0, import_deprecated.default)("select( 'core/edit-post' ).openModal( name )", {
    since: "6.3",
    alternative: "select( 'core/interface').openModal( name )"
  });
  return registry.dispatch(interfaceStore).openModal(name);
};
var closeModal = () => ({ registry }) => {
  (0, import_deprecated.default)("select( 'core/edit-post' ).closeModal()", {
    since: "6.3",
    alternative: "select( 'core/interface').closeModal()"
  });
  return registry.dispatch(interfaceStore).closeModal();
};
var openPublishSidebar = () => ({ registry }) => {
  (0, import_deprecated.default)("dispatch( 'core/edit-post' ).openPublishSidebar", {
    since: "6.6",
    alternative: "dispatch( 'core/editor').openPublishSidebar"
  });
  registry.dispatch(import_editor.store).openPublishSidebar();
};
var closePublishSidebar = () => ({ registry }) => {
  (0, import_deprecated.default)("dispatch( 'core/edit-post' ).closePublishSidebar", {
    since: "6.6",
    alternative: "dispatch( 'core/editor').closePublishSidebar"
  });
  registry.dispatch(import_editor.store).closePublishSidebar();
};
var togglePublishSidebar = () => ({ registry }) => {
  (0, import_deprecated.default)("dispatch( 'core/edit-post' ).togglePublishSidebar", {
    since: "6.6",
    alternative: "dispatch( 'core/editor').togglePublishSidebar"
  });
  registry.dispatch(import_editor.store).togglePublishSidebar();
};
var toggleEditorPanelEnabled = (panelName) => ({ registry }) => {
  (0, import_deprecated.default)("dispatch( 'core/edit-post' ).toggleEditorPanelEnabled", {
    since: "6.5",
    alternative: "dispatch( 'core/editor').toggleEditorPanelEnabled"
  });
  registry.dispatch(import_editor.store).toggleEditorPanelEnabled(panelName);
};
var toggleEditorPanelOpened = (panelName) => ({ registry }) => {
  (0, import_deprecated.default)("dispatch( 'core/edit-post' ).toggleEditorPanelOpened", {
    since: "6.5",
    alternative: "dispatch( 'core/editor').toggleEditorPanelOpened"
  });
  registry.dispatch(import_editor.store).toggleEditorPanelOpened(panelName);
};
var removeEditorPanel = (panelName) => ({ registry }) => {
  (0, import_deprecated.default)("dispatch( 'core/edit-post' ).removeEditorPanel", {
    since: "6.5",
    alternative: "dispatch( 'core/editor').removeEditorPanel"
  });
  registry.dispatch(import_editor.store).removeEditorPanel(panelName);
};
var toggleFeature = (feature) => ({ registry }) => registry.dispatch(import_preferences.store).toggle("core/edit-post", feature);
var switchEditorMode = (mode) => ({ registry }) => {
  (0, import_deprecated.default)("dispatch( 'core/edit-post' ).switchEditorMode", {
    since: "6.6",
    alternative: "dispatch( 'core/editor').switchEditorMode"
  });
  registry.dispatch(import_editor.store).switchEditorMode(mode);
};
var togglePinnedPluginItem = (pluginName) => ({ registry }) => {
  const isPinned = registry.select(interfaceStore).isItemPinned("core", pluginName);
  registry.dispatch(interfaceStore)[isPinned ? "unpinItem" : "pinItem"]("core", pluginName);
};
function updatePreferredStyleVariations() {
  (0, import_deprecated.default)("dispatch( 'core/edit-post' ).updatePreferredStyleVariations", {
    since: "6.6",
    hint: "Preferred Style Variations are not supported anymore."
  });
  return { type: "NOTHING" };
}
var showBlockTypes = (blockNames) => ({ registry }) => {
  (0, import_lock_unlock.unlock)(registry.dispatch(import_editor.store)).showBlockTypes(blockNames);
};
var hideBlockTypes = (blockNames) => ({ registry }) => {
  (0, import_lock_unlock.unlock)(registry.dispatch(import_editor.store)).hideBlockTypes(blockNames);
};
function setAvailableMetaBoxesPerLocation(metaBoxesPerLocation) {
  return {
    type: "SET_META_BOXES_PER_LOCATIONS",
    metaBoxesPerLocation
  };
}
var requestMetaBoxUpdates = () => async ({ registry, select, dispatch }) => {
  dispatch({
    type: "REQUEST_META_BOX_UPDATES"
  });
  if (window.tinyMCE) {
    window.tinyMCE.triggerSave();
  }
  const baseFormData = new window.FormData(
    document.querySelector(".metabox-base-form")
  );
  const postId = baseFormData.get("post_ID");
  const postType = baseFormData.get("post_type");
  const post = registry.select(import_core_data.store).getEditedEntityRecord("postType", postType, postId);
  const additionalData = [
    post.comment_status ? ["comment_status", post.comment_status] : false,
    post.ping_status ? ["ping_status", post.ping_status] : false,
    post.sticky ? ["sticky", post.sticky] : false,
    post.author ? ["post_author", post.author] : false
  ].filter(Boolean);
  const activeMetaBoxLocations = select.getActiveMetaBoxLocations();
  const formDataToMerge = [
    baseFormData,
    ...activeMetaBoxLocations.map(
      (location) => new window.FormData((0, import_meta_boxes.getMetaBoxContainer)(location))
    )
  ];
  const formData = formDataToMerge.reduce((memo, currentFormData) => {
    for (const [key, value] of currentFormData) {
      memo.append(key, value);
    }
    return memo;
  }, new window.FormData());
  additionalData.forEach(
    ([key, value]) => formData.append(key, value)
  );
  try {
    await (0, import_api_fetch.default)({
      url: window._wpMetaBoxUrl,
      method: "POST",
      body: formData,
      parse: false
    });
    dispatch.metaBoxUpdatesSuccess();
  } catch {
    dispatch.metaBoxUpdatesFailure();
  }
};
function metaBoxUpdatesSuccess() {
  return {
    type: "META_BOX_UPDATES_SUCCESS"
  };
}
function metaBoxUpdatesFailure() {
  return {
    type: "META_BOX_UPDATES_FAILURE"
  };
}
var __experimentalSetPreviewDeviceType = (deviceType) => ({ registry }) => {
  (0, import_deprecated.default)(
    "dispatch( 'core/edit-post' ).__experimentalSetPreviewDeviceType",
    {
      since: "6.5",
      version: "6.7",
      hint: "registry.dispatch( editorStore ).setDeviceType"
    }
  );
  registry.dispatch(import_editor.store).setDeviceType(deviceType);
};
var setIsInserterOpened = (value) => ({ registry }) => {
  (0, import_deprecated.default)("dispatch( 'core/edit-post' ).setIsInserterOpened", {
    since: "6.5",
    alternative: "dispatch( 'core/editor').setIsInserterOpened"
  });
  registry.dispatch(import_editor.store).setIsInserterOpened(value);
};
var setIsListViewOpened = (isOpen) => ({ registry }) => {
  (0, import_deprecated.default)("dispatch( 'core/edit-post' ).setIsListViewOpened", {
    since: "6.5",
    alternative: "dispatch( 'core/editor').setIsListViewOpened"
  });
  registry.dispatch(import_editor.store).setIsListViewOpened(isOpen);
};
function setIsEditingTemplate() {
  (0, import_deprecated.default)("dispatch( 'core/edit-post' ).setIsEditingTemplate", {
    since: "6.5",
    alternative: "dispatch( 'core/editor').setRenderingMode"
  });
  return { type: "NOTHING" };
}
function __unstableCreateTemplate() {
  (0, import_deprecated.default)("dispatch( 'core/edit-post' ).__unstableCreateTemplate", {
    since: "6.5"
  });
  return { type: "NOTHING" };
}
var metaBoxesInitialized = false;
var initializeMetaBoxes = () => ({ registry, select, dispatch }) => {
  const isEditorReady = registry.select(import_editor.store).__unstableIsEditorReady();
  if (!isEditorReady) {
    return;
  }
  if (metaBoxesInitialized) {
    return;
  }
  const postType = registry.select(import_editor.store).getCurrentPostType();
  if (window.postboxes.page !== postType) {
    window.postboxes.add_postbox_toggles(postType);
  }
  metaBoxesInitialized = true;
  (0, import_hooks.addAction)(
    "editor.savePost",
    "core/edit-post/save-metaboxes",
    async (post, options) => {
      if (!options.isAutosave && select.hasMetaBoxes()) {
        await dispatch.requestMetaBoxUpdates();
      }
    }
  );
  dispatch({
    type: "META_BOXES_INITIALIZED"
  });
};
var toggleDistractionFree = () => ({ registry }) => {
  (0, import_deprecated.default)("dispatch( 'core/edit-post' ).toggleDistractionFree", {
    since: "6.6",
    alternative: "dispatch( 'core/editor').toggleDistractionFree"
  });
  registry.dispatch(import_editor.store).toggleDistractionFree();
};
var toggleFullscreenMode = () => ({ registry }) => {
  const isFullscreen = registry.select(import_preferences.store).get("core/edit-post", "fullscreenMode");
  registry.dispatch(import_preferences.store).toggle("core/edit-post", "fullscreenMode");
  registry.dispatch(import_notices.store).createInfoNotice(
    isFullscreen ? (0, import_i18n.__)("Fullscreen mode deactivated.") : (0, import_i18n.__)("Fullscreen mode activated."),
    {
      id: "core/edit-post/toggle-fullscreen-mode/notice",
      type: "snackbar",
      actions: [
        {
          label: (0, import_i18n.__)("Undo"),
          onClick: () => {
            registry.dispatch(import_preferences.store).toggle(
              "core/edit-post",
              "fullscreenMode"
            );
          }
        }
      ]
    }
  );
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  __experimentalSetPreviewDeviceType,
  __unstableCreateTemplate,
  closeGeneralSidebar,
  closeModal,
  closePublishSidebar,
  hideBlockTypes,
  initializeMetaBoxes,
  metaBoxUpdatesFailure,
  metaBoxUpdatesSuccess,
  openGeneralSidebar,
  openModal,
  openPublishSidebar,
  removeEditorPanel,
  requestMetaBoxUpdates,
  setAvailableMetaBoxesPerLocation,
  setIsEditingTemplate,
  setIsInserterOpened,
  setIsListViewOpened,
  showBlockTypes,
  switchEditorMode,
  toggleDistractionFree,
  toggleEditorPanelEnabled,
  toggleEditorPanelOpened,
  toggleFeature,
  toggleFullscreenMode,
  togglePinnedPluginItem,
  togglePublishSidebar,
  updatePreferredStyleVariations
});
//# sourceMappingURL=actions.cjs.map
