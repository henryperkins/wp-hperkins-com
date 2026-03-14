// packages/block-editor/src/components/list-view/aria-referenced-text.js
import { useRef, useEffect } from "@wordpress/element";
import { jsx } from "react/jsx-runtime";
function AriaReferencedText({ children, ...props }) {
  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = ref.current.textContent;
    }
  }, [children]);
  return /* @__PURE__ */ jsx("div", { hidden: true, ...props, ref, children });
}
export {
  AriaReferencedText as default
};
//# sourceMappingURL=aria-referenced-text.mjs.map
