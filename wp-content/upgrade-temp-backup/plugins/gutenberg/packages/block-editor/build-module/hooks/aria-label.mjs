// packages/block-editor/src/hooks/aria-label.js
import { addFilter } from "@wordpress/hooks";
import { hasBlockSupport } from "@wordpress/blocks";
import { shouldSkipSerialization } from "./utils.mjs";
function addAttribute(settings) {
  if (settings?.attributes?.ariaLabel?.type) {
    return settings;
  }
  if (hasBlockSupport(settings, "ariaLabel")) {
    settings.attributes = {
      ...settings.attributes,
      ariaLabel: {
        type: "string"
      }
    };
  }
  return settings;
}
function addSaveProps(extraProps, blockType, attributes) {
  if (hasBlockSupport(blockType, "ariaLabel") && !shouldSkipSerialization(blockType, "ariaLabel", "ariaLabel")) {
    extraProps["aria-label"] = attributes.ariaLabel === "" ? null : attributes.ariaLabel;
  }
  return extraProps;
}
var aria_label_default = {
  addSaveProps,
  attributeKeys: ["ariaLabel"],
  hasSupport(name) {
    return hasBlockSupport(name, "ariaLabel");
  }
};
addFilter(
  "blocks.registerBlockType",
  "core/ariaLabel/attribute",
  addAttribute
);
export {
  addAttribute,
  addSaveProps,
  aria_label_default as default
};
//# sourceMappingURL=aria-label.mjs.map
