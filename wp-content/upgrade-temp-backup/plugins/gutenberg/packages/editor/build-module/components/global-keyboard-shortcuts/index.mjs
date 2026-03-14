// packages/editor/src/components/global-keyboard-shortcuts/index.js
import { useShortcut } from "@wordpress/keyboard-shortcuts";
import { useDispatch, useSelect } from "@wordpress/data";
import { store as interfaceStore } from "@wordpress/interface";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { store as editorStore } from "../../store/index.mjs";
function EditorKeyboardShortcuts() {
  const isModeToggleDisabled = useSelect((select) => {
    const { richEditingEnabled, codeEditingEnabled } = select(editorStore).getEditorSettings();
    return !richEditingEnabled || !codeEditingEnabled;
  }, []);
  const { getBlockSelectionStart } = useSelect(blockEditorStore);
  const { getActiveComplementaryArea } = useSelect(interfaceStore);
  const { enableComplementaryArea, disableComplementaryArea } = useDispatch(interfaceStore);
  const {
    redo,
    undo,
    savePost,
    setIsListViewOpened,
    switchEditorMode,
    toggleDistractionFree
  } = useDispatch(editorStore);
  const {
    isEditedPostDirty,
    isPostSavingLocked,
    isListViewOpened,
    getEditorMode
  } = useSelect(editorStore);
  useShortcut(
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
  useShortcut("core/editor/toggle-distraction-free", () => {
    toggleDistractionFree();
  });
  useShortcut("core/editor/undo", (event) => {
    undo();
    event.preventDefault();
  });
  useShortcut("core/editor/redo", (event) => {
    redo();
    event.preventDefault();
  });
  useShortcut("core/editor/save", (event) => {
    event.preventDefault();
    if (isPostSavingLocked()) {
      return;
    }
    if (!isEditedPostDirty()) {
      return;
    }
    savePost();
  });
  useShortcut("core/editor/toggle-list-view", (event) => {
    if (!isListViewOpened()) {
      event.preventDefault();
      setIsListViewOpened(true);
    }
  });
  useShortcut("core/editor/toggle-sidebar", (event) => {
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
export {
  EditorKeyboardShortcuts as default
};
//# sourceMappingURL=index.mjs.map
