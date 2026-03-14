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

// packages/global-styles-ui/src/root-menu.tsx
var root_menu_exports = {};
__export(root_menu_exports, {
  default: () => root_menu_default
});
module.exports = __toCommonJS(root_menu_exports);
var import_components = require("@wordpress/components");
var import_icons = require("@wordpress/icons");
var import_i18n = require("@wordpress/i18n");
var import_block_editor = require("@wordpress/block-editor");
var import_navigation_button = require("./navigation-button.cjs");
var import_hooks = require("./hooks.cjs");
var import_lock_unlock = require("./lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var {
  useHasDimensionsPanel,
  useHasTypographyPanel,
  useHasColorPanel,
  useSettingsForBlockElement,
  useHasBackgroundPanel
} = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
function RootMenu() {
  const [rawSettings] = (0, import_hooks.useSetting)("");
  const settings = useSettingsForBlockElement(rawSettings);
  const hasBackgroundPanel = useHasBackgroundPanel(rawSettings);
  const hasTypographyPanel = useHasTypographyPanel(settings);
  const hasColorPanel = useHasColorPanel(settings);
  const hasShadowPanel = true;
  const hasDimensionsPanel = useHasDimensionsPanel(settings);
  const hasLayoutPanel = hasDimensionsPanel;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalItemGroup, { children: [
    hasTypographyPanel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_navigation_button.NavigationButtonAsItem,
      {
        icon: import_icons.typography,
        path: "/typography",
        children: (0, import_i18n.__)("Typography")
      }
    ),
    hasColorPanel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_navigation_button.NavigationButtonAsItem, { icon: import_icons.color, path: "/colors", children: (0, import_i18n.__)("Colors") }),
    hasBackgroundPanel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_navigation_button.NavigationButtonAsItem,
      {
        icon: import_icons.background,
        path: "/background",
        "aria-label": (0, import_i18n.__)("Background styles"),
        children: (0, import_i18n.__)("Background")
      }
    ),
    hasShadowPanel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_navigation_button.NavigationButtonAsItem, { icon: import_icons.shadow, path: "/shadows", children: (0, import_i18n.__)("Shadows") }),
    hasLayoutPanel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_navigation_button.NavigationButtonAsItem, { icon: import_icons.layout, path: "/layout", children: (0, import_i18n.__)("Layout") })
  ] }) });
}
var root_menu_default = RootMenu;
//# sourceMappingURL=root-menu.cjs.map
