"use strict";
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

// packages/block-library/src/utils/is-block-metadata-experimental.js
var is_block_metadata_experimental_exports = {};
__export(is_block_metadata_experimental_exports, {
  default: () => isBlockMetadataExperimental
});
module.exports = __toCommonJS(is_block_metadata_experimental_exports);
function isBlockMetadataExperimental(metadata) {
  return metadata && "__experimental" in metadata && metadata.__experimental !== false;
}
//# sourceMappingURL=is-block-metadata-experimental.cjs.map
