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

// packages/global-styles-ui/src/font-families.tsx
var font_families_exports = {};
__export(font_families_exports, {
  default: () => FontFamilies
});
module.exports = __toCommonJS(font_families_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_icons = require("@wordpress/icons");
var import_element = require("@wordpress/element");
var import_subtitle = require("./subtitle.cjs");
var import_hooks = require("./hooks.cjs");
var import_context = __toESM(require("./font-library/context.cjs"));
var import_modal = __toESM(require("./font-library/modal.cjs"));
var import_font_family_item = __toESM(require("./font-family-item.cjs"));
var import_utils = require("./font-library/utils/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function mapFontsWithSource(fonts, source) {
  return fonts ? fonts.map((f) => (0, import_utils.setUIValuesNeeded)(f, { source })) : [];
}
function FontFamiliesInner() {
  const { baseCustomFonts, modalTabOpen, setModalTabOpen } = (0, import_element.useContext)(import_context.FontLibraryContext);
  const [fontFamilies] = (0, import_hooks.useSetting)("typography.fontFamilies");
  const [baseFontFamilies] = (0, import_hooks.useSetting)(
    "typography.fontFamilies",
    void 0,
    "base"
  );
  const themeFonts = mapFontsWithSource(fontFamilies?.theme, "theme");
  const customFonts = mapFontsWithSource(fontFamilies?.custom, "custom");
  const activeFonts = [...themeFonts, ...customFonts].sort(
    (a, b) => a.name.localeCompare(b.name)
  );
  const hasFonts = 0 < activeFonts.length;
  const hasInstalledFonts = hasFonts || baseFontFamilies?.theme?.length > 0 || (baseCustomFonts?.length ?? 0) > 0;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    !!modalTabOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_modal.default,
      {
        onRequestClose: () => setModalTabOpen?.(""),
        defaultTabId: modalTabOpen
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 2, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "space-between", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_subtitle.Subtitle, { level: 3, children: (0, import_i18n.__)("Fonts") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            onClick: () => setModalTabOpen?.("installed-fonts"),
            label: (0, import_i18n.__)("Manage fonts"),
            icon: import_icons.settings,
            size: "small"
          }
        )
      ] }),
      activeFonts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalItemGroup, { size: "large", isBordered: true, isSeparated: true, children: activeFonts.map((font) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_font_family_item.default,
        {
          font
        },
        font.slug
      )) }) }),
      !hasFonts && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { as: "p", children: hasInstalledFonts ? (0, import_i18n.__)("No fonts activated.") : (0, import_i18n.__)("No fonts installed.") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            className: "global-styles-ui-font-families__manage-fonts",
            variant: "secondary",
            __next40pxDefaultSize: true,
            onClick: () => {
              setModalTabOpen?.(
                hasInstalledFonts ? "installed-fonts" : "upload-fonts"
              );
            },
            children: hasInstalledFonts ? (0, import_i18n.__)("Manage fonts") : (0, import_i18n.__)("Add fonts")
          }
        )
      ] })
    ] })
  ] });
}
function FontFamilies({ ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_context.default, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontFamiliesInner, { ...props }) });
}
//# sourceMappingURL=font-families.cjs.map
