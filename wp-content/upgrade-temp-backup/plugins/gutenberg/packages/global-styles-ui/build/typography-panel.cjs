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

// packages/global-styles-ui/src/typography-panel.tsx
var typography_panel_exports = {};
__export(typography_panel_exports, {
  default: () => TypographyPanel
});
module.exports = __toCommonJS(typography_panel_exports);
var import_block_editor = require("@wordpress/block-editor");
var import_hooks = require("./hooks.cjs");
var import_lock_unlock = require("./lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useSettingsForBlockElement, TypographyPanel: StylesTypographyPanel } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
function TypographyPanel({
  element,
  headingLevel
}) {
  let prefixParts = [];
  if (element === "heading") {
    prefixParts = prefixParts.concat(["elements", headingLevel]);
  } else if (element && element !== "text") {
    prefixParts = prefixParts.concat(["elements", element]);
  }
  const prefix = prefixParts.join(".");
  const [style] = (0, import_hooks.useStyle)(prefix, "", "user", false);
  const [inheritedStyle, setStyle] = (0, import_hooks.useStyle)(
    prefix,
    "",
    "merged",
    false
  );
  const [rawSettings] = (0, import_hooks.useSetting)("");
  const usedElement = element === "heading" ? headingLevel : element;
  const settings = useSettingsForBlockElement(
    rawSettings,
    void 0,
    usedElement
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    StylesTypographyPanel,
    {
      inheritedValue: inheritedStyle,
      value: style,
      onChange: setStyle,
      settings
    }
  );
}
//# sourceMappingURL=typography-panel.cjs.map
