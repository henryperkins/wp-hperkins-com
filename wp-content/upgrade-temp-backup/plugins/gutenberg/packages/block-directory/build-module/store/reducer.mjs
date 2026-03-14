// packages/block-directory/src/store/reducer.js
import { combineReducers } from "@wordpress/data";
var downloadableBlocks = (state = {}, action) => {
  switch (action.type) {
    case "FETCH_DOWNLOADABLE_BLOCKS":
      return {
        ...state,
        [action.filterValue]: {
          isRequesting: true
        }
      };
    case "RECEIVE_DOWNLOADABLE_BLOCKS":
      return {
        ...state,
        [action.filterValue]: {
          results: action.downloadableBlocks,
          isRequesting: false
        }
      };
  }
  return state;
};
var blockManagement = (state = {
  installedBlockTypes: [],
  isInstalling: {}
}, action) => {
  switch (action.type) {
    case "ADD_INSTALLED_BLOCK_TYPE":
      return {
        ...state,
        installedBlockTypes: [
          ...state.installedBlockTypes,
          action.item
        ]
      };
    case "REMOVE_INSTALLED_BLOCK_TYPE":
      return {
        ...state,
        installedBlockTypes: state.installedBlockTypes.filter(
          (blockType) => blockType.name !== action.item.name
        )
      };
    case "SET_INSTALLING_BLOCK":
      return {
        ...state,
        isInstalling: {
          ...state.isInstalling,
          [action.blockId]: action.isInstalling
        }
      };
  }
  return state;
};
var errorNotices = (state = {}, action) => {
  switch (action.type) {
    case "SET_ERROR_NOTICE":
      return {
        ...state,
        [action.blockId]: {
          message: action.message,
          isFatal: action.isFatal
        }
      };
    case "CLEAR_ERROR_NOTICE":
      const { [action.blockId]: blockId, ...restState } = state;
      return restState;
  }
  return state;
};
var reducer_default = combineReducers({
  downloadableBlocks,
  blockManagement,
  errorNotices
});
export {
  blockManagement,
  reducer_default as default,
  downloadableBlocks,
  errorNotices
};
//# sourceMappingURL=reducer.mjs.map
