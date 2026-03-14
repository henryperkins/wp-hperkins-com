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

// packages/lazy-editor/src/hooks/use-editor-settings.tsx
var use_editor_settings_exports = {};
__export(use_editor_settings_exports, {
  useEditorSettings: () => useEditorSettings
});
module.exports = __toCommonJS(use_editor_settings_exports);
var import_global_styles_engine = require("@wordpress/global-styles-engine");
var import_core_data = require("@wordpress/core-data");
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_use_global_styles = require("./use-global-styles.cjs");
var import_lock_unlock = require("../lock-unlock.cjs");
function useEditorSettings({ stylesId }) {
  const { editorSettings } = (0, import_data.useSelect)(
    (select) => ({
      editorSettings: (0, import_lock_unlock.unlock)(
        select(import_core_data.store)
      ).getEditorSettings()
    }),
    []
  );
  const { user: globalStyles } = (0, import_use_global_styles.useUserGlobalStyles)(stylesId);
  const [globalStylesCSS] = (0, import_global_styles_engine.generateGlobalStyles)(globalStyles);
  const hasEditorSettings = !!editorSettings;
  const styles = (0, import_element.useMemo)(() => {
    if (!hasEditorSettings) {
      return [];
    }
    return [
      ...editorSettings?.styles ?? [],
      ...globalStylesCSS
    ];
  }, [hasEditorSettings, editorSettings?.styles, globalStylesCSS]);
  return {
    isReady: hasEditorSettings,
    editorSettings: (0, import_element.useMemo)(
      () => ({
        ...editorSettings ?? {},
        styles
      }),
      [editorSettings, styles]
    )
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useEditorSettings
});
//# sourceMappingURL=use-editor-settings.cjs.map
