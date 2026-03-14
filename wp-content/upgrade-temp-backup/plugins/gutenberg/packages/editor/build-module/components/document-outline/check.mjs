// packages/editor/src/components/document-outline/check.js
import { useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
function DocumentOutlineCheck({ children }) {
  const hasHeadings = useSelect((select) => {
    const { getGlobalBlockCount } = select(blockEditorStore);
    return getGlobalBlockCount("core/heading") > 0;
  });
  if (!hasHeadings) {
    return null;
  }
  return children;
}
export {
  DocumentOutlineCheck as default
};
//# sourceMappingURL=check.mjs.map
