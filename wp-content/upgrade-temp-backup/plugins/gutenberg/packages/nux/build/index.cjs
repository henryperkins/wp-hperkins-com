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

// packages/nux/src/index.js
var index_exports = {};
__export(index_exports, {
  DotTip: () => import_dot_tip.default,
  store: () => import_store.store
});
module.exports = __toCommonJS(index_exports);
var import_deprecated = __toESM(require("@wordpress/deprecated"));
var import_store = require("./store/index.cjs");
var import_dot_tip = __toESM(require("./components/dot-tip/index.cjs"));
(0, import_deprecated.default)("wp.nux", {
  since: "5.4",
  hint: "wp.components.Guide can be used to show a user guide.",
  version: "6.2"
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DotTip,
  store
});
//# sourceMappingURL=index.cjs.map
