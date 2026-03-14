// packages/block-library/src/terms-query/edit/index.js
import { useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import TermsQueryContent from "./terms-query-content.mjs";
import TermsQueryPlaceholder from "./terms-query-placeholder.mjs";
import { jsx } from "react/jsx-runtime";
var TermsQueryEdit = (props) => {
  const hasInnerBlocks = useSelect(
    (select) => !!select(blockEditorStore).getBlocks(props.clientId).length,
    [props.clientId]
  );
  const Component = hasInnerBlocks ? TermsQueryContent : TermsQueryPlaceholder;
  return /* @__PURE__ */ jsx(Component, { ...props });
};
var edit_default = TermsQueryEdit;
export {
  edit_default as default
};
//# sourceMappingURL=index.mjs.map
