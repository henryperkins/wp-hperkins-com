// packages/edit-site/src/components/save-keyboard-shortcut/index.js
import { useEffect } from "@wordpress/element";
import {
  useShortcut,
  store as keyboardShortcutsStore
} from "@wordpress/keyboard-shortcuts";
import { __ } from "@wordpress/i18n";
import { useDispatch, useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { store as editorStore } from "@wordpress/editor";
import { store as editSiteStore } from "../../store/index.mjs";
var shortcutName = "core/edit-site/save";
function SaveKeyboardShortcut() {
  const { __experimentalGetDirtyEntityRecords, isSavingEntityRecord } = useSelect(coreStore);
  const { hasNonPostEntityChanges, isPostSavingLocked } = useSelect(editorStore);
  const { savePost } = useDispatch(editorStore);
  const { setIsSaveViewOpened } = useDispatch(editSiteStore);
  const { registerShortcut, unregisterShortcut } = useDispatch(
    keyboardShortcutsStore
  );
  useEffect(() => {
    registerShortcut({
      name: shortcutName,
      category: "global",
      description: __("Save your changes."),
      keyCombination: {
        modifier: "primary",
        character: "s"
      }
    });
    return () => {
      unregisterShortcut(shortcutName);
    };
  }, [registerShortcut, unregisterShortcut]);
  useShortcut("core/edit-site/save", (event) => {
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
export {
  SaveKeyboardShortcut as default
};
//# sourceMappingURL=index.mjs.map
