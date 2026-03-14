// packages/block-library/src/query/edit/index.js
import { useSelect } from "@wordpress/data";
import { useState } from "@wordpress/element";
import { store as blockEditorStore } from "@wordpress/block-editor";
import QueryContent from "./query-content.mjs";
import QueryPlaceholder from "./query-placeholder.mjs";
import { PatternSelectionModal } from "./pattern-selection.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var QueryEdit = (props) => {
  const { clientId, attributes } = props;
  const [isPatternSelectionModalOpen, setIsPatternSelectionModalOpen] = useState(false);
  const hasInnerBlocks = useSelect(
    (select) => !!select(blockEditorStore).getBlocks(clientId).length,
    [clientId]
  );
  const Component = hasInnerBlocks ? QueryContent : QueryPlaceholder;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Component,
      {
        ...props,
        openPatternSelectionModal: () => setIsPatternSelectionModalOpen(true)
      }
    ),
    isPatternSelectionModalOpen && /* @__PURE__ */ jsx(
      PatternSelectionModal,
      {
        clientId,
        attributes,
        setIsPatternSelectionModalOpen
      }
    )
  ] });
};
var edit_default = QueryEdit;
export {
  edit_default as default
};
//# sourceMappingURL=index.mjs.map
