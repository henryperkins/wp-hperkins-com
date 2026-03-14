// packages/block-editor/src/components/writing-flow/use-preview-mode-nav.js
import { useRefEffect } from "@wordpress/compose";
import { useSelect } from "@wordpress/data";
import { TAB, UP, DOWN, LEFT, RIGHT } from "@wordpress/keycodes";
import { store as blockEditorStore } from "../../store/index.mjs";
function usePreviewModeNav() {
  const isPreviewMode = useSelect(
    (select) => select(blockEditorStore).getSettings().isPreviewMode,
    []
  );
  return useRefEffect(
    (node) => {
      if (!isPreviewMode) {
        return;
      }
      function onKeyDown(event) {
        const { keyCode, shiftKey, target } = event;
        const isTab = keyCode === TAB;
        const isUp = keyCode === UP;
        const isDown = keyCode === DOWN;
        const isLeft = keyCode === LEFT;
        const isRight = keyCode === RIGHT;
        const isArrow = isUp || isDown || isLeft || isRight;
        if (!isTab && !isArrow) {
          return;
        }
        const isReverse = isTab ? shiftKey : isUp || isLeft;
        const blocks = Array.from(
          node.querySelectorAll("[data-block]")
        );
        if (!blocks.length) {
          return;
        }
        const currentBlock = target.closest("[data-block]");
        const currentIndex = currentBlock ? blocks.indexOf(currentBlock) : -1;
        if (currentIndex === -1) {
          return;
        }
        if (isTab) {
          if (isReverse && currentIndex === 0) {
            return;
          }
          if (!isReverse && currentIndex === blocks.length - 1) {
            return;
          }
        }
        let nextIndex;
        if (isReverse) {
          nextIndex = currentIndex <= 0 ? blocks.length - 1 : currentIndex - 1;
        } else {
          nextIndex = currentIndex === -1 || currentIndex >= blocks.length - 1 ? 0 : currentIndex + 1;
        }
        event.preventDefault();
        blocks[nextIndex].focus();
      }
      node.addEventListener("keydown", onKeyDown);
      return () => {
        node.removeEventListener("keydown", onKeyDown);
      };
    },
    [isPreviewMode]
  );
}
export {
  usePreviewModeNav
};
//# sourceMappingURL=use-preview-mode-nav.mjs.map
