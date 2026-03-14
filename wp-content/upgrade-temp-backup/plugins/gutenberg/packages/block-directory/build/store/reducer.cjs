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

// packages/block-directory/src/store/reducer.js
var reducer_exports = {};
__export(reducer_exports, {
  blockManagement: () => blockManagement,
  default: () => reducer_default,
  downloadableBlocks: () => downloadableBlocks,
  errorNotices: () => errorNotices
});
module.exports = __toCommonJS(reducer_exports);
var import_data = require("@wordpress/data");
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
var reducer_default = (0, import_data.combineReducers)({
  downloadableBlocks,
  blockManagement,
  errorNotices
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  blockManagement,
  downloadableBlocks,
  errorNotices
});
//# sourceMappingURL=reducer.cjs.map
