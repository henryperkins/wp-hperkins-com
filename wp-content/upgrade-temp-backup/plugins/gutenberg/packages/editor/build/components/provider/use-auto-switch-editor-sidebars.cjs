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

// packages/editor/src/components/provider/use-auto-switch-editor-sidebars.js
var use_auto_switch_editor_sidebars_exports = {};
__export(use_auto_switch_editor_sidebars_exports, {
  default: () => use_auto_switch_editor_sidebars_default
});
module.exports = __toCommonJS(use_auto_switch_editor_sidebars_exports);
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_block_editor = require("@wordpress/block-editor");
var import_preferences = require("@wordpress/preferences");
var import_interface = require("@wordpress/interface");
function useAutoSwitchEditorSidebars() {
  const { hasBlockSelection } = (0, import_data.useSelect)((select) => {
    return {
      hasBlockSelection: !!select(import_block_editor.store).getBlockSelectionStart()
    };
  }, []);
  const { getActiveComplementaryArea } = (0, import_data.useSelect)(import_interface.store);
  const { enableComplementaryArea } = (0, import_data.useDispatch)(import_interface.store);
  const { get: getPreference } = (0, import_data.useSelect)(import_preferences.store);
  (0, import_element.useEffect)(() => {
    const activeGeneralSidebar = getActiveComplementaryArea("core");
    const isEditorSidebarOpened = [
      "edit-post/document",
      "edit-post/block"
    ].includes(activeGeneralSidebar);
    const isDistractionFree = getPreference("core", "distractionFree");
    if (!isEditorSidebarOpened || isDistractionFree) {
      return;
    }
    if (hasBlockSelection) {
      enableComplementaryArea("core", "edit-post/block");
    } else {
      enableComplementaryArea("core", "edit-post/document");
    }
  }, [
    hasBlockSelection,
    getActiveComplementaryArea,
    enableComplementaryArea,
    getPreference
  ]);
}
var use_auto_switch_editor_sidebars_default = useAutoSwitchEditorSidebars;
//# sourceMappingURL=use-auto-switch-editor-sidebars.cjs.map
