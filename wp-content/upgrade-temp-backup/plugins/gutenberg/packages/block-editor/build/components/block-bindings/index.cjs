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

// packages/block-editor/src/components/block-bindings/index.js
var block_bindings_exports = {};
__export(block_bindings_exports, {
  BlockBindingsAttributeControl: () => import_attribute_control.default,
  BlockBindingsSourceFieldsList: () => import_source_fields_list.default,
  useBlockBindingsUtils: () => import_use_block_bindings_utils.default
});
module.exports = __toCommonJS(block_bindings_exports);
var import_attribute_control = __toESM(require("./attribute-control.cjs"));
var import_source_fields_list = __toESM(require("./source-fields-list.cjs"));
var import_use_block_bindings_utils = __toESM(require("./use-block-bindings-utils.cjs"));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BlockBindingsAttributeControl,
  BlockBindingsSourceFieldsList,
  useBlockBindingsUtils
});
//# sourceMappingURL=index.cjs.map
