// packages/editor/src/components/provider/use-upload-save-lock.js
import { useSelect, useDispatch } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
import { store as uploadStore } from "@wordpress/upload-media";
import { store as editorStore } from "../../store/index.mjs";
var LOCK_NAME = "upload-in-progress";
function useUploadSaveLock() {
  const isClientSideMediaProcessingEnabled = window.__clientSideMediaProcessing;
  const isUploading = useSelect(
    (select) => {
      if (!isClientSideMediaProcessingEnabled) {
        return false;
      }
      return select(uploadStore).isUploading();
    },
    [isClientSideMediaProcessingEnabled]
  );
  const {
    lockPostSaving,
    unlockPostSaving,
    lockPostAutosaving,
    unlockPostAutosaving
  } = useDispatch(editorStore);
  useEffect(() => {
    if (!isClientSideMediaProcessingEnabled) {
      return;
    }
    if (isUploading) {
      lockPostSaving(LOCK_NAME);
      lockPostAutosaving(LOCK_NAME);
    } else {
      unlockPostSaving(LOCK_NAME);
      unlockPostAutosaving(LOCK_NAME);
    }
    return () => {
      unlockPostSaving(LOCK_NAME);
      unlockPostAutosaving(LOCK_NAME);
    };
  }, [
    isClientSideMediaProcessingEnabled,
    isUploading,
    lockPostSaving,
    unlockPostSaving,
    lockPostAutosaving,
    unlockPostAutosaving
  ]);
}
export {
  useUploadSaveLock as default
};
//# sourceMappingURL=use-upload-save-lock.mjs.map
