// packages/block-editor/src/components/block-list/use-block-props/use-focus-first-element.js
import { useEffect, useRef } from "@wordpress/element";
import {
  focus,
  isFormElement,
  isTextField,
  placeCaretAtHorizontalEdge
} from "@wordpress/dom";
import { useSelect } from "@wordpress/data";
import { isInsideRootBlock } from "../../../utils/dom.mjs";
import { store as blockEditorStore } from "../../../store/index.mjs";
import { unlock } from "../../../lock-unlock.mjs";
function useFocusFirstElement({ clientId, initialPosition }) {
  const ref = useRef();
  const { isBlockSelected, isMultiSelecting, isZoomOut } = unlock(
    useSelect(blockEditorStore)
  );
  useEffect(() => {
    if (!isBlockSelected(clientId) || isMultiSelecting() || isZoomOut()) {
      return;
    }
    if (initialPosition === void 0 || initialPosition === null) {
      return;
    }
    if (!ref.current) {
      return;
    }
    const { ownerDocument } = ref.current;
    if (isInsideRootBlock(ref.current, ownerDocument.activeElement)) {
      return;
    }
    const textInputs = focus.tabbable.find(ref.current).filter((node) => isTextField(node));
    const isReverse = -1 === initialPosition;
    const target = textInputs[isReverse ? textInputs.length - 1 : 0] || ref.current;
    if (!isInsideRootBlock(ref.current, target)) {
      ref.current.focus();
      return;
    }
    if (!ref.current.getAttribute("contenteditable")) {
      const focusElement = focus.tabbable.findNext(ref.current);
      if (focusElement && isInsideRootBlock(ref.current, focusElement) && isFormElement(focusElement)) {
        focusElement.focus();
        return;
      }
    }
    placeCaretAtHorizontalEdge(target, isReverse);
  }, [initialPosition, clientId]);
  return ref;
}
export {
  useFocusFirstElement
};
//# sourceMappingURL=use-focus-first-element.mjs.map
