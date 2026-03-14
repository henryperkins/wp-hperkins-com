// packages/customize-widgets/src/components/focus-control/use-blocks-focus-control.js
import { useRef, useEffect } from "@wordpress/element";
import { useDispatch } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { getWidgetIdFromBlock } from "@wordpress/widgets";
import { useFocusControl } from "./index.mjs";
function useBlocksFocusControl(blocks) {
  const { selectBlock } = useDispatch(blockEditorStore);
  const [focusedWidgetIdRef] = useFocusControl();
  const blocksRef = useRef(blocks);
  useEffect(() => {
    blocksRef.current = blocks;
  }, [blocks]);
  useEffect(() => {
    if (focusedWidgetIdRef.current) {
      const focusedBlock = blocksRef.current.find(
        (block) => getWidgetIdFromBlock(block) === focusedWidgetIdRef.current
      );
      if (focusedBlock) {
        selectBlock(focusedBlock.clientId);
        const blockNode = document.querySelector(
          `[data-block="${focusedBlock.clientId}"]`
        );
        blockNode?.focus();
      }
    }
  }, [focusedWidgetIdRef, selectBlock]);
}
export {
  useBlocksFocusControl as default
};
//# sourceMappingURL=use-blocks-focus-control.mjs.map
