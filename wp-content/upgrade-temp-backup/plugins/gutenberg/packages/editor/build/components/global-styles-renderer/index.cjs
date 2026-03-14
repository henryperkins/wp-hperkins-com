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

// packages/editor/src/components/global-styles-renderer/index.js
var global_styles_renderer_exports = {};
__export(global_styles_renderer_exports, {
  GlobalStylesRenderer: () => GlobalStylesRenderer
});
module.exports = __toCommonJS(global_styles_renderer_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_store = require("../../store/index.cjs");
var import_use_global_styles_output = require("../../hooks/use-global-styles-output.cjs");
function useGlobalStylesRenderer(disableRootPadding) {
  const [styles, settings] = (0, import_use_global_styles_output.useGlobalStylesOutput)(disableRootPadding);
  const { getEditorSettings } = (0, import_data.useSelect)(import_store.store);
  const { updateEditorSettings } = (0, import_data.useDispatch)(import_store.store);
  (0, import_element.useEffect)(() => {
    if (!styles || !settings) {
      return;
    }
    const currentStoreSettings = getEditorSettings();
    const nonGlobalStyles = Object.values(
      currentStoreSettings.styles ?? []
    ).filter((style) => !style.isGlobalStyles);
    updateEditorSettings({
      ...currentStoreSettings,
      styles: [...nonGlobalStyles, ...styles],
      __experimentalFeatures: settings
    });
  }, [styles, settings, updateEditorSettings, getEditorSettings]);
}
function GlobalStylesRenderer({ disableRootPadding }) {
  useGlobalStylesRenderer(disableRootPadding);
  return null;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GlobalStylesRenderer
});
//# sourceMappingURL=index.cjs.map
