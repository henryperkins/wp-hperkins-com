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

// packages/interface/src/store/reducer.js
var reducer_exports = {};
__export(reducer_exports, {
  activeModal: () => activeModal,
  complementaryAreas: () => complementaryAreas,
  default: () => reducer_default
});
module.exports = __toCommonJS(reducer_exports);
var import_data = require("@wordpress/data");
function complementaryAreas(state = {}, action) {
  switch (action.type) {
    case "SET_DEFAULT_COMPLEMENTARY_AREA": {
      const { scope, area } = action;
      if (state[scope]) {
        return state;
      }
      return {
        ...state,
        [scope]: area
      };
    }
    case "ENABLE_COMPLEMENTARY_AREA": {
      const { scope, area } = action;
      return {
        ...state,
        [scope]: area
      };
    }
  }
  return state;
}
function activeModal(state = null, action) {
  switch (action.type) {
    case "OPEN_MODAL":
      return action.name;
    case "CLOSE_MODAL":
      return null;
  }
  return state;
}
var reducer_default = (0, import_data.combineReducers)({
  complementaryAreas,
  activeModal
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activeModal,
  complementaryAreas
});
//# sourceMappingURL=reducer.cjs.map
