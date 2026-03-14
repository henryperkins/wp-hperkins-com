var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
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

// packages/edit-widgets/src/blocks/widget-area/index.js
var widget_area_exports = {};
__export(widget_area_exports, {
  metadata: () => import_block.default,
  name: () => name,
  settings: () => settings
});
module.exports = __toCommonJS(widget_area_exports);
var import_i18n = require("@wordpress/i18n");
var import_block = __toESM(require("./block.json"));
var import_edit = __toESM(require("./edit/index.cjs"));
var { name } = import_block.default;
var settings = {
  title: (0, import_i18n.__)("Widget Area"),
  description: (0, import_i18n.__)("A widget area container."),
  __experimentalLabel: ({ name: label }) => label,
  edit: import_edit.default
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  metadata,
  name,
  settings
});
//# sourceMappingURL=index.cjs.map
