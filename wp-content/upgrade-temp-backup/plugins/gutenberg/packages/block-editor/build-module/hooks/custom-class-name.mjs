// packages/block-editor/src/hooks/custom-class-name.js
import clsx from "clsx";
import { addFilter } from "@wordpress/hooks";
import { TextControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { hasBlockSupport } from "@wordpress/blocks";
import { InspectorControls } from "../components/index.mjs";
import { useBlockEditingMode } from "../components/block-editing-mode/index.mjs";
import { jsx } from "react/jsx-runtime";
function addAttribute(settings) {
  if (hasBlockSupport(settings, "customClassName", true)) {
    settings.attributes = {
      ...settings.attributes,
      className: {
        type: "string"
      }
    };
  }
  return settings;
}
function CustomClassNameControlsPure({ className, setAttributes }) {
  const blockEditingMode = useBlockEditingMode();
  if (blockEditingMode !== "default") {
    return null;
  }
  return /* @__PURE__ */ jsx(InspectorControls, { group: "advanced", children: /* @__PURE__ */ jsx(
    TextControl,
    {
      __next40pxDefaultSize: true,
      autoComplete: "off",
      label: __("Additional CSS class(es)"),
      value: className || "",
      onChange: (nextValue) => {
        setAttributes({
          className: nextValue !== "" ? nextValue : void 0
        });
      },
      help: __("Separate multiple classes with spaces.")
    }
  ) });
}
var custom_class_name_default = {
  edit: CustomClassNameControlsPure,
  addSaveProps,
  attributeKeys: ["className"],
  hasSupport(name) {
    return hasBlockSupport(name, "customClassName", true);
  }
};
function addSaveProps(extraProps, blockType, attributes) {
  if (hasBlockSupport(blockType, "customClassName", true) && attributes.className) {
    extraProps.className = clsx(
      extraProps.className,
      attributes.className
    );
  }
  return extraProps;
}
function addTransforms(result, source, index, results) {
  if (!hasBlockSupport(result.name, "customClassName", true)) {
    return result;
  }
  if (results.length === 1 && result.innerBlocks.length === source.length) {
    return result;
  }
  if (results.length === 1 && source.length > 1 || results.length > 1 && source.length === 1) {
    return result;
  }
  if (source[index]) {
    const originClassName = source[index]?.attributes.className;
    if (originClassName && result.attributes.className === void 0) {
      return {
        ...result,
        attributes: {
          ...result.attributes,
          className: originClassName
        }
      };
    }
  }
  return result;
}
addFilter(
  "blocks.registerBlockType",
  "core/editor/custom-class-name/attribute",
  addAttribute
);
addFilter(
  "blocks.switchToBlockType.transformedBlock",
  "core/customClassName/addTransforms",
  addTransforms
);
export {
  addAttribute,
  addSaveProps,
  addTransforms,
  custom_class_name_default as default
};
//# sourceMappingURL=custom-class-name.mjs.map
