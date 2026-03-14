"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/global-styles-ui/src/font-family-item.tsx
var font_family_item_exports = {};
__export(font_family_item_exports, {
  default: () => font_family_item_default
});
module.exports = __toCommonJS(font_family_item_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_context = require("./font-library/context.cjs");
var import_preview_styles = require("./font-library/utils/preview-styles.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function FontFamilyItem({ font }) {
  const { handleSetLibraryFontSelected, setModalTabOpen } = (0, import_element.useContext)(import_context.FontLibraryContext);
  const variantsCount = font?.fontFace?.length || 1;
  const handleClick = () => {
    handleSetLibraryFontSelected?.(font);
    setModalTabOpen?.("installed-fonts");
  };
  const previewStyle = (0, import_preview_styles.getFamilyPreviewStyle)(font);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalItem, { onClick: handleClick, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "space-between", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { style: previewStyle, children: font.name }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { className: "global-styles-ui-screen-typography__font-variants-count", children: (0, import_i18n.sprintf)(
      /* translators: %d: Number of font variants. */
      (0, import_i18n._n)("%d variant", "%d variants", variantsCount),
      variantsCount
    ) })
  ] }) });
}
var font_family_item_default = FontFamilyItem;
//# sourceMappingURL=font-family-item.cjs.map
