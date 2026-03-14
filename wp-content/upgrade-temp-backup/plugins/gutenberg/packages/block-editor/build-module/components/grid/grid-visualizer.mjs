// packages/block-editor/src/components/grid/grid-visualizer.js
import clsx from "clsx";
import { useState, useEffect, forwardRef, useMemo } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { __experimentalUseDropZone as useDropZone } from "@wordpress/compose";
import { useBlockElement } from "../block-list/use-block-props/use-block-refs.mjs";
import BlockPopoverCover from "../block-popover/cover.mjs";
import { range, GridRect, getGridInfo, getGridItemRect } from "./utils.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import { useGetNumberOfBlocksBeforeCell } from "./use-get-number-of-blocks-before-cell.mjs";
import ButtonBlockAppender from "../button-block-appender/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
function GridVisualizer({
  clientId,
  contentRef,
  parentLayout,
  childGridClientId
}) {
  const isDistractionFree = useSelect(
    (select) => select(blockEditorStore).getSettings().isDistractionFree,
    []
  );
  const gridElement = useBlockElement(clientId);
  if (isDistractionFree || !gridElement) {
    return null;
  }
  const isManualGrid = parentLayout?.isManualPlacement && window.__experimentalEnableGridInteractivity;
  return /* @__PURE__ */ jsx(
    GridVisualizerGrid,
    {
      gridClientId: clientId,
      gridElement,
      isManualGrid,
      ref: contentRef,
      childGridClientId
    }
  );
}
var GridVisualizerGrid = forwardRef(
  ({ gridClientId, gridElement, isManualGrid, childGridClientId }, ref) => {
    const [gridInfo, setGridInfo] = useState(
      () => getGridInfo(gridElement)
    );
    const [isDroppingAllowed, setIsDroppingAllowed] = useState(false);
    const childGridElement = useBlockElement(childGridClientId);
    const childGridRect = useMemo(() => {
      if (!childGridElement) {
        return null;
      }
      return getGridItemRect(childGridElement);
    }, [childGridElement]);
    useEffect(() => {
      const resizeCallback = () => setGridInfo(getGridInfo(gridElement));
      const borderBoxSpy = new window.ResizeObserver(resizeCallback);
      borderBoxSpy.observe(gridElement, { box: "border-box" });
      const contentBoxSpy = new window.ResizeObserver(resizeCallback);
      contentBoxSpy.observe(gridElement);
      for (const element of gridElement.children) {
        contentBoxSpy.observe(element);
      }
      return () => {
        borderBoxSpy.disconnect();
        contentBoxSpy.disconnect();
      };
    }, [gridElement]);
    useEffect(() => {
      function onGlobalDrag() {
        setIsDroppingAllowed(true);
      }
      function onGlobalDragEnd() {
        setIsDroppingAllowed(false);
      }
      document.addEventListener("drag", onGlobalDrag);
      document.addEventListener("dragend", onGlobalDragEnd);
      return () => {
        document.removeEventListener("drag", onGlobalDrag);
        document.removeEventListener("dragend", onGlobalDragEnd);
      };
    }, []);
    return /* @__PURE__ */ jsx(
      BlockPopoverCover,
      {
        className: clsx("block-editor-grid-visualizer", {
          "is-dropping-allowed": isDroppingAllowed
        }),
        clientId: gridClientId,
        __unstablePopoverSlot: "__unstable-block-tools-after",
        children: /* @__PURE__ */ jsx(
          "div",
          {
            ref,
            className: "block-editor-grid-visualizer__grid",
            style: gridInfo.style,
            children: isManualGrid ? /* @__PURE__ */ jsx(
              ManualGridVisualizer,
              {
                gridClientId,
                gridInfo,
                childGridRect
              }
            ) : /* @__PURE__ */ jsx(
              AutoGridVisualizer,
              {
                gridInfo,
                childGridRect
              }
            )
          }
        )
      }
    );
  }
);
function AutoGridVisualizer({ gridInfo, childGridRect }) {
  return range(1, gridInfo.numRows).map(
    (row) => range(1, gridInfo.numColumns).map((column) => {
      let color = gridInfo.currentColor;
      if (childGridRect?.contains(column, row)) {
        color = "transparent";
      }
      return /* @__PURE__ */ jsx(
        GridVisualizerCell,
        {
          color
        },
        `${row}-${column}`
      );
    })
  );
}
function ManualGridVisualizer({ gridClientId, gridInfo, childGridRect }) {
  const [highlightedRect, setHighlightedRect] = useState(null);
  const gridItemStyles = useSelect(
    (select) => {
      const { getBlockOrder, getBlockStyles } = unlock(
        select(blockEditorStore)
      );
      const blockOrder = getBlockOrder(gridClientId);
      return getBlockStyles(blockOrder);
    },
    [gridClientId]
  );
  const occupiedRects = useMemo(() => {
    const rects = [];
    for (const style of Object.values(gridItemStyles)) {
      const {
        columnStart,
        rowStart,
        columnSpan = 1,
        rowSpan = 1
      } = style?.layout ?? {};
      if (!columnStart || !rowStart) {
        continue;
      }
      rects.push(
        new GridRect({
          columnStart,
          rowStart,
          columnSpan,
          rowSpan
        })
      );
    }
    return rects;
  }, [gridItemStyles]);
  return range(1, gridInfo.numRows).map(
    (row) => range(1, gridInfo.numColumns).map((column) => {
      const isChildGridCell = childGridRect?.contains(column, row);
      let color = gridInfo.currentColor;
      if (isChildGridCell) {
        color = "transparent";
      }
      const isCellOccupied = occupiedRects.some(
        (rect) => rect.contains(column, row)
      );
      const isHighlighted = highlightedRect?.contains(column, row) ?? false;
      return /* @__PURE__ */ jsx(
        GridVisualizerCell,
        {
          color,
          className: isHighlighted && "is-highlighted",
          children: isCellOccupied && !isChildGridCell ? /* @__PURE__ */ jsx(
            GridVisualizerDropZone,
            {
              column,
              row,
              gridClientId,
              gridInfo,
              setHighlightedRect
            }
          ) : /* @__PURE__ */ jsx(
            GridVisualizerAppender,
            {
              column,
              row,
              gridClientId,
              gridInfo,
              setHighlightedRect
            }
          )
        },
        `${row}-${column}`
      );
    })
  );
}
function GridVisualizerCell({ color, children, className }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: clsx(
        "block-editor-grid-visualizer__cell",
        className
      ),
      style: {
        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${color} 20%, #0000)`,
        color
      },
      children
    }
  );
}
function useGridVisualizerDropZone(column, row, gridClientId, gridInfo, setHighlightedRect) {
  const {
    getBlockAttributes,
    getBlockRootClientId,
    canInsertBlockType,
    getBlockName
  } = useSelect(blockEditorStore);
  const {
    updateBlockAttributes,
    moveBlocksToPosition,
    __unstableMarkNextChangeAsNotPersistent
  } = useDispatch(blockEditorStore);
  const getNumberOfBlocksBeforeCell = useGetNumberOfBlocksBeforeCell(
    gridClientId,
    gridInfo.numColumns
  );
  return useDropZoneWithValidation({
    validateDrag(srcClientId) {
      const blockName = getBlockName(srcClientId);
      if (!canInsertBlockType(blockName, gridClientId)) {
        return false;
      }
      const attributes = getBlockAttributes(srcClientId);
      const rect = new GridRect({
        columnStart: column,
        rowStart: row,
        columnSpan: attributes.style?.layout?.columnSpan,
        rowSpan: attributes.style?.layout?.rowSpan
      });
      const isInBounds = new GridRect({
        columnSpan: gridInfo.numColumns,
        rowSpan: gridInfo.numRows
      }).containsRect(rect);
      return isInBounds;
    },
    onDragEnter(srcClientId) {
      const attributes = getBlockAttributes(srcClientId);
      setHighlightedRect(
        new GridRect({
          columnStart: column,
          rowStart: row,
          columnSpan: attributes.style?.layout?.columnSpan,
          rowSpan: attributes.style?.layout?.rowSpan
        })
      );
    },
    onDragLeave() {
      setHighlightedRect(
        (prevHighlightedRect) => prevHighlightedRect?.columnStart === column && prevHighlightedRect?.rowStart === row ? null : prevHighlightedRect
      );
    },
    onDrop(srcClientId) {
      setHighlightedRect(null);
      const attributes = getBlockAttributes(srcClientId);
      updateBlockAttributes(srcClientId, {
        style: {
          ...attributes.style,
          layout: {
            ...attributes.style?.layout,
            columnStart: column,
            rowStart: row
          }
        }
      });
      __unstableMarkNextChangeAsNotPersistent();
      moveBlocksToPosition(
        [srcClientId],
        getBlockRootClientId(srcClientId),
        gridClientId,
        getNumberOfBlocksBeforeCell(column, row)
      );
    }
  });
}
function GridVisualizerDropZone({
  column,
  row,
  gridClientId,
  gridInfo,
  setHighlightedRect
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "block-editor-grid-visualizer__drop-zone",
      ref: useGridVisualizerDropZone(
        column,
        row,
        gridClientId,
        gridInfo,
        setHighlightedRect
      )
    }
  );
}
function GridVisualizerAppender({
  column,
  row,
  gridClientId,
  gridInfo,
  setHighlightedRect
}) {
  const {
    updateBlockAttributes,
    moveBlocksToPosition,
    __unstableMarkNextChangeAsNotPersistent
  } = useDispatch(blockEditorStore);
  const getNumberOfBlocksBeforeCell = useGetNumberOfBlocksBeforeCell(
    gridClientId,
    gridInfo.numColumns
  );
  return /* @__PURE__ */ jsx(
    ButtonBlockAppender,
    {
      rootClientId: gridClientId,
      className: "block-editor-grid-visualizer__appender",
      ref: useGridVisualizerDropZone(
        column,
        row,
        gridClientId,
        gridInfo,
        setHighlightedRect
      ),
      style: {
        color: gridInfo.currentColor
      },
      onSelect: (block) => {
        if (!block) {
          return;
        }
        updateBlockAttributes(block.clientId, {
          style: {
            layout: {
              columnStart: column,
              rowStart: row
            }
          }
        });
        __unstableMarkNextChangeAsNotPersistent();
        moveBlocksToPosition(
          [block.clientId],
          gridClientId,
          gridClientId,
          getNumberOfBlocksBeforeCell(column, row)
        );
      }
    }
  );
}
function useDropZoneWithValidation({
  validateDrag,
  onDragEnter,
  onDragLeave,
  onDrop
}) {
  const { getDraggedBlockClientIds } = useSelect(blockEditorStore);
  return useDropZone({
    onDragEnter() {
      const [srcClientId] = getDraggedBlockClientIds();
      if (srcClientId && validateDrag(srcClientId)) {
        onDragEnter(srcClientId);
      }
    },
    onDragLeave() {
      onDragLeave();
    },
    onDrop() {
      const [srcClientId] = getDraggedBlockClientIds();
      if (srcClientId && validateDrag(srcClientId)) {
        onDrop(srcClientId);
      }
    }
  });
}
export {
  GridVisualizer
};
//# sourceMappingURL=grid-visualizer.mjs.map
