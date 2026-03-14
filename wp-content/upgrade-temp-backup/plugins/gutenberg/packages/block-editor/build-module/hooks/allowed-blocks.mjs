// packages/block-editor/src/hooks/allowed-blocks.js
import { addFilter } from "@wordpress/hooks";
import { hasBlockSupport, getBlockType } from "@wordpress/blocks";
import { PrivateInspectorControlsAllowedBlocks } from "../components/inspector-controls/groups.mjs";
import BlockAllowedBlocksControl from "../components/block-allowed-blocks/allowed-blocks-control.mjs";
import { useBlockEditingMode } from "../components/block-editing-mode/index.mjs";
import { jsx } from "react/jsx-runtime";
function BlockEditAllowedBlocksControlPure({ clientId }) {
  const blockEditingMode = useBlockEditingMode();
  const isContentOnly = blockEditingMode === "contentOnly";
  if (isContentOnly) {
    return null;
  }
  return /* @__PURE__ */ jsx(PrivateInspectorControlsAllowedBlocks.Fill, { children: /* @__PURE__ */ jsx(BlockAllowedBlocksControl, { clientId }) });
}
var allowed_blocks_default = {
  edit: BlockEditAllowedBlocksControlPure,
  attributeKeys: ["allowedBlocks"],
  hasSupport(name) {
    return hasBlockSupport(name, "allowedBlocks");
  }
};
function addAttribute(settings) {
  if (settings?.attributes?.allowedBlocks?.type) {
    return settings;
  }
  if (hasBlockSupport(settings, "allowedBlocks")) {
    settings.attributes = {
      ...settings.attributes,
      allowedBlocks: {
        type: "array"
      }
    };
  }
  return settings;
}
addFilter(
  "blocks.registerBlockType",
  "core/allowedBlocks/attribute",
  addAttribute
);
function addTransforms(result, source, index, results) {
  if (!hasBlockSupport(result.name, "allowedBlocks")) {
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
  const blockType = getBlockType(result.name);
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
addFilter(
  "blocks.switchToBlockType.transformedBlock",
  "core/allowedBlocks/addTransforms",
  addTransforms
);
export {
  addAttribute,
  addTransforms,
  allowed_blocks_default as default
};
//# sourceMappingURL=allowed-blocks.mjs.map
