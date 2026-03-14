// packages/block-editor/src/hooks/anchor.js
import { addFilter } from "@wordpress/hooks";
import { TextControl, ExternalLink } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { hasBlockSupport } from "@wordpress/blocks";
import { Platform } from "@wordpress/element";
import { InspectorControls } from "../components/index.mjs";
import { useBlockEditingMode } from "../components/block-editing-mode/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var ANCHOR_REGEX = /[\s#]/g;
function addAttribute(settings) {
  if ("type" in (settings.attributes?.anchor ?? {})) {
    return settings;
  }
  if (hasBlockSupport(settings, "anchor")) {
    settings.attributes = {
      ...settings.attributes,
      anchor: {
        type: "string"
      }
    };
  }
  return settings;
}
function BlockEditAnchorControlPure({ anchor, setAttributes }) {
  const blockEditingMode = useBlockEditingMode();
  if (blockEditingMode !== "default") {
    return null;
  }
  const isWeb = Platform.OS === "web";
  return /* @__PURE__ */ jsx(InspectorControls, { group: "advanced", children: /* @__PURE__ */ jsx(
    TextControl,
    {
      __next40pxDefaultSize: true,
      className: "html-anchor-control",
      label: __("HTML anchor"),
      help: /* @__PURE__ */ jsxs(Fragment, { children: [
        __(
          "Enter a word or two\u2014without spaces\u2014to make a unique web address just for this block, called an \u201Canchor\u201D. Then, you\u2019ll be able to link directly to this section of your page."
        ),
        isWeb && /* @__PURE__ */ jsxs(Fragment, { children: [
          " ",
          /* @__PURE__ */ jsx(
            ExternalLink,
            {
              href: __(
                "https://wordpress.org/documentation/article/page-jumps/"
              ),
              children: __("Learn more about anchors")
            }
          )
        ] })
      ] }),
      value: anchor || "",
      placeholder: !isWeb ? __("Add an anchor") : null,
      onChange: (nextValue) => {
        nextValue = nextValue.replace(ANCHOR_REGEX, "-");
        setAttributes({
          anchor: nextValue !== "" ? nextValue : void 0
        });
      },
      autoCapitalize: "none",
      autoComplete: "off"
    }
  ) });
}
var anchor_default = {
  addSaveProps,
  edit: BlockEditAnchorControlPure,
  attributeKeys: ["anchor"],
  hasSupport(name) {
    return hasBlockSupport(name, "anchor");
  }
};
function addSaveProps(extraProps, blockType, attributes) {
  if (hasBlockSupport(blockType, "anchor")) {
    extraProps.id = attributes.anchor === "" ? null : attributes.anchor;
  }
  return extraProps;
}
addFilter("blocks.registerBlockType", "core/anchor/attribute", addAttribute);
export {
  addAttribute,
  addSaveProps,
  anchor_default as default
};
//# sourceMappingURL=anchor.mjs.map
