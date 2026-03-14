// packages/editor/src/components/visual-editor/use-padding-appender.js
import { useRegistry } from "@wordpress/data";
import { useRefEffect } from "@wordpress/compose";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { isUnmodifiedDefaultBlock } from "@wordpress/blocks";
var CSS = ':root :where(.editor-styles-wrapper)::after {content: ""; display: block; height: 40vh;}';
function usePaddingAppender(enabled) {
  const registry = useRegistry();
  const effect = useRefEffect(
    (node) => {
      function onMouseDown(event) {
        if (event.target !== node && // Tests for the parent element because in the iframed editor if the click is
        // below the padding the target will be the parent element (html) and should
        // still be treated as intent to append.
        event.target !== node.parentElement) {
          return;
        }
        const lastChild = node.lastElementChild;
        if (!lastChild) {
          return;
        }
        const lastChildRect = lastChild.getBoundingClientRect();
        if (event.clientY < lastChildRect.bottom) {
          return;
        }
        event.preventDefault();
        const blockOrder = registry.select(blockEditorStore).getBlockOrder("");
        const lastBlockClientId = blockOrder[blockOrder.length - 1];
        const lastBlock = registry.select(blockEditorStore).getBlock(lastBlockClientId);
        const { selectBlock, insertDefaultBlock } = registry.dispatch(blockEditorStore);
        if (lastBlock && isUnmodifiedDefaultBlock(lastBlock)) {
          selectBlock(lastBlockClientId);
        } else {
          insertDefaultBlock();
        }
      }
      const { ownerDocument } = node;
      ownerDocument.addEventListener("pointerdown", onMouseDown);
      return () => {
        ownerDocument.removeEventListener("pointerdown", onMouseDown);
      };
    },
    [registry]
  );
  return enabled ? [effect, CSS] : [];
}
export {
  usePaddingAppender
};
//# sourceMappingURL=use-padding-appender.mjs.map
