// packages/edit-post/src/store/actions.js
import apiFetch from "@wordpress/api-fetch";
import { store as preferencesStore } from "@wordpress/preferences";
import {
  store as editorStore,
  privateApis as editorPrivateApis
} from "@wordpress/editor";
import deprecated from "@wordpress/deprecated";
import { addAction } from "@wordpress/hooks";
import { store as coreStore } from "@wordpress/core-data";
import { store as noticesStore } from "@wordpress/notices";
import { __ } from "@wordpress/i18n";
import { getMetaBoxContainer } from "../utils/meta-boxes.mjs";
import { unlock } from "../lock-unlock.mjs";
var { interfaceStore } = unlock(editorPrivateApis);
var openGeneralSidebar = (name) => ({ registry }) => {
  registry.dispatch(interfaceStore).enableComplementaryArea("core", name);
};
var closeGeneralSidebar = () => ({ registry }) => registry.dispatch(interfaceStore).disableComplementaryArea("core");
var openModal = (name) => ({ registry }) => {
  deprecated("select( 'core/edit-post' ).openModal( name )", {
    since: "6.3",
    alternative: "select( 'core/interface').openModal( name )"
  });
  return registry.dispatch(interfaceStore).openModal(name);
};
var closeModal = () => ({ registry }) => {
  deprecated("select( 'core/edit-post' ).closeModal()", {
    since: "6.3",
    alternative: "select( 'core/interface').closeModal()"
  });
  return registry.dispatch(interfaceStore).closeModal();
};
var openPublishSidebar = () => ({ registry }) => {
  deprecated("dispatch( 'core/edit-post' ).openPublishSidebar", {
    since: "6.6",
    alternative: "dispatch( 'core/editor').openPublishSidebar"
  });
  registry.dispatch(editorStore).openPublishSidebar();
};
var closePublishSidebar = () => ({ registry }) => {
  deprecated("dispatch( 'core/edit-post' ).closePublishSidebar", {
    since: "6.6",
    alternative: "dispatch( 'core/editor').closePublishSidebar"
  });
  registry.dispatch(editorStore).closePublishSidebar();
};
var togglePublishSidebar = () => ({ registry }) => {
  deprecated("dispatch( 'core/edit-post' ).togglePublishSidebar", {
    since: "6.6",
    alternative: "dispatch( 'core/editor').togglePublishSidebar"
  });
  registry.dispatch(editorStore).togglePublishSidebar();
};
var toggleEditorPanelEnabled = (panelName) => ({ registry }) => {
  deprecated("dispatch( 'core/edit-post' ).toggleEditorPanelEnabled", {
    since: "6.5",
    alternative: "dispatch( 'core/editor').toggleEditorPanelEnabled"
  });
  registry.dispatch(editorStore).toggleEditorPanelEnabled(panelName);
};
var toggleEditorPanelOpened = (panelName) => ({ registry }) => {
  deprecated("dispatch( 'core/edit-post' ).toggleEditorPanelOpened", {
    since: "6.5",
    alternative: "dispatch( 'core/editor').toggleEditorPanelOpened"
  });
  registry.dispatch(editorStore).toggleEditorPanelOpened(panelName);
};
var removeEditorPanel = (panelName) => ({ registry }) => {
  deprecated("dispatch( 'core/edit-post' ).removeEditorPanel", {
    since: "6.5",
    alternative: "dispatch( 'core/editor').removeEditorPanel"
  });
  registry.dispatch(editorStore).removeEditorPanel(panelName);
};
var toggleFeature = (feature) => ({ registry }) => registry.dispatch(preferencesStore).toggle("core/edit-post", feature);
var switchEditorMode = (mode) => ({ registry }) => {
  deprecated("dispatch( 'core/edit-post' ).switchEditorMode", {
    since: "6.6",
    alternative: "dispatch( 'core/editor').switchEditorMode"
  });
  registry.dispatch(editorStore).switchEditorMode(mode);
};
var togglePinnedPluginItem = (pluginName) => ({ registry }) => {
  const isPinned = registry.select(interfaceStore).isItemPinned("core", pluginName);
  registry.dispatch(interfaceStore)[isPinned ? "unpinItem" : "pinItem"]("core", pluginName);
};
function updatePreferredStyleVariations() {
  deprecated("dispatch( 'core/edit-post' ).updatePreferredStyleVariations", {
    since: "6.6",
    hint: "Preferred Style Variations are not supported anymore."
  });
  return { type: "NOTHING" };
}
var showBlockTypes = (blockNames) => ({ registry }) => {
  unlock(registry.dispatch(editorStore)).showBlockTypes(blockNames);
};
var hideBlockTypes = (blockNames) => ({ registry }) => {
  unlock(registry.dispatch(editorStore)).hideBlockTypes(blockNames);
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
  const post = registry.select(coreStore).getEditedEntityRecord("postType", postType, postId);
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
      (location) => new window.FormData(getMetaBoxContainer(location))
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
    await apiFetch({
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
  deprecated(
    "dispatch( 'core/edit-post' ).__experimentalSetPreviewDeviceType",
    {
      since: "6.5",
      version: "6.7",
      hint: "registry.dispatch( editorStore ).setDeviceType"
    }
  );
  registry.dispatch(editorStore).setDeviceType(deviceType);
};
var setIsInserterOpened = (value) => ({ registry }) => {
  deprecated("dispatch( 'core/edit-post' ).setIsInserterOpened", {
    since: "6.5",
    alternative: "dispatch( 'core/editor').setIsInserterOpened"
  });
  registry.dispatch(editorStore).setIsInserterOpened(value);
};
var setIsListViewOpened = (isOpen) => ({ registry }) => {
  deprecated("dispatch( 'core/edit-post' ).setIsListViewOpened", {
    since: "6.5",
    alternative: "dispatch( 'core/editor').setIsListViewOpened"
  });
  registry.dispatch(editorStore).setIsListViewOpened(isOpen);
};
function setIsEditingTemplate() {
  deprecated("dispatch( 'core/edit-post' ).setIsEditingTemplate", {
    since: "6.5",
    alternative: "dispatch( 'core/editor').setRenderingMode"
  });
  return { type: "NOTHING" };
}
function __unstableCreateTemplate() {
  deprecated("dispatch( 'core/edit-post' ).__unstableCreateTemplate", {
    since: "6.5"
  });
  return { type: "NOTHING" };
}
var metaBoxesInitialized = false;
var initializeMetaBoxes = () => ({ registry, select, dispatch }) => {
  const isEditorReady = registry.select(editorStore).__unstableIsEditorReady();
  if (!isEditorReady) {
    return;
  }
  if (metaBoxesInitialized) {
    return;
  }
  const postType = registry.select(editorStore).getCurrentPostType();
  if (window.postboxes.page !== postType) {
    window.postboxes.add_postbox_toggles(postType);
  }
  metaBoxesInitialized = true;
  addAction(
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
  deprecated("dispatch( 'core/edit-post' ).toggleDistractionFree", {
    since: "6.6",
    alternative: "dispatch( 'core/editor').toggleDistractionFree"
  });
  registry.dispatch(editorStore).toggleDistractionFree();
};
var toggleFullscreenMode = () => ({ registry }) => {
  const isFullscreen = registry.select(preferencesStore).get("core/edit-post", "fullscreenMode");
  registry.dispatch(preferencesStore).toggle("core/edit-post", "fullscreenMode");
  registry.dispatch(noticesStore).createInfoNotice(
    isFullscreen ? __("Fullscreen mode deactivated.") : __("Fullscreen mode activated."),
    {
      id: "core/edit-post/toggle-fullscreen-mode/notice",
      type: "snackbar",
      actions: [
        {
          label: __("Undo"),
          onClick: () => {
            registry.dispatch(preferencesStore).toggle(
              "core/edit-post",
              "fullscreenMode"
            );
          }
        }
      ]
    }
  );
};
export {
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
};
//# sourceMappingURL=actions.mjs.map
