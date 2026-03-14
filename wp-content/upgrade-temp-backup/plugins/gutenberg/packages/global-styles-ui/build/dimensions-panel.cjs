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

// packages/global-styles-ui/src/dimensions-panel.tsx
var dimensions_panel_exports = {};
__export(dimensions_panel_exports, {
  default: () => DimensionsPanel
});
module.exports = __toCommonJS(dimensions_panel_exports);
var import_block_editor = require("@wordpress/block-editor");
var import_element = require("@wordpress/element");
var import_hooks = require("./hooks.cjs");
var import_lock_unlock = require("./lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useSettingsForBlockElement, DimensionsPanel: StylesDimensionsPanel } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
var DEFAULT_CONTROLS = {
  contentSize: true,
  wideSize: true,
  padding: true,
  margin: true,
  blockGap: true,
  height: true,
  minHeight: true,
  width: true,
  childLayout: false
};
function DimensionsPanel() {
  const [style] = (0, import_hooks.useStyle)("", void 0, "user", false);
  const [inheritedStyle, setStyle] = (0, import_hooks.useStyle)(
    "",
    void 0,
    "merged",
    false
  );
  const [userSettings] = (0, import_hooks.useSetting)("", void 0, "user");
  const [rawSettings, setSettings] = (0, import_hooks.useSetting)("");
  const settings = useSettingsForBlockElement(rawSettings);
  const inheritedStyleWithLayout = (0, import_element.useMemo)(() => {
    return {
      ...inheritedStyle,
      layout: settings.layout
    };
  }, [inheritedStyle, settings.layout]);
  const styleWithLayout = (0, import_element.useMemo)(() => {
    return {
      ...style,
      layout: userSettings.layout
    };
  }, [style, userSettings.layout]);
  const onChange = (newStyle) => {
    const updatedStyle = { ...newStyle };
    delete updatedStyle.layout;
    setStyle(updatedStyle);
    if (newStyle.layout !== userSettings.layout) {
      const updatedSettings = {
        ...userSettings,
        layout: newStyle.layout
      };
      if (updatedSettings.layout?.definitions) {
        delete updatedSettings.layout.definitions;
      }
      setSettings(updatedSettings);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    StylesDimensionsPanel,
    {
      inheritedValue: inheritedStyleWithLayout,
      value: styleWithLayout,
      onChange,
      settings,
      includeLayoutControls: true,
      defaultControls: DEFAULT_CONTROLS
    }
  );
}
//# sourceMappingURL=dimensions-panel.cjs.map
