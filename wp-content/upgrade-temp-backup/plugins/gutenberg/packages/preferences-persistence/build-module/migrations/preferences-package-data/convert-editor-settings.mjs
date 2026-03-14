// packages/preferences-persistence/src/migrations/preferences-package-data/convert-editor-settings.js
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
export {
  convertEditorSettings as default
};
//# sourceMappingURL=convert-editor-settings.mjs.map
