// packages/block-editor/src/components/rich-text/use-mark-persistent.js
import { useLayoutEffect, useRef } from "@wordpress/element";
import { useDispatch } from "@wordpress/data";
import { store as blockEditorStore } from "../../store/index.mjs";
function useMarkPersistent({ html, value }) {
  const previousTextRef = useRef();
  const hasActiveFormats = !!value.activeFormats?.length;
  const { __unstableMarkLastChangeAsPersistent } = useDispatch(blockEditorStore);
  useLayoutEffect(() => {
    if (!previousTextRef.current) {
      previousTextRef.current = value.text;
      return;
    }
    if (previousTextRef.current !== value.text) {
      const timeout = window.setTimeout(() => {
        __unstableMarkLastChangeAsPersistent();
      }, 1e3);
      previousTextRef.current = value.text;
      return () => {
        window.clearTimeout(timeout);
      };
    }
    __unstableMarkLastChangeAsPersistent();
  }, [html, hasActiveFormats]);
}
export {
  useMarkPersistent
};
//# sourceMappingURL=use-mark-persistent.mjs.map
