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

// packages/global-styles-ui/src/typography-elements.tsx
var typography_elements_exports = {};
__export(typography_elements_exports, {
  default: () => typography_elements_default
});
module.exports = __toCommonJS(typography_elements_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_navigation_button = require("./navigation-button.cjs");
var import_subtitle = require("./subtitle.cjs");
var import_hooks = require("./hooks.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function ElementItem({ parentMenu, element, label }) {
  const prefix = element === "text" || !element ? "" : `elements.${element}.`;
  const extraStyles = element === "link" ? {
    textDecoration: "underline"
  } : {};
  const [fontFamily] = (0, import_hooks.useStyle)(
    prefix + "typography.fontFamily"
  );
  const [fontStyle] = (0, import_hooks.useStyle)(prefix + "typography.fontStyle");
  const [fontWeight] = (0, import_hooks.useStyle)(
    prefix + "typography.fontWeight"
  );
  const [backgroundColor] = (0, import_hooks.useStyle)(
    prefix + "color.background"
  );
  const [fallbackBackgroundColor] = (0, import_hooks.useStyle)("color.background");
  const [gradientValue] = (0, import_hooks.useStyle)(prefix + "color.gradient");
  const [color] = (0, import_hooks.useStyle)(prefix + "color.text");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_navigation_button.NavigationButtonAsItem, { path: parentMenu + "/typography/" + element, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "flex-start", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.FlexItem,
      {
        className: "global-styles-ui-screen-typography__indicator",
        "aria-hidden": "true",
        style: {
          fontFamily: fontFamily ?? "serif",
          background: gradientValue ?? backgroundColor ?? fallbackBackgroundColor,
          color,
          fontStyle,
          fontWeight,
          ...extraStyles
        },
        children: (0, import_i18n.__)("Aa")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children: label })
  ] }) });
}
function TypographyElements() {
  const parentMenu = "";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 3, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_subtitle.Subtitle, { level: 3, children: (0, import_i18n.__)("Elements") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalItemGroup, { isBordered: true, isSeparated: true, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        ElementItem,
        {
          parentMenu,
          element: "text",
          label: (0, import_i18n.__)("Text")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        ElementItem,
        {
          parentMenu,
          element: "link",
          label: (0, import_i18n.__)("Links")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        ElementItem,
        {
          parentMenu,
          element: "heading",
          label: (0, import_i18n.__)("Headings")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        ElementItem,
        {
          parentMenu,
          element: "caption",
          label: (0, import_i18n.__)("Captions")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        ElementItem,
        {
          parentMenu,
          element: "button",
          label: (0, import_i18n.__)("Buttons")
        }
      )
    ] })
  ] });
}
var typography_elements_default = TypographyElements;
//# sourceMappingURL=typography-elements.cjs.map
