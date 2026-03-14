// packages/edit-post/src/components/meta-boxes/use-meta-box-initialization.js
import { useDispatch, useSelect } from "@wordpress/data";
import { store as editorStore } from "@wordpress/editor";
import { store as coreStore } from "@wordpress/core-data";
import { useEffect } from "@wordpress/element";
import { store as editPostStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
var useMetaBoxInitialization = (enabled) => {
  const { isEnabledAndEditorReady, isCollaborationEnabled } = useSelect(
    (select) => ({
      isEnabledAndEditorReady: enabled && select(editorStore).__unstableIsEditorReady(),
      isCollaborationEnabled: select(editorStore).isCollaborationEnabledForCurrentPost()
    }),
    [enabled]
  );
  const { setCollaborationSupported } = unlock(useDispatch(coreStore));
  const { initializeMetaBoxes } = useDispatch(editPostStore);
  useEffect(() => {
    if (isEnabledAndEditorReady) {
      initializeMetaBoxes();
      if (isCollaborationEnabled) {
        setCollaborationSupported(false);
      }
    }
  }, [
    isEnabledAndEditorReady,
    initializeMetaBoxes,
    isCollaborationEnabled,
    setCollaborationSupported
  ]);
};
export {
  useMetaBoxInitialization
};
//# sourceMappingURL=use-meta-box-initialization.mjs.map
