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

// packages/block-editor/src/hooks/custom-css.js
var custom_css_exports = {};
__export(custom_css_exports, {
  default: () => custom_css_default
});
module.exports = __toCommonJS(custom_css_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_compose = require("@wordpress/compose");
var import_blocks = require("@wordpress/blocks");
var import_i18n = require("@wordpress/i18n");
var import_global_styles_engine = require("@wordpress/global-styles-engine");
var import_inspector_controls = __toESM(require("../components/inspector-controls/index.cjs"));
var import_advanced_panel = __toESM(require("../components/global-styles/advanced-panel.cjs"));
var import_utils = require("./utils.cjs");
var import_store = require("../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var CUSTOM_CSS_INSTANCE_REFERENCE = {};
var EMPTY_STYLE = {};
function CustomCSSControl({ blockName, setAttributes, style }) {
  const blockType = (0, import_blocks.getBlockType)(blockName);
  function onChange(newStyle) {
    const css = newStyle?.css?.trim() ? newStyle.css : void 0;
    setAttributes({
      style: (0, import_utils.cleanEmptyObject)({ ...newStyle, css })
    });
  }
  const cssHelpText = (0, import_i18n.sprintf)(
    // translators: %s: is the name of a block e.g., 'Image' or 'Quote'.
    (0, import_i18n.__)(
      "Add your own CSS to customize the appearance of the %s block. You do not need to include a CSS selector, just add the property and value, e.g. color: red;."
    ),
    blockType?.title
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_inspector_controls.default, { group: "advanced", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_advanced_panel.default,
    {
      value: style,
      onChange,
      inheritedValue: style,
      help: cssHelpText
    }
  ) });
}
function CustomCSSEdit({ clientId, name, setAttributes }) {
  const { style, canEditCSS } = (0, import_data.useSelect)(
    (select) => {
      const { getBlockAttributes, getSettings } = select(import_store.store);
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
  const isValidCSS = typeof customCSS === "string" && customCSS.trim().length > 0 && (0, import_advanced_panel.validateCSS)(customCSS);
  const customCSSIdentifier = (0, import_compose.useInstanceId)(
    CUSTOM_CSS_INSTANCE_REFERENCE,
    "wp-custom-css"
  );
  const customCSSSelector = `.${customCSSIdentifier}`;
  const transformedCSS = (0, import_element.useMemo)(() => {
    if (!isValidCSS) {
      return void 0;
    }
    return (0, import_global_styles_engine.processCSSNesting)(customCSS, customCSSSelector);
  }, [customCSS, customCSSSelector, isValidCSS]);
  (0, import_utils.useStyleOverride)({ css: transformedCSS });
  if (!isValidCSS) {
    return {};
  }
  return {
    className: `has-custom-css ${customCSSIdentifier}`
  };
}
function addSaveProps(props, blockType, attributes) {
  if (!(0, import_blocks.hasBlockSupport)(blockType, "customCSS", true)) {
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
    return (0, import_blocks.hasBlockSupport)(name, "customCSS", true);
  }
};
//# sourceMappingURL=custom-css.cjs.map
