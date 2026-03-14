// packages/editor/src/components/post-title/use-post-title-focus.js
import { useEffect, useImperativeHandle, useRef } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { store as editorStore } from "../../store/index.mjs";
function usePostTitleFocus(forwardedRef) {
  const ref = useRef();
  const { isCleanNewPost } = useSelect((select) => {
    const { isCleanNewPost: _isCleanNewPost } = select(editorStore);
    return {
      isCleanNewPost: _isCleanNewPost()
    };
  }, []);
  useImperativeHandle(forwardedRef, () => ({
    focus: () => {
      ref?.current?.focus();
    }
  }));
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const { defaultView } = ref.current.ownerDocument;
    const { name, parent } = defaultView;
    const ownerDocument = name === "editor-canvas" ? parent.document : defaultView.document;
    const { activeElement, body } = ownerDocument;
    if (isCleanNewPost && (!activeElement || body === activeElement)) {
      ref.current.focus();
    }
  }, [isCleanNewPost]);
  return { ref };
}
export {
  usePostTitleFocus as default
};
//# sourceMappingURL=use-post-title-focus.mjs.map
