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

// packages/block-editor/src/hooks/allowed-blocks.js
var allowed_blocks_exports = {};
__export(allowed_blocks_exports, {
  addAttribute: () => addAttribute,
  addTransforms: () => addTransforms,
  default: () => allowed_blocks_default
});
module.exports = __toCommonJS(allowed_blocks_exports);
var import_hooks = require("@wordpress/hooks");
var import_blocks = require("@wordpress/blocks");
var import_groups = require("../components/inspector-controls/groups.cjs");
var import_allowed_blocks_control = __toESM(require("../components/block-allowed-blocks/allowed-blocks-control.cjs"));
var import_block_editing_mode = require("../components/block-editing-mode/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function BlockEditAllowedBlocksControlPure({ clientId }) {
  const blockEditingMode = (0, import_block_editing_mode.useBlockEditingMode)();
  const isContentOnly = blockEditingMode === "contentOnly";
  if (isContentOnly) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_groups.PrivateInspectorControlsAllowedBlocks.Fill, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_allowed_blocks_control.default, { clientId }) });
}
var allowed_blocks_default = {
  edit: BlockEditAllowedBlocksControlPure,
  attributeKeys: ["allowedBlocks"],
  hasSupport(name) {
    return (0, import_blocks.hasBlockSupport)(name, "allowedBlocks");
  }
};
function addAttribute(settings) {
  if (settings?.attributes?.allowedBlocks?.type) {
    return settings;
  }
  if ((0, import_blocks.hasBlockSupport)(settings, "allowedBlocks")) {
    settings.attributes = {
      ...settings.attributes,
      allowedBlocks: {
        type: "array"
      }
    };
  }
  return settings;
}
(0, import_hooks.addFilter)(
  "blocks.registerBlockType",
  "core/allowedBlocks/attribute",
  addAttribute
);
function addTransforms(result, source, index, results) {
  if (!(0, import_blocks.hasBlockSupport)(result.name, "allowedBlocks")) {
    return result;
  }
  if (source.length !== 1 && results.length === 1 && result.innerBlocks.length === source.length) {
    return result;
  }
  if (results.length === 1 && source.length > 1 || results.length > 1 && source.length === 1) {
    return result;
  }
  if (results.length > 1 && source.length > 1 && results.length !== source.length) {
    return result;
  }
  if (result.attributes.allowedBlocks) {
    return result;
  }
  const sourceAllowedBlocks = source[index]?.attributes?.allowedBlocks;
  if (!sourceAllowedBlocks) {
    return result;
  }
  const blockType = (0, import_blocks.getBlockType)(result.name);
  const destinationAllowedBlocks = blockType?.allowedBlocks || [];
  if (!destinationAllowedBlocks.length) {
    return {
      ...result,
      attributes: {
        ...result.attributes,
        allowedBlocks: sourceAllowedBlocks
      }
    };
  }
  const filteredSourceAllowedBlocks = sourceAllowedBlocks.filter(
    (block) => destinationAllowedBlocks.includes(block)
  );
  return {
    ...result,
    attributes: {
      ...result.attributes,
      allowedBlocks: filteredSourceAllowedBlocks
    }
  };
}
(0, import_hooks.addFilter)(
  "blocks.switchToBlockType.transformedBlock",
  "core/allowedBlocks/addTransforms",
  addTransforms
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addAttribute,
  addTransforms
});
//# sourceMappingURL=allowed-blocks.cjs.map
