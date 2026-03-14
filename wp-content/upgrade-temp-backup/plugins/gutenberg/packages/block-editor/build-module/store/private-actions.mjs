// packages/block-editor/src/store/private-actions.js
import { Platform } from "@wordpress/element";
import deprecated from "@wordpress/deprecated";
import { speak } from "@wordpress/a11y";
import { __ } from "@wordpress/i18n";
var castArray = (maybeArray) => Array.isArray(maybeArray) ? maybeArray : [maybeArray];
var privateSettings = [
  "inserterMediaCategories",
  "blockInspectorAnimation",
  "mediaSideload"
];
function __experimentalUpdateSettings(settings, { stripExperimentalSettings = false, reset = false } = {}) {
  let incomingSettings = settings;
  if (Object.hasOwn(incomingSettings, "__unstableIsPreviewMode")) {
    deprecated(
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
  if (stripExperimentalSettings && Platform.OS === "web") {
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
      speak(__("You are currently in zoom-out mode."));
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
export {
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
};
//# sourceMappingURL=private-actions.mjs.map
