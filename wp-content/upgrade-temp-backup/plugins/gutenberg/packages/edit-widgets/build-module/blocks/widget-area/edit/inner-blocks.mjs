// packages/edit-widgets/src/blocks/widget-area/edit/inner-blocks.js
import clsx from "clsx";
import { useEntityBlockEditor } from "@wordpress/core-data";
import { InnerBlocks, useInnerBlocksProps } from "@wordpress/block-editor";
import { useRef } from "@wordpress/element";
import useIsDraggingWithin from "./use-is-dragging-within.mjs";
import { jsx } from "react/jsx-runtime";
function WidgetAreaInnerBlocks({ id }) {
  const [blocks, onInput, onChange] = useEntityBlockEditor(
    "root",
    "postType"
  );
  const innerBlocksRef = useRef();
  const isDraggingWithinInnerBlocks = useIsDraggingWithin(innerBlocksRef);
  const shouldHighlightDropZone = isDraggingWithinInnerBlocks;
  const innerBlocksProps = useInnerBlocksProps(
    { ref: innerBlocksRef },
    {
      value: blocks,
      onInput,
      onChange,
      templateLock: false,
      renderAppender: InnerBlocks.ButtonBlockAppender
    }
  );
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-widget-area-id": id,
      className: clsx(
        "wp-block-widget-area__inner-blocks block-editor-inner-blocks editor-styles-wrapper",
        {
          "wp-block-widget-area__highlight-drop-zone": shouldHighlightDropZone
        }
      ),
      children: /* @__PURE__ */ jsx("div", { ...innerBlocksProps })
    }
  );
}
export {
  WidgetAreaInnerBlocks as default
};
//# sourceMappingURL=inner-blocks.mjs.map
