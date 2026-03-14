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

// packages/editor/src/components/global-keyboard-shortcuts/index.js
var global_keyboard_shortcuts_exports = {};
__export(global_keyboard_shortcuts_exports, {
  default: () => EditorKeyboardShortcuts
});
module.exports = __toCommonJS(global_keyboard_shortcuts_exports);
var import_keyboard_shortcuts = require("@wordpress/keyboard-shortcuts");
var import_data = require("@wordpress/data");
var import_interface = require("@wordpress/interface");
var import_block_editor = require("@wordpress/block-editor");
var import_store = require("../../store/index.cjs");
function EditorKeyboardShortcuts() {
  const isModeToggleDisabled = (0, import_data.useSelect)((select) => {
    const { richEditingEnabled, codeEditingEnabled } = select(import_store.store).getEditorSettings();
    return !richEditingEnabled || !codeEditingEnabled;
  }, []);
  const { getBlockSelectionStart } = (0, import_data.useSelect)(import_block_editor.store);
  const { getActiveComplementaryArea } = (0, import_data.useSelect)(import_interface.store);
  const { enableComplementaryArea, disableComplementaryArea } = (0, import_data.useDispatch)(import_interface.store);
  const {
    redo,
    undo,
    savePost,
    setIsListViewOpened,
    switchEditorMode,
    toggleDistractionFree
  } = (0, import_data.useDispatch)(import_store.store);
  const {
    isEditedPostDirty,
    isPostSavingLocked,
    isListViewOpened,
    getEditorMode
  } = (0, import_data.useSelect)(import_store.store);
  (0, import_keyboard_shortcuts.useShortcut)(
    "core/editor/toggle-mode",
    () => {
      switchEditorMode(
        getEditorMode() === "visual" ? "text" : "visual"
      );
    },
    {
      isDisabled: isModeToggleDisabled
    }
  );
  (0, import_keyboard_shortcuts.useShortcut)("core/editor/toggle-distraction-free", () => {
    toggleDistractionFree();
  });
  (0, import_keyboard_shortcuts.useShortcut)("core/editor/undo", (event) => {
    undo();
    event.preventDefault();
  });
  (0, import_keyboard_shortcuts.useShortcut)("core/editor/redo", (event) => {
    redo();
    event.preventDefault();
  });
  (0, import_keyboard_shortcuts.useShortcut)("core/editor/save", (event) => {
    event.preventDefault();
    if (isPostSavingLocked()) {
      return;
    }
    if (!isEditedPostDirty()) {
      return;
    }
    savePost();
  });
  (0, import_keyboard_shortcuts.useShortcut)("core/editor/toggle-list-view", (event) => {
    if (!isListViewOpened()) {
      event.preventDefault();
      setIsListViewOpened(true);
    }
  });
  (0, import_keyboard_shortcuts.useShortcut)("core/editor/toggle-sidebar", (event) => {
    event.preventDefault();
    const isEditorSidebarOpened = [
      "edit-post/document",
      "edit-post/block"
    ].includes(getActiveComplementaryArea("core"));
    if (isEditorSidebarOpened) {
      disableComplementaryArea("core");
    } else {
      const sidebarToOpen = getBlockSelectionStart() ? "edit-post/block" : "edit-post/document";
      enableComplementaryArea("core", sidebarToOpen);
    }
  });
  return null;
}
//# sourceMappingURL=index.cjs.map
