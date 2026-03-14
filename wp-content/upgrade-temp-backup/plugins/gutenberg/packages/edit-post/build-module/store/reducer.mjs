// packages/edit-post/src/store/reducer.js
import { combineReducers } from "@wordpress/data";
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
var metaBoxes = combineReducers({
  isSaving: isSavingMetaBoxes,
  locations: metaBoxLocations,
  initialized: metaBoxesInitialized
});
var reducer_default = combineReducers({
  metaBoxes
});
export {
  reducer_default as default,
  isSavingMetaBoxes,
  metaBoxLocations
};
//# sourceMappingURL=reducer.mjs.map
