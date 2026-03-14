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

// packages/edit-site/src/components/block-editor/use-site-editor-settings.js
var use_site_editor_settings_exports = {};
__export(use_site_editor_settings_exports, {
  useSpecificEditorSettings: () => useSpecificEditorSettings
});
module.exports = __toCommonJS(use_site_editor_settings_exports);
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_router = require("@wordpress/router");
var import_compose = require("@wordpress/compose");
var import_editor = require("@wordpress/editor");
var import_global_styles_engine = require("@wordpress/global-styles-engine");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_use_navigate_to_entity_record = __toESM(require("./use-navigate-to-entity-record.cjs"));
var import_constants = require("../../utils/constants.cjs");
var { useLocation, useHistory } = (0, import_lock_unlock.unlock)(import_router.privateApis);
var { useGlobalStyles } = (0, import_lock_unlock.unlock)(import_editor.privateApis);
function useNavigateToPreviousEntityRecord() {
  const location = useLocation();
  const previousCanvas = (0, import_compose.usePrevious)(location.query.canvas);
  const history = useHistory();
  const goBack = (0, import_element.useMemo)(() => {
    const isFocusMode = location.query.focusMode || location?.params?.postId && import_constants.FOCUSABLE_ENTITIES.includes(location?.params?.postType);
    const didComeFromEditorCanvas = previousCanvas === "edit";
    const showBackButton = isFocusMode && didComeFromEditorCanvas;
    return showBackButton ? () => history.back() : void 0;
  }, [location, history, previousCanvas]);
  return goBack;
}
function useSpecificEditorSettings() {
  const { query } = useLocation();
  const { canvas = "view" } = query;
  const onNavigateToEntityRecord = (0, import_use_navigate_to_entity_record.default)();
  const { merged: mergedConfig } = useGlobalStyles();
  const { settings, currentPostIsTrashed } = (0, import_data.useSelect)((select) => {
    const { getSettings } = select(import_store.store);
    const { getCurrentPostAttribute } = select(import_editor.store);
    return {
      settings: getSettings(),
      currentPostIsTrashed: getCurrentPostAttribute("status") === "trash"
    };
  }, []);
  const onNavigateToPreviousEntityRecord = useNavigateToPreviousEntityRecord();
  const [globalStyles, globalSettings] = (0, import_element.useMemo)(() => {
    return (0, import_global_styles_engine.generateGlobalStyles)(mergedConfig, [], {
      disableRootPadding: false
    });
  }, [mergedConfig]);
  const defaultEditorSettings = (0, import_element.useMemo)(() => {
    const nonGlobalStyles = (settings?.styles ?? []).filter(
      (style) => !style.isGlobalStyles
    );
    return {
      ...settings,
      styles: [
        ...nonGlobalStyles,
        ...globalStyles,
        {
          // Forming a "block formatting context" to prevent margin collapsing.
          // @see https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context
          css: canvas === "view" ? `body{min-height: 100vh; ${currentPostIsTrashed ? "" : "cursor: pointer;"}}` : void 0
        }
      ],
      __experimentalFeatures: globalSettings,
      richEditingEnabled: true,
      supportsTemplateMode: true,
      focusMode: canvas !== "view",
      onNavigateToEntityRecord,
      onNavigateToPreviousEntityRecord,
      isPreviewMode: canvas === "view"
    };
  }, [
    settings,
    globalStyles,
    globalSettings,
    canvas,
    currentPostIsTrashed,
    onNavigateToEntityRecord,
    onNavigateToPreviousEntityRecord
  ]);
  return defaultEditorSettings;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useSpecificEditorSettings
});
//# sourceMappingURL=use-site-editor-settings.cjs.map
