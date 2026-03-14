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

// packages/editor/src/bindings/api.js
var api_exports = {};
__export(api_exports, {
  registerCoreBlockBindingsSources: () => registerCoreBlockBindingsSources
});
module.exports = __toCommonJS(api_exports);
var import_blocks = require("@wordpress/blocks");
var import_pattern_overrides = __toESM(require("./pattern-overrides.cjs"));
var import_post_data = __toESM(require("./post-data.cjs"));
var import_post_meta = __toESM(require("./post-meta.cjs"));
var import_term_data = __toESM(require("./term-data.cjs"));
function registerCoreBlockBindingsSources() {
  (0, import_blocks.registerBlockBindingsSource)(import_pattern_overrides.default);
  (0, import_blocks.registerBlockBindingsSource)(import_post_data.default);
  (0, import_blocks.registerBlockBindingsSource)(import_post_meta.default);
  (0, import_blocks.registerBlockBindingsSource)(import_term_data.default);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  registerCoreBlockBindingsSources
});
//# sourceMappingURL=api.cjs.map
