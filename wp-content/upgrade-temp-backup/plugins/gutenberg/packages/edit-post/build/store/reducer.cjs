var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/edit-post/src/store/reducer.js
var reducer_exports = {};
__export(reducer_exports, {
  default: () => reducer_default,
  isSavingMetaBoxes: () => isSavingMetaBoxes,
  metaBoxLocations: () => metaBoxLocations
});
module.exports = __toCommonJS(reducer_exports);
var import_data = require("@wordpress/data");
function isSavingMetaBoxes(state = false, action) {
  switch (action.type) {
    case "REQUEST_META_BOX_UPDATES":
      return true;
    case "META_BOX_UPDATES_SUCCESS":
    case "META_BOX_UPDATES_FAILURE":
      return false;
    default:
      return state;
  }
}
function mergeMetaboxes(metaboxes = [], newMetaboxes) {
  const mergedMetaboxes = [...metaboxes];
  for (const metabox of newMetaboxes) {
    const existing = mergedMetaboxes.findIndex(
      (box) => box.id === metabox.id
    );
    if (existing !== -1) {
      mergedMetaboxes[existing] = metabox;
    } else {
      mergedMetaboxes.push(metabox);
    }
  }
  return mergedMetaboxes;
}
function metaBoxLocations(state = {}, action) {
  switch (action.type) {
    case "SET_META_BOXES_PER_LOCATIONS": {
      const newState = { ...state };
      for (const [location, metaboxes] of Object.entries(
        action.metaBoxesPerLocation
      )) {
        newState[location] = mergeMetaboxes(
          newState[location],
          metaboxes
        );
      }
      return newState;
    }
  }
  return state;
}
function metaBoxesInitialized(state = false, action) {
  switch (action.type) {
    case "META_BOXES_INITIALIZED":
      return true;
  }
  return state;
}
var metaBoxes = (0, import_data.combineReducers)({
  isSaving: isSavingMetaBoxes,
  locations: metaBoxLocations,
  initialized: metaBoxesInitialized
});
var reducer_default = (0, import_data.combineReducers)({
  metaBoxes
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  isSavingMetaBoxes,
  metaBoxLocations
});
//# sourceMappingURL=reducer.cjs.map
