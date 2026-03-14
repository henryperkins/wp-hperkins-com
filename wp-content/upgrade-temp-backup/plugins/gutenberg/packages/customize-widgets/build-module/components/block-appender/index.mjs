// packages/customize-widgets/src/components/block-appender/index.js
import { useRef, useEffect } from "@wordpress/element";
import {
  ButtonBlockAppender,
  store as blockEditorStore
} from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { jsx } from "react/jsx-runtime";
function BlockAppender(props) {
  const ref = useRef();
  const isBlocksListEmpty = useSelect(
    (select) => select(blockEditorStore).getBlockCount() === 0
  );
  useEffect(() => {
    if (isBlocksListEmpty && ref.current) {
      const { ownerDocument } = ref.current;
      if (!ownerDocument.activeElement || ownerDocument.activeElement === ownerDocument.body) {
        ref.current.focus();
      }
    }
  }, [isBlocksListEmpty]);
  return /* @__PURE__ */ jsx(ButtonBlockAppender, { ...props, ref });
}
export {
  BlockAppender as default
};
//# sourceMappingURL=index.mjs.map
