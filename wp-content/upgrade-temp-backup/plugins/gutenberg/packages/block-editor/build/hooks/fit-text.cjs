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

// packages/block-editor/src/hooks/fit-text.js
var fit_text_exports = {};
__export(fit_text_exports, {
  FIT_TEXT_SUPPORT_KEY: () => FIT_TEXT_SUPPORT_KEY,
  FitTextControl: () => FitTextControl,
  default: () => fit_text_default
});
module.exports = __toCommonJS(fit_text_exports);
var import_hooks = require("@wordpress/hooks");
var import_blocks = require("@wordpress/blocks");
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_compose = require("@wordpress/compose");
var import_fit_text_utils = require("../utils/fit-text-utils.cjs");
var import_store = require("../store/index.cjs");
var import_use_block_refs = require("../components/block-list/use-block-props/use-block-refs.cjs");
var import_inspector_controls = __toESM(require("../components/inspector-controls/index.cjs"));
var import_fit_text_size_warning = __toESM(require("../components/fit-text-size-warning/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var EMPTY_OBJECT = {};
var MIN_FONT_SIZE_FOR_WARNING = 12;
var FIT_TEXT_SUPPORT_KEY = "typography.fitText";
function addAttributes(settings) {
  if (!(0, import_blocks.hasBlockSupport)(settings, FIT_TEXT_SUPPORT_KEY)) {
    return settings;
  }
  if (settings.attributes?.fitText) {
    return settings;
  }
  return {
    ...settings,
    attributes: {
      ...settings.attributes,
      fitText: {
        type: "boolean"
      }
    }
  };
}
function useFitText({ fitText, name, clientId }) {
  const [fontSize, setFontSize] = (0, import_element.useState)(null);
  const hasFitTextSupport2 = (0, import_blocks.hasBlockSupport)(name, FIT_TEXT_SUPPORT_KEY);
  const blockElement = (0, import_use_block_refs.useBlockElement)(clientId);
  const { blockAttributes, parentId, blockMode } = (0, import_data.useSelect)(
    (select) => {
      if (!clientId || !hasFitTextSupport2 || !fitText) {
        return EMPTY_OBJECT;
      }
      const _blockMode = select(import_store.store).getBlockMode(clientId);
      if (_blockMode === "html") {
        return { blockMode: _blockMode };
      }
      return {
        blockAttributes: select(import_store.store).getBlockAttributes(clientId),
        parentId: select(import_store.store).getBlockRootClientId(clientId),
        blockMode: _blockMode
      };
    },
    [clientId, hasFitTextSupport2, fitText]
  );
  const applyFitText = (0, import_element.useCallback)(() => {
    if (!blockElement || !hasFitTextSupport2 || !fitText) {
      return;
    }
    const styleId = `fit-text-${clientId}`;
    let styleElement = blockElement.ownerDocument.getElementById(styleId);
    if (!styleElement) {
      styleElement = blockElement.ownerDocument.createElement("style");
      styleElement.id = styleId;
      blockElement.ownerDocument.head.appendChild(styleElement);
    }
    const blockSelector = `#block-${clientId}`;
    const applyFontSizeStyle = (size) => {
      if (size === 0) {
        styleElement.textContent = "";
      } else {
        styleElement.textContent = `${blockSelector} { font-size: ${size}px !important; }`;
      }
    };
    const optimalSize = (0, import_fit_text_utils.optimizeFitText)(blockElement, applyFontSizeStyle);
    setFontSize(optimalSize);
  }, [blockElement, clientId, hasFitTextSupport2, fitText]);
  (0, import_element.useEffect)(() => {
    if (!fitText || !blockElement || !clientId || !hasFitTextSupport2 || blockMode === "html") {
      return;
    }
    const currentElement = blockElement;
    const previousVisibility = currentElement.style.visibility;
    let hideFrameId = null;
    let calculateFrameId = null;
    let showTimeoutId = null;
    hideFrameId = window.requestAnimationFrame(() => {
      currentElement.style.visibility = "hidden";
      calculateFrameId = window.requestAnimationFrame(() => {
        applyFitText();
        showTimeoutId = setTimeout(() => {
          currentElement.style.visibility = previousVisibility;
        }, 10);
      });
    });
    let resizeObserver;
    if (window.ResizeObserver && currentElement.parentElement) {
      resizeObserver = new window.ResizeObserver(applyFitText);
      resizeObserver.observe(currentElement.parentElement);
      resizeObserver.observe(currentElement);
    }
    return () => {
      if (hideFrameId !== null) {
        window.cancelAnimationFrame(hideFrameId);
      }
      if (calculateFrameId !== null) {
        window.cancelAnimationFrame(calculateFrameId);
      }
      if (showTimeoutId !== null) {
        clearTimeout(showTimeoutId);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      const styleId = `fit-text-${clientId}`;
      const styleElement = currentElement.ownerDocument.getElementById(styleId);
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, [
    fitText,
    clientId,
    parentId,
    applyFitText,
    blockElement,
    hasFitTextSupport2,
    blockMode
  ]);
  (0, import_element.useEffect)(() => {
    if (fitText && blockElement && hasFitTextSupport2 && blockMode !== "html") {
      const frameId = window.requestAnimationFrame(() => {
        if (blockElement) {
          applyFitText();
        }
      });
      return () => window.cancelAnimationFrame(frameId);
    }
  }, [
    blockAttributes,
    fitText,
    applyFitText,
    blockElement,
    hasFitTextSupport2,
    blockMode
  ]);
  return { fontSize };
}
function FitTextControl({
  clientId,
  fitText = false,
  setAttributes,
  name,
  fontSize,
  style,
  warning
}) {
  if (!(0, import_blocks.hasBlockSupport)(name, FIT_TEXT_SUPPORT_KEY)) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_inspector_controls.default, { group: "typography", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.__experimentalToolsPanelItem,
    {
      hasValue: () => fitText,
      label: (0, import_i18n.__)("Fit text"),
      onDeselect: () => setAttributes({ fitText: void 0 }),
      resetAllFilter: () => ({ fitText: void 0 }),
      panelId: clientId,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.ToggleControl,
          {
            label: (0, import_i18n.__)("Fit text"),
            checked: fitText,
            onChange: () => {
              const newFitText = !fitText || void 0;
              const updates = { fitText: newFitText };
              if (newFitText) {
                if (fontSize) {
                  updates.fontSize = void 0;
                }
                if (style?.typography?.fontSize) {
                  updates.style = {
                    ...style,
                    typography: {
                      ...style?.typography,
                      fontSize: void 0
                    }
                  };
                }
              }
              setAttributes(updates);
            },
            help: fitText ? (0, import_i18n.__)("Text will resize to fit its container.") : (0, import_i18n.__)(
              "The text will resize to fit its container, resetting other font size settings."
            )
          }
        ),
        warning
      ]
    }
  ) });
}
function addSaveProps(props, blockType, attributes) {
  if (!(0, import_blocks.hasBlockSupport)(blockType, FIT_TEXT_SUPPORT_KEY)) {
    return props;
  }
  const { fitText } = attributes;
  if (!fitText) {
    return props;
  }
  const className = props.className ? `${props.className} has-fit-text` : "has-fit-text";
  return {
    ...props,
    className
  };
}
function useBlockProps({ name, fitText }) {
  if (fitText && (0, import_blocks.hasBlockSupport)(name, FIT_TEXT_SUPPORT_KEY)) {
    return {
      className: "has-fit-text"
    };
  }
  return {};
}
(0, import_hooks.addFilter)(
  "blocks.registerBlockType",
  "core/fit-text/addAttribute",
  addAttributes
);
var hasFitTextSupport = (blockNameOrType) => {
  return (0, import_blocks.hasBlockSupport)(blockNameOrType, FIT_TEXT_SUPPORT_KEY);
};
function WithFitTextFontSize({ fitText, name, clientId, children }) {
  const { fontSize } = useFitText({ fitText, name, clientId });
  return children(fontSize);
}
var addFitTextControl = (0, import_compose.createHigherOrderComponent)((BlockEdit) => {
  return function AddFitTextControl(props) {
    const { name, attributes, clientId, isSelected, setAttributes } = props;
    const { fitText } = attributes;
    const supportsFitText = (0, import_blocks.hasBlockSupport)(name, FIT_TEXT_SUPPORT_KEY);
    if (!supportsFitText) {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockEdit, { ...props });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockEdit, { ...props }),
      fitText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        WithFitTextFontSize,
        {
          fitText,
          name,
          clientId,
          children: (fontSize) => isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            FitTextControl,
            {
              clientId,
              fitText,
              setAttributes,
              name,
              fontSize: attributes.fontSize,
              style: attributes.style,
              warning: fontSize < MIN_FONT_SIZE_FOR_WARNING && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_fit_text_size_warning.default, {})
            }
          )
        }
      ),
      !fitText && isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        FitTextControl,
        {
          clientId,
          fitText,
          setAttributes,
          name,
          fontSize: attributes.fontSize,
          style: attributes.style
        }
      )
    ] });
  };
}, "addFitTextControl");
(0, import_hooks.addFilter)(
  "editor.BlockEdit",
  "core/fit-text/add-fit-text-control",
  addFitTextControl
);
var fit_text_default = {
  useBlockProps,
  addSaveProps,
  attributeKeys: ["fitText", "fontSize", "style"],
  hasSupport: hasFitTextSupport,
  edit: () => null
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FIT_TEXT_SUPPORT_KEY,
  FitTextControl
});
//# sourceMappingURL=fit-text.cjs.map
