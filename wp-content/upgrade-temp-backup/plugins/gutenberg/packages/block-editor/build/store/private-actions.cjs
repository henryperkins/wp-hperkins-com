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

// packages/block-editor/src/store/private-actions.js
var private_actions_exports = {};
__export(private_actions_exports, {
  __experimentalUpdateSettings: () => __experimentalUpdateSettings,
  clearBlockRemovalPrompt: () => clearBlockRemovalPrompt,
  clearRequestedInspectorTab: () => clearRequestedInspectorTab,
  closeListViewContentPanel: () => closeListViewContentPanel,
  deleteStyleOverride: () => deleteStyleOverride,
  editContentOnlySection: () => editContentOnlySection,
  ensureDefaultBlock: () => ensureDefaultBlock,
  expandBlock: () => expandBlock,
  hideBlockInterface: () => hideBlockInterface,
  hideViewportModal: () => hideViewportModal,
  openListViewContentPanel: () => openListViewContentPanel,
  privateRemoveBlocks: () => privateRemoveBlocks,
  requestInspectorTab: () => requestInspectorTab,
  resetZoomLevel: () => resetZoomLevel,
  setBlockRemovalRules: () => setBlockRemovalRules,
  setInsertionPoint: () => setInsertionPoint,
  setLastFocus: () => setLastFocus,
  setStyleOverride: () => setStyleOverride,
  setZoomLevel: () => setZoomLevel,
  showBlockInterface: () => showBlockInterface,
  showViewportModal: () => showViewportModal,
  startDragging: () => startDragging,
  stopDragging: () => stopDragging,
  stopEditingContentOnlySection: () => stopEditingContentOnlySection,
  toggleBlockSpotlight: () => toggleBlockSpotlight
});
module.exports = __toCommonJS(private_actions_exports);
var import_element = require("@wordpress/element");
var import_deprecated = __toESM(require("@wordpress/deprecated"));
var import_a11y = require("@wordpress/a11y");
var import_i18n = require("@wordpress/i18n");
var castArray = (maybeArray) => Array.isArray(maybeArray) ? maybeArray : [maybeArray];
var privateSettings = [
  "inserterMediaCategories",
  "blockInspectorAnimation",
  "mediaSideload"
];
function __experimentalUpdateSettings(settings, { stripExperimentalSettings = false, reset = false } = {}) {
  let incomingSettings = settings;
  if (Object.hasOwn(incomingSettings, "__unstableIsPreviewMode")) {
    (0, import_deprecated.default)(
      "__unstableIsPreviewMode argument in wp.data.dispatch('core/block-editor').updateSettings",
      {
        since: "6.8",
        alternative: "isPreviewMode"
      }
    );
    incomingSettings = { ...incomingSettings };
    incomingSettings.isPreviewMode = incomingSettings.__unstableIsPreviewMode;
    delete incomingSettings.__unstableIsPreviewMode;
  }
  let cleanSettings = incomingSettings;
  if (stripExperimentalSettings && import_element.Platform.OS === "web") {
    cleanSettings = {};
    for (const key in incomingSettings) {
      if (!privateSettings.includes(key)) {
        cleanSettings[key] = incomingSettings[key];
      }
    }
  }
  return {
    type: "UPDATE_SETTINGS",
    settings: cleanSettings,
    reset
  };
}
function hideBlockInterface() {
  return {
    type: "HIDE_BLOCK_INTERFACE"
  };
}
function showBlockInterface() {
  return {
    type: "SHOW_BLOCK_INTERFACE"
  };
}
var privateRemoveBlocks = (clientIds, selectPrevious = true, forceRemove = false) => ({ select, dispatch, registry }) => {
  if (!clientIds || !clientIds.length) {
    return;
  }
  clientIds = castArray(clientIds);
  const canRemoveBlocks = select.canRemoveBlocks(clientIds);
  if (!canRemoveBlocks) {
    return;
  }
  const rules = !forceRemove && select.getBlockRemovalRules();
  if (rules) {
    let flattenBlocks2 = function(blocks) {
      const result = [];
      const stack = [...blocks];
      while (stack.length) {
        const { innerBlocks, ...block } = stack.shift();
        stack.push(...innerBlocks);
        result.push(block);
      }
      return result;
    };
    var flattenBlocks = flattenBlocks2;
    const blockList = clientIds.map(select.getBlock);
    const flattenedBlocks = flattenBlocks2(blockList);
    let message;
    for (const rule of rules) {
      message = rule.callback(flattenedBlocks);
      if (message) {
        dispatch(
          displayBlockRemovalPrompt(
            clientIds,
            selectPrevious,
            message
          )
        );
        return;
      }
    }
  }
  if (selectPrevious) {
    dispatch.selectPreviousBlock(clientIds[0], selectPrevious);
  }
  registry.batch(() => {
    dispatch({ type: "REMOVE_BLOCKS", clientIds });
    dispatch(ensureDefaultBlock());
  });
};
var ensureDefaultBlock = () => ({ select, dispatch }) => {
  const count = select.getBlockCount();
  if (count > 0) {
    return;
  }
  const { __unstableHasCustomAppender } = select.getSettings();
  if (__unstableHasCustomAppender) {
    return;
  }
  dispatch.insertDefaultBlock();
};
function displayBlockRemovalPrompt(clientIds, selectPrevious, message) {
  return {
    type: "DISPLAY_BLOCK_REMOVAL_PROMPT",
    clientIds,
    selectPrevious,
    message
  };
}
function clearBlockRemovalPrompt() {
  return {
    type: "CLEAR_BLOCK_REMOVAL_PROMPT"
  };
}
function setBlockRemovalRules(rules = false) {
  return {
    type: "SET_BLOCK_REMOVAL_RULES",
    rules
  };
}
function setStyleOverride(id, style) {
  return {
    type: "SET_STYLE_OVERRIDE",
    id,
    style
  };
}
function deleteStyleOverride(id) {
  return {
    type: "DELETE_STYLE_OVERRIDE",
    id
  };
}
function setLastFocus(lastFocus = null) {
  return {
    type: "LAST_FOCUS",
    lastFocus
  };
}
function startDragging() {
  return {
    type: "START_DRAGGING"
  };
}
function stopDragging() {
  return {
    type: "STOP_DRAGGING"
  };
}
function expandBlock(clientId) {
  return {
    type: "SET_BLOCK_EXPANDED_IN_LIST_VIEW",
    clientId
  };
}
function setInsertionPoint(value) {
  return {
    type: "SET_INSERTION_POINT",
    value
  };
}
function editContentOnlySection(clientId) {
  return {
    type: "EDIT_CONTENT_ONLY_SECTION",
    clientId
  };
}
function stopEditingContentOnlySection() {
  return {
    type: "EDIT_CONTENT_ONLY_SECTION"
  };
}
var setZoomLevel = (zoom = 100) => ({ select, dispatch }) => {
  if (zoom !== 100) {
    const firstSelectedClientId = select.getBlockSelectionStart();
    const sectionRootClientId = select.getSectionRootClientId();
    if (firstSelectedClientId) {
      let sectionClientId;
      if (sectionRootClientId) {
        const sectionClientIds = select.getBlockOrder(sectionRootClientId);
        if (sectionClientIds?.includes(firstSelectedClientId)) {
          sectionClientId = firstSelectedClientId;
        } else {
          sectionClientId = select.getBlockParents(firstSelectedClientId).find(
            (parent) => sectionClientIds.includes(parent)
          );
        }
      } else {
        sectionClientId = select.getBlockHierarchyRootClientId(
          firstSelectedClientId
        );
      }
      if (sectionClientId) {
        dispatch.selectBlock(sectionClientId);
      } else {
        dispatch.clearSelectedBlock();
      }
      (0, import_a11y.speak)((0, import_i18n.__)("You are currently in zoom-out mode."));
    }
  }
  dispatch({
    type: "SET_ZOOM_LEVEL",
    zoom
  });
};
function resetZoomLevel() {
  return {
    type: "RESET_ZOOM_LEVEL"
  };
}
function toggleBlockSpotlight(clientId, hasBlockSpotlight) {
  return {
    type: "TOGGLE_BLOCK_SPOTLIGHT",
    clientId,
    hasBlockSpotlight
  };
}
function openListViewContentPanel() {
  return {
    type: "OPEN_LIST_VIEW_CONTENT_PANEL"
  };
}
function closeListViewContentPanel() {
  return {
    type: "CLOSE_LIST_VIEW_CONTENT_PANEL"
  };
}
function showViewportModal(clientIds) {
  return {
    type: "SHOW_VIEWPORT_MODAL",
    clientIds
  };
}
function hideViewportModal() {
  return {
    type: "HIDE_VIEWPORT_MODAL"
  };
}
function requestInspectorTab(tabName, options = {}) {
  return {
    type: "REQUEST_INSPECTOR_TAB",
    tabName,
    options
  };
}
function clearRequestedInspectorTab() {
  return {
    type: "CLEAR_REQUESTED_INSPECTOR_TAB"
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  __experimentalUpdateSettings,
  clearBlockRemovalPrompt,
  clearRequestedInspectorTab,
  closeListViewContentPanel,
  deleteStyleOverride,
  editContentOnlySection,
  ensureDefaultBlock,
  expandBlock,
  hideBlockInterface,
  hideViewportModal,
  openListViewContentPanel,
  privateRemoveBlocks,
  requestInspectorTab,
  resetZoomLevel,
  setBlockRemovalRules,
  setInsertionPoint,
  setLastFocus,
  setStyleOverride,
  setZoomLevel,
  showBlockInterface,
  showViewportModal,
  startDragging,
  stopDragging,
  stopEditingContentOnlySection,
  toggleBlockSpotlight
});
//# sourceMappingURL=private-actions.cjs.map
