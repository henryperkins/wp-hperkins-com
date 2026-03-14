// packages/edit-site/src/components/editor/use-adapt-editor-to-canvas.js
import { useDispatch, useSelect, useRegistry } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { store as editorStore } from "@wordpress/editor";
import { useLayoutEffect } from "@wordpress/element";
import { store as preferencesStore } from "@wordpress/preferences";
import { DEFAULT_DEVICE_TYPE } from "../block-editor/use-viewport-sync.mjs";
function useAdaptEditorToCanvas(canvas) {
  const { clearSelectedBlock } = useDispatch(blockEditorStore);
  const {
    editPost,
    setDeviceType,
    closePublishSidebar,
    setIsListViewOpened,
    setIsInserterOpened
  } = useDispatch(editorStore);
  const { get: getPreference } = useSelect(preferencesStore);
  const { getCurrentPost } = useSelect(editorStore);
  const registry = useRegistry();
  useLayoutEffect(() => {
    const isMediumOrBigger = window.matchMedia("(min-width: 782px)").matches;
    registry.batch(() => {
      clearSelectedBlock();
      if (getCurrentPost()?.type) {
        editPost({ selection: void 0 }, { undoIgnore: true });
      }
      setDeviceType(DEFAULT_DEVICE_TYPE);
      closePublishSidebar();
      setIsInserterOpened(false);
      if (isMediumOrBigger && canvas === "edit" && getPreference("core", "showListViewByDefault") && !getPreference("core", "distractionFree")) {
        setIsListViewOpened(true);
      } else {
        setIsListViewOpened(false);
      }
    });
  }, [
    canvas,
    registry,
    clearSelectedBlock,
    editPost,
    setDeviceType,
    closePublishSidebar,
    setIsInserterOpened,
    setIsListViewOpened,
    getPreference,
    getCurrentPost
  ]);
}
export {
  useAdaptEditorToCanvas
};
//# sourceMappingURL=use-adapt-editor-to-canvas.mjs.map
