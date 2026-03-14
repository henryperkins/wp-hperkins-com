// packages/boot/src/components/save-panel/use-save-shortcut.ts
import { useEffect } from "@wordpress/element";
import {
  useShortcut,
  store as keyboardShortcutsStore
} from "@wordpress/keyboard-shortcuts";
import { __ } from "@wordpress/i18n";
import { useDispatch, useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { store as editorStore } from "@wordpress/editor";
var shortcutName = "core/boot/save";
function useSaveShortcut({
  openSavePanel
}) {
  const { __experimentalGetDirtyEntityRecords, isSavingEntityRecord } = useSelect(coreStore);
  const { hasNonPostEntityChanges, isPostSavingLocked } = useSelect(editorStore);
  const { savePost } = useDispatch(editorStore);
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
  useShortcut(shortcutName, (event) => {
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
      openSavePanel();
    } else if (!isPostSavingLocked()) {
      savePost();
    }
  });
}
export {
  useSaveShortcut as default
};
//# sourceMappingURL=use-save-shortcut.mjs.map
