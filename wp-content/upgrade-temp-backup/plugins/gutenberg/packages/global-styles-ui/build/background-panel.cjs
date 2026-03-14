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

// packages/global-styles-ui/src/background-panel.tsx
var background_panel_exports = {};
__export(background_panel_exports, {
  default: () => BackgroundPanel,
  hasBackgroundImageValue: () => hasBackgroundImageValue
});
module.exports = __toCommonJS(background_panel_exports);
var import_block_editor = require("@wordpress/block-editor");
var import_hooks = require("./hooks.cjs");
var import_lock_unlock = require("./lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var BACKGROUND_DEFAULT_VALUES = {
  backgroundSize: "auto"
};
var { BackgroundPanel: StylesBackgroundPanel } = (0, import_lock_unlock.unlock)(
  import_block_editor.privateApis
);
function hasBackgroundImageValue(style) {
  return !!style?.background?.backgroundImage?.id || !!style?.background?.backgroundImage?.url || typeof style?.background?.backgroundImage === "string";
}
function BackgroundPanel() {
  const [style] = (0, import_hooks.useStyle)("", void 0, "user", false);
  const [inheritedStyle, setStyle] = (0, import_hooks.useStyle)(
    "",
    void 0,
    "merged",
    false
  );
  const [settings] = (0, import_hooks.useSetting)("");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    StylesBackgroundPanel,
    {
      inheritedValue: inheritedStyle,
      value: style,
      onChange: setStyle,
      settings,
      defaultValues: BACKGROUND_DEFAULT_VALUES
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  hasBackgroundImageValue
});
//# sourceMappingURL=background-panel.cjs.map
