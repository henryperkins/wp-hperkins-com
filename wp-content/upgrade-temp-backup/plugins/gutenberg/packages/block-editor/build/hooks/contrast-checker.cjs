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

// packages/block-editor/src/hooks/contrast-checker.js
var contrast_checker_exports = {};
__export(contrast_checker_exports, {
  default: () => BlockColorContrastChecker
});
module.exports = __toCommonJS(contrast_checker_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_blocks = require("@wordpress/blocks");
var import_global_styles_engine = require("@wordpress/global-styles-engine");
var import_contrast_checker = __toESM(require("../components/contrast-checker/index.cjs"));
var import_use_block_refs = require("../components/block-list/use-block-props/use-block-refs.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function getComputedValue(node, property) {
  return node.ownerDocument.defaultView.getComputedStyle(node).getPropertyValue(property);
}
function getBlockElementColors(blockEl, blockType) {
  if (!blockEl || !blockType) {
    return {};
  }
  const textSelector = (0, import_global_styles_engine.getBlockSelector)(blockType, "color.text", {
    fallback: true
  });
  const backgroundSelector = (0, import_global_styles_engine.getBlockSelector)(
    blockType,
    "color.background",
    { fallback: true }
  );
  const textElement = blockEl.querySelector(textSelector) || blockEl;
  const backgroundElement = blockEl.querySelector(backgroundSelector) || blockEl;
  const linkElement = blockEl.querySelector("a");
  const textColor = getComputedValue(textElement, "color");
  const linkColor = linkElement && linkElement.textContent ? getComputedValue(linkElement, "color") : void 0;
  let backgroundColorNode = backgroundElement;
  let backgroundColor = getComputedValue(
    backgroundColorNode,
    "background-color"
  );
  while (backgroundColor === "rgba(0, 0, 0, 0)" && backgroundColorNode.parentNode && backgroundColorNode.parentNode.nodeType === backgroundColorNode.parentNode.ELEMENT_NODE) {
    backgroundColorNode = backgroundColorNode.parentNode;
    backgroundColor = getComputedValue(
      backgroundColorNode,
      "background-color"
    );
  }
  return {
    textColor,
    backgroundColor,
    linkColor
  };
}
function reducer(prevColors, newColors) {
  const hasChanged = Object.keys(newColors).some(
    (key) => prevColors[key] !== newColors[key]
  );
  return hasChanged ? newColors : prevColors;
}
function BlockColorContrastChecker({ clientId, name }) {
  const blockEl = (0, import_use_block_refs.useBlockElement)(clientId);
  const [colors, setColors] = (0, import_element.useReducer)(reducer, {});
  const blockType = (0, import_data.useSelect)(
    (select) => {
      return name ? select(import_blocks.store).getBlockType(name) : void 0;
    },
    [name]
  );
  (0, import_element.useLayoutEffect)(() => {
    if (!blockEl || !blockType) {
      return;
    }
    window.requestAnimationFrame(
      () => window.requestAnimationFrame(
        () => setColors(getBlockElementColors(blockEl, blockType))
      )
    );
  });
  (0, import_element.useLayoutEffect)(() => {
    if (!blockEl || !blockType) {
      return;
    }
    const observer = new window.MutationObserver(() => {
      setColors(getBlockElementColors(blockEl, blockType));
    });
    observer.observe(blockEl, {
      attributes: true,
      attributeFilter: ["class", "style"]
    });
    return () => {
      observer.disconnect();
    };
  }, [blockEl, blockType]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_contrast_checker.default,
    {
      backgroundColor: colors.backgroundColor,
      textColor: colors.textColor,
      linkColor: colors.linkColor,
      enableAlphaChecker: true
    }
  );
}
//# sourceMappingURL=contrast-checker.cjs.map
