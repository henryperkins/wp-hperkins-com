// packages/editor/src/components/visual-editor/use-zoom-out-mode-exit.js
import { useSelect, useDispatch } from "@wordpress/data";
import { useRefEffect } from "@wordpress/compose";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { unlock } from "../../lock-unlock.mjs";
function useZoomOutModeExit() {
  const { getSettings, isZoomOut } = unlock(useSelect(blockEditorStore));
  const { resetZoomLevel } = unlock(useDispatch(blockEditorStore));
  return useRefEffect(
    (node) => {
      function onDoubleClick(event) {
        if (!isZoomOut()) {
          return;
        }
        if (!event.defaultPrevented) {
          event.preventDefault();
          const { __experimentalSetIsInserterOpened } = getSettings();
          if (typeof __experimentalSetIsInserterOpened === "function") {
            __experimentalSetIsInserterOpened(false);
          }
          resetZoomLevel();
        }
      }
      node.addEventListener("dblclick", onDoubleClick);
      return () => {
        node.removeEventListener("dblclick", onDoubleClick);
      };
    },
    [getSettings, isZoomOut, resetZoomLevel]
  );
}
export {
  useZoomOutModeExit
};
//# sourceMappingURL=use-zoom-out-mode-exit.mjs.map
