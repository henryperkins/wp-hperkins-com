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

// packages/customize-widgets/src/store/reducer.js
var reducer_exports = {};
__export(reducer_exports, {
  default: () => reducer_default
});
module.exports = __toCommonJS(reducer_exports);
var import_data = require("@wordpress/data");
function blockInserterPanel(state = false, action) {
  switch (action.type) {
    case "SET_IS_INSERTER_OPENED":
      return action.value;
  }
  return state;
}
var reducer_default = (0, import_data.combineReducers)({
  blockInserterPanel
});
//# sourceMappingURL=reducer.cjs.map
