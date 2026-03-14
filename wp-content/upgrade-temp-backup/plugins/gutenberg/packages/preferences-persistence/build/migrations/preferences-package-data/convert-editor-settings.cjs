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

// packages/preferences-persistence/src/migrations/preferences-package-data/convert-editor-settings.js
var convert_editor_settings_exports = {};
__export(convert_editor_settings_exports, {
  default: () => convertEditorSettings
});
module.exports = __toCommonJS(convert_editor_settings_exports);
function convertEditorSettings(data) {
  let newData = data;
  const settingsToMoveToCore = [
    "allowRightClickOverrides",
    "distractionFree",
    "editorMode",
    "fixedToolbar",
    "focusMode",
    "hiddenBlockTypes",
    "inactivePanels",
    "keepCaretInsideBlock",
    "mostUsedBlocks",
    "openPanels",
    "showBlockBreadcrumbs",
    "showIconLabels",
    "showListViewByDefault",
    "isPublishSidebarEnabled",
    "isComplementaryAreaVisible",
    "pinnedItems"
  ];
  settingsToMoveToCore.forEach((setting) => {
    if (data?.["core/edit-post"]?.[setting] !== void 0) {
      newData = {
        ...newData,
        core: {
          ...newData?.core,
          [setting]: data["core/edit-post"][setting]
        }
      };
      delete newData["core/edit-post"][setting];
    }
    if (data?.["core/edit-site"]?.[setting] !== void 0) {
      delete newData["core/edit-site"][setting];
    }
  });
  if (Object.keys(newData?.["core/edit-post"] ?? {})?.length === 0) {
    delete newData["core/edit-post"];
  }
  if (Object.keys(newData?.["core/edit-site"] ?? {})?.length === 0) {
    delete newData["core/edit-site"];
  }
  return newData;
}
//# sourceMappingURL=convert-editor-settings.cjs.map
