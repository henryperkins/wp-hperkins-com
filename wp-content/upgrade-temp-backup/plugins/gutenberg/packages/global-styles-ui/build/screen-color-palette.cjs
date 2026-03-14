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

// packages/global-styles-ui/src/screen-color-palette.tsx
var screen_color_palette_exports = {};
__export(screen_color_palette_exports, {
  default: () => screen_color_palette_default
});
module.exports = __toCommonJS(screen_color_palette_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_screen_header = require("./screen-header.cjs");
var import_color_palette_panel = __toESM(require("./color-palette-panel.cjs"));
var import_gradients_palette_panel = __toESM(require("./gradients-palette-panel.cjs"));
var import_lock_unlock = require("./lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { Tabs } = (0, import_lock_unlock.unlock)(import_components.privateApis);
function ScreenColorPalette({ name }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_screen_header.ScreenHeader,
      {
        title: (0, import_i18n.__)("Edit palette"),
        description: (0, import_i18n.__)(
          "The combination of colors used across the site and in color pickers."
        )
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs.TabList, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs.Tab, { tabId: "color", children: (0, import_i18n.__)("Color") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs.Tab, { tabId: "gradient", children: (0, import_i18n.__)("Gradient") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs.TabPanel, { tabId: "color", focusable: false, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_color_palette_panel.default, { name }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs.TabPanel, { tabId: "gradient", focusable: false, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_gradients_palette_panel.default, { name }) })
    ] })
  ] });
}
var screen_color_palette_default = ScreenColorPalette;
//# sourceMappingURL=screen-color-palette.cjs.map
