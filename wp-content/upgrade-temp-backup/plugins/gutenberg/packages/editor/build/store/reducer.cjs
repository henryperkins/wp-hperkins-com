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

// packages/editor/src/store/reducer.js
var reducer_exports = {};
__export(reducer_exports, {
  blockInserterPanel: () => blockInserterPanel,
  canvasMinHeight: () => canvasMinHeight,
  default: () => reducer_default,
  deleting: () => deleting,
  deviceType: () => deviceType,
  editorSettings: () => editorSettings,
  getPostRawValue: () => getPostRawValue,
  hasSameKeys: () => hasSameKeys,
  inserterSidebarToggleRef: () => inserterSidebarToggleRef,
  isUpdatingSamePostProperty: () => isUpdatingSamePostProperty,
  listViewPanel: () => listViewPanel,
  listViewToggleRef: () => listViewToggleRef,
  postAutosavingLock: () => postAutosavingLock,
  postId: () => postId,
  postLock: () => postLock,
  postSavingLock: () => postSavingLock,
  postType: () => postType,
  publishSidebarActive: () => publishSidebarActive,
  removedPanels: () => removedPanels,
  renderingMode: () => renderingMode,
  revisionId: () => revisionId,
  saving: () => saving,
  selectedNote: () => selectedNote,
  shouldOverwriteState: () => shouldOverwriteState,
  showStylebook: () => showStylebook,
  stylesPath: () => stylesPath,
  template: () => template,
  templateId: () => templateId
});
module.exports = __toCommonJS(reducer_exports);
var import_data = require("@wordpress/data");
var import_defaults = require("./defaults.cjs");
var import_reducer = __toESM(require("../dataviews/store/reducer.cjs"));
function getPostRawValue(value) {
  if (value && "object" === typeof value && "raw" in value) {
    return value.raw;
  }
  return value;
}
function hasSameKeys(a, b) {
  const keysA = Object.keys(a).sort();
  const keysB = Object.keys(b).sort();
  return keysA.length === keysB.length && keysA.every((key, index) => keysB[index] === key);
}
function isUpdatingSamePostProperty(action, previousAction) {
  return action.type === "EDIT_POST" && hasSameKeys(action.edits, previousAction.edits);
}
function shouldOverwriteState(action, previousAction) {
  if (action.type === "RESET_EDITOR_BLOCKS") {
    return !action.shouldCreateUndoLevel;
  }
  if (!previousAction || action.type !== previousAction.type) {
    return false;
  }
  return isUpdatingSamePostProperty(action, previousAction);
}
function postId(state = null, action) {
  switch (action.type) {
    case "SET_EDITED_POST":
      return action.postId;
  }
  return state;
}
function templateId(state = null, action) {
  switch (action.type) {
    case "SET_CURRENT_TEMPLATE_ID":
      return action.id;
  }
  return state;
}
function postType(state = null, action) {
  switch (action.type) {
    case "SET_EDITED_POST":
      return action.postType;
  }
  return state;
}
function template(state = { isValid: true }, action) {
  switch (action.type) {
    case "SET_TEMPLATE_VALIDITY":
      return {
        ...state,
        isValid: action.isValid
      };
  }
  return state;
}
function saving(state = {}, action) {
  switch (action.type) {
    case "REQUEST_POST_UPDATE_START":
    case "REQUEST_POST_UPDATE_FINISH":
      return {
        pending: action.type === "REQUEST_POST_UPDATE_START",
        options: action.options || {}
      };
  }
  return state;
}
function deleting(state = {}, action) {
  switch (action.type) {
    case "REQUEST_POST_DELETE_START":
    case "REQUEST_POST_DELETE_FINISH":
      return {
        pending: action.type === "REQUEST_POST_DELETE_START"
      };
  }
  return state;
}
function postLock(state = { isLocked: false }, action) {
  switch (action.type) {
    case "UPDATE_POST_LOCK":
      return action.lock;
  }
  return state;
}
function postSavingLock(state = {}, action) {
  switch (action.type) {
    case "LOCK_POST_SAVING":
      return { ...state, [action.lockName]: true };
    case "UNLOCK_POST_SAVING": {
      const { [action.lockName]: removedLockName, ...restState } = state;
      return restState;
    }
  }
  return state;
}
function postAutosavingLock(state = {}, action) {
  switch (action.type) {
    case "LOCK_POST_AUTOSAVING":
      return { ...state, [action.lockName]: true };
    case "UNLOCK_POST_AUTOSAVING": {
      const { [action.lockName]: removedLockName, ...restState } = state;
      return restState;
    }
  }
  return state;
}
function editorSettings(state = import_defaults.EDITOR_SETTINGS_DEFAULTS, action) {
  switch (action.type) {
    case "UPDATE_EDITOR_SETTINGS":
      return {
        ...state,
        ...action.settings
      };
  }
  return state;
}
function renderingMode(state = "post-only", action) {
  switch (action.type) {
    case "SET_RENDERING_MODE":
      return action.mode;
  }
  return state;
}
function deviceType(state = "Desktop", action) {
  switch (action.type) {
    case "SET_DEVICE_TYPE":
      return action.deviceType;
  }
  return state;
}
function removedPanels(state = [], action) {
  switch (action.type) {
    case "REMOVE_PANEL":
      if (!state.includes(action.panelName)) {
        return [...state, action.panelName];
      }
  }
  return state;
}
function blockInserterPanel(state = false, action) {
  switch (action.type) {
    case "SET_IS_LIST_VIEW_OPENED":
      return action.isOpen ? false : state;
    case "SET_IS_INSERTER_OPENED":
      return action.value;
  }
  return state;
}
function listViewPanel(state = false, action) {
  switch (action.type) {
    case "SET_IS_INSERTER_OPENED":
      return action.value ? false : state;
    case "SET_IS_LIST_VIEW_OPENED":
      return action.isOpen;
  }
  return state;
}
function listViewToggleRef(state = { current: null }) {
  return state;
}
function inserterSidebarToggleRef(state = { current: null }) {
  return state;
}
function publishSidebarActive(state = false, action) {
  switch (action.type) {
    case "OPEN_PUBLISH_SIDEBAR":
      return true;
    case "CLOSE_PUBLISH_SIDEBAR":
      return false;
    case "TOGGLE_PUBLISH_SIDEBAR":
      return !state;
  }
  return state;
}
function stylesPath(state = "/", action) {
  switch (action.type) {
    case "SET_STYLES_PATH":
      return action.path;
    case "RESET_STYLES_NAVIGATION":
      return "/";
  }
  return state;
}
function showStylebook(state = false, action) {
  switch (action.type) {
    case "SET_SHOW_STYLEBOOK":
      return action.show;
    case "RESET_STYLES_NAVIGATION":
      return false;
  }
  return state;
}
function canvasMinHeight(state = 0, action) {
  switch (action.type) {
    case "SET_CANVAS_MIN_HEIGHT":
      return action.minHeight;
  }
  return state;
}
function revisionId(state = null, action) {
  switch (action.type) {
    case "SET_CURRENT_REVISION_ID":
      return action.revisionId;
  }
  return state;
}
function selectedNote(state = {}, action) {
  switch (action.type) {
    case "SELECT_NOTE":
      return { noteId: action.noteId, options: action.options };
  }
  return state;
}
var reducer_default = (0, import_data.combineReducers)({
  postId,
  postType,
  templateId,
  saving,
  deleting,
  postLock,
  template,
  postSavingLock,
  editorSettings,
  postAutosavingLock,
  renderingMode,
  deviceType,
  removedPanels,
  blockInserterPanel,
  inserterSidebarToggleRef,
  listViewPanel,
  listViewToggleRef,
  publishSidebarActive,
  stylesPath,
  showStylebook,
  canvasMinHeight,
  revisionId,
  selectedNote,
  dataviews: import_reducer.default
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  blockInserterPanel,
  canvasMinHeight,
  deleting,
  deviceType,
  editorSettings,
  getPostRawValue,
  hasSameKeys,
  inserterSidebarToggleRef,
  isUpdatingSamePostProperty,
  listViewPanel,
  listViewToggleRef,
  postAutosavingLock,
  postId,
  postLock,
  postSavingLock,
  postType,
  publishSidebarActive,
  removedPanels,
  renderingMode,
  revisionId,
  saving,
  selectedNote,
  shouldOverwriteState,
  showStylebook,
  stylesPath,
  template,
  templateId
});
//# sourceMappingURL=reducer.cjs.map
