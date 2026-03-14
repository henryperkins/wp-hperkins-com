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

// packages/edit-site/src/components/save-keyboard-shortcut/index.js
var save_keyboard_shortcut_exports = {};
__export(save_keyboard_shortcut_exports, {
  default: () => SaveKeyboardShortcut
});
module.exports = __toCommonJS(save_keyboard_shortcut_exports);
var import_element = require("@wordpress/element");
var import_keyboard_shortcuts = require("@wordpress/keyboard-shortcuts");
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_editor = require("@wordpress/editor");
var import_store = require("../../store/index.cjs");
var shortcutName = "core/edit-site/save";
function SaveKeyboardShortcut() {
  const { __experimentalGetDirtyEntityRecords, isSavingEntityRecord } = (0, import_data.useSelect)(import_core_data.store);
  const { hasNonPostEntityChanges, isPostSavingLocked } = (0, import_data.useSelect)(import_editor.store);
  const { savePost } = (0, import_data.useDispatch)(import_editor.store);
  const { setIsSaveViewOpened } = (0, import_data.useDispatch)(import_store.store);
  const { registerShortcut, unregisterShortcut } = (0, import_data.useDispatch)(
    import_keyboard_shortcuts.store
  );
  (0, import_element.useEffect)(() => {
    registerShortcut({
      name: shortcutName,
      category: "global",
      description: (0, import_i18n.__)("Save your changes."),
      keyCombination: {
        modifier: "primary",
        character: "s"
      }
    });
    return () => {
      unregisterShortcut(shortcutName);
    };
  }, [registerShortcut, unregisterShortcut]);
  (0, import_keyboard_shortcuts.useShortcut)("core/edit-site/save", (event) => {
    event.preventDefault();
    const dirtyEntityRecords = __experimentalGetDirtyEntityRecords();
    const hasDirtyEntities = !!dirtyEntityRecords.length;
    const isSaving = dirtyEntityRecords.some(
      (record) => isSavingEntityRecord(record.kind, record.name, record.key)
    );
    if (!hasDirtyEntities || isSaving) {
      return;
    }
    if (hasNonPostEntityChanges()) {
      setIsSaveViewOpened(true);
    } else if (!isPostSavingLocked()) {
      savePost();
    }
  });
  return null;
}
//# sourceMappingURL=index.cjs.map
