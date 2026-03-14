// packages/block-editor/src/components/list-view/block-contents.js
import { forwardRef } from "@wordpress/element";
import ListViewBlockSelectButton from "./block-select-button.mjs";
import BlockDraggable from "../block-draggable/index.mjs";
import { useListViewContext } from "./context.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var ListViewBlockContents = forwardRef(
  ({
    onClick,
    onToggleExpanded,
    block,
    isSelected,
    position,
    siblingBlockCount,
    level,
    isExpanded,
    selectedClientIds,
    ...props
  }, ref) => {
    const { clientId } = block;
    const { AdditionalBlockContent, insertedBlock, setInsertedBlock } = useListViewContext();
    const draggableClientIds = selectedClientIds.includes(clientId) ? selectedClientIds : [clientId];
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      AdditionalBlockContent && /* @__PURE__ */ jsx(
        AdditionalBlockContent,
        {
          block,
          insertedBlock,
          setInsertedBlock
        }
      ),
      /* @__PURE__ */ jsx(
        BlockDraggable,
        {
          appendToOwnerDocument: true,
          clientIds: draggableClientIds,
          cloneClassname: "block-editor-list-view-draggable-chip",
          children: ({ draggable, onDragStart, onDragEnd }) => /* @__PURE__ */ jsx(
            ListViewBlockSelectButton,
            {
              ref,
              className: "block-editor-list-view-block-contents",
              block,
              onClick,
              onToggleExpanded,
              isSelected,
              position,
              siblingBlockCount,
              level,
              draggable,
              onDragStart,
              onDragEnd,
              isExpanded,
              ...props
            }
          )
        }
      )
    ] });
  }
);
var block_contents_default = ListViewBlockContents;
export {
  block_contents_default as default
};
//# sourceMappingURL=block-contents.mjs.map
