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

// packages/global-styles-ui/src/screen-typography-element.tsx
var screen_typography_element_exports = {};
__export(screen_typography_element_exports, {
  default: () => screen_typography_element_default
});
module.exports = __toCommonJS(screen_typography_element_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_typography_panel = __toESM(require("./typography-panel.cjs"));
var import_screen_header = require("./screen-header.cjs");
var import_typography_preview = __toESM(require("./typography-preview.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var elements = {
  text: {
    description: (0, import_i18n.__)("Manage the fonts used on the site."),
    title: (0, import_i18n.__)("Text")
  },
  link: {
    description: (0, import_i18n.__)("Manage the fonts and typography used on the links."),
    title: (0, import_i18n.__)("Links")
  },
  heading: {
    description: (0, import_i18n.__)("Manage the fonts and typography used on headings."),
    title: (0, import_i18n.__)("Headings")
  },
  caption: {
    description: (0, import_i18n.__)("Manage the fonts and typography used on captions."),
    title: (0, import_i18n.__)("Captions")
  },
  button: {
    description: (0, import_i18n.__)("Manage the fonts and typography used on buttons."),
    title: (0, import_i18n.__)("Buttons")
  }
};
function ScreenTypographyElement({ element }) {
  const [headingLevel, setHeadingLevel] = (0, import_element.useState)("heading");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_screen_header.ScreenHeader,
      {
        title: elements[element].title,
        description: elements[element].description
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalSpacer, { marginX: 4, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_typography_preview.default,
      {
        element,
        headingLevel
      }
    ) }),
    element === "heading" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalSpacer, { marginX: 4, marginBottom: "1em", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      import_components.__experimentalToggleGroupControl,
      {
        label: (0, import_i18n.__)("Select heading level"),
        hideLabelFromVision: true,
        value: headingLevel,
        onChange: (value) => setHeadingLevel(value),
        isBlock: true,
        size: "__unstable-large",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.__experimentalToggleGroupControlOption,
            {
              value: "heading",
              showTooltip: true,
              "aria-label": (0, import_i18n.__)("All headings"),
              label: (0, import_i18n._x)("All", "heading levels")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.__experimentalToggleGroupControlOption,
            {
              value: "h1",
              showTooltip: true,
              "aria-label": (0, import_i18n.__)("Heading 1"),
              label: (0, import_i18n.__)("H1")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.__experimentalToggleGroupControlOption,
            {
              value: "h2",
              showTooltip: true,
              "aria-label": (0, import_i18n.__)("Heading 2"),
              label: (0, import_i18n.__)("H2")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.__experimentalToggleGroupControlOption,
            {
              value: "h3",
              showTooltip: true,
              "aria-label": (0, import_i18n.__)("Heading 3"),
              label: (0, import_i18n.__)("H3")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.__experimentalToggleGroupControlOption,
            {
              value: "h4",
              showTooltip: true,
              "aria-label": (0, import_i18n.__)("Heading 4"),
              label: (0, import_i18n.__)("H4")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.__experimentalToggleGroupControlOption,
            {
              value: "h5",
              showTooltip: true,
              "aria-label": (0, import_i18n.__)("Heading 5"),
              label: (0, import_i18n.__)("H5")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.__experimentalToggleGroupControlOption,
            {
              value: "h6",
              showTooltip: true,
              "aria-label": (0, import_i18n.__)("Heading 6"),
              label: (0, import_i18n.__)("H6")
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_typography_panel.default,
      {
        element,
        headingLevel
      }
    )
  ] });
}
var screen_typography_element_default = ScreenTypographyElement;
//# sourceMappingURL=screen-typography-element.cjs.map
