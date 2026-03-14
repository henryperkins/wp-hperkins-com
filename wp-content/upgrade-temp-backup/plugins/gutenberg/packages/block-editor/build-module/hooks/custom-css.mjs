// packages/block-editor/src/hooks/custom-css.js
import { useMemo } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { useInstanceId } from "@wordpress/compose";
import { getBlockType, hasBlockSupport } from "@wordpress/blocks";
import { __, sprintf } from "@wordpress/i18n";
import { processCSSNesting } from "@wordpress/global-styles-engine";
import InspectorControls from "../components/inspector-controls/index.mjs";
import AdvancedPanel, {
  validateCSS
} from "../components/global-styles/advanced-panel.mjs";
import { cleanEmptyObject, useStyleOverride } from "./utils.mjs";
import { store as blockEditorStore } from "../store/index.mjs";
import { jsx } from "react/jsx-runtime";
var CUSTOM_CSS_INSTANCE_REFERENCE = {};
var EMPTY_STYLE = {};
function CustomCSSControl({ blockName, setAttributes, style }) {
  const blockType = getBlockType(blockName);
  function onChange(newStyle) {
    const css = newStyle?.css?.trim() ? newStyle.css : void 0;
    setAttributes({
      style: cleanEmptyObject({ ...newStyle, css })
    });
  }
  const cssHelpText = sprintf(
    // translators: %s: is the name of a block e.g., 'Image' or 'Quote'.
    __(
      "Add your own CSS to customize the appearance of the %s block. You do not need to include a CSS selector, just add the property and value, e.g. color: red;."
    ),
    blockType?.title
  );
  return /* @__PURE__ */ jsx(InspectorControls, { group: "advanced", children: /* @__PURE__ */ jsx(
    AdvancedPanel,
    {
      value: style,
      onChange,
      inheritedValue: style,
      help: cssHelpText
    }
  ) });
}
function CustomCSSEdit({ clientId, name, setAttributes }) {
  const { style, canEditCSS } = useSelect(
    (select) => {
      const { getBlockAttributes, getSettings } = select(blockEditorStore);
      return {
        style: getBlockAttributes(clientId)?.style || EMPTY_STYLE,
        canEditCSS: getSettings().canEditCSS
      };
    },
    [clientId]
  );
  if (!canEditCSS) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    CustomCSSControl,
    {
      blockName: name,
      setAttributes,
      style
    }
  );
}
function useBlockProps({ style }) {
  const customCSS = style?.css;
  const isValidCSS = typeof customCSS === "string" && customCSS.trim().length > 0 && validateCSS(customCSS);
  const customCSSIdentifier = useInstanceId(
    CUSTOM_CSS_INSTANCE_REFERENCE,
    "wp-custom-css"
  );
  const customCSSSelector = `.${customCSSIdentifier}`;
  const transformedCSS = useMemo(() => {
    if (!isValidCSS) {
      return void 0;
    }
    return processCSSNesting(customCSS, customCSSSelector);
  }, [customCSS, customCSSSelector, isValidCSS]);
  useStyleOverride({ css: transformedCSS });
  if (!isValidCSS) {
    return {};
  }
  return {
    className: `has-custom-css ${customCSSIdentifier}`
  };
}
function addSaveProps(props, blockType, attributes) {
  if (!hasBlockSupport(blockType, "customCSS", true)) {
    return props;
  }
  if (!attributes?.style?.css?.trim()) {
    return props;
  }
  const className = props.className ? `${props.className} has-custom-css` : "has-custom-css";
  return {
    ...props,
    className
  };
}
var custom_css_default = {
  edit: CustomCSSEdit,
  useBlockProps,
  addSaveProps,
  attributeKeys: ["style"],
  hasSupport(name) {
    return hasBlockSupport(name, "customCSS", true);
  }
};
export {
  custom_css_default as default
};
//# sourceMappingURL=custom-css.mjs.map
