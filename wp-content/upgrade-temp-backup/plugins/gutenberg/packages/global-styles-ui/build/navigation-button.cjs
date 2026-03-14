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

// packages/global-styles-ui/src/navigation-button.tsx
var navigation_button_exports = {};
__export(navigation_button_exports, {
  NavigationBackButtonAsItem: () => NavigationBackButtonAsItem,
  NavigationButtonAsItem: () => NavigationButtonAsItem
});
module.exports = __toCommonJS(navigation_button_exports);
var import_components = require("@wordpress/components");
var import_icon_with_current_color = require("./icon-with-current-color.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function GenericNavigationButton({
  icon,
  children,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalItem, { ...props, children: [
    icon && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "flex-start", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icon_with_current_color.IconWithCurrentColor, { icon, size: 24 }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children })
    ] }),
    !icon && children
  ] });
}
function NavigationButtonAsItem(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Navigator.Button, { as: GenericNavigationButton, ...props });
}
function NavigationBackButtonAsItem(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Navigator.BackButton, { as: GenericNavigationButton, ...props });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NavigationBackButtonAsItem,
  NavigationButtonAsItem
});
//# sourceMappingURL=navigation-button.cjs.map
