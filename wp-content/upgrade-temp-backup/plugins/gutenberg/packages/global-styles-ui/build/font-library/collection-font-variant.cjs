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

// packages/global-styles-ui/src/font-library/collection-font-variant.tsx
var collection_font_variant_exports = {};
__export(collection_font_variant_exports, {
  default: () => collection_font_variant_default
});
module.exports = __toCommonJS(collection_font_variant_exports);
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_utils = require("./utils/index.cjs");
var import_font_demo = __toESM(require("./font-demo.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function CollectionFontVariant({
  face,
  font,
  handleToggleVariant,
  selected
}) {
  const handleToggleActivation = () => {
    if (font?.fontFace) {
      handleToggleVariant(font, face);
      return;
    }
    handleToggleVariant(font);
  };
  const displayName = font.name + " " + (0, import_utils.getFontFaceVariantName)(face);
  const checkboxId = (0, import_element.useId)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "font-library__font-card", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Flex, { justify: "flex-start", align: "center", gap: "1rem", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.CheckboxControl,
      {
        checked: selected,
        onChange: handleToggleActivation,
        id: checkboxId
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { htmlFor: checkboxId, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_font_demo.default,
      {
        font: face,
        text: displayName,
        onClick: handleToggleActivation
      }
    ) })
  ] }) });
}
var collection_font_variant_default = CollectionFontVariant;
//# sourceMappingURL=collection-font-variant.cjs.map
