// packages/block-editor/src/components/block-canvas/index.js
import { useMergeRefs, useViewportMatch } from "@wordpress/compose";
import { useRef } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { createSlotFill } from "@wordpress/components";
import BlockList from "../block-list/index.mjs";
import BlockTools from "../block-tools/index.mjs";
import EditorStyles from "../editor-styles/index.mjs";
import Iframe from "../iframe/index.mjs";
import WritingFlow from "../writing-flow/index.mjs";
import { useMouseMoveTypingReset } from "../observe-typing/index.mjs";
import { useBlockSelectionClearer } from "../block-selection-clearer/index.mjs";
import { useBlockCommands } from "../use-block-commands/index.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var BlockCanvasCover = createSlotFill(/* @__PURE__ */ Symbol("BlockCanvasCover"));
function BlockCanvasCoverWrapper({ children }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "block-canvas-cover",
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none"
      },
      children
    }
  );
}
var EDITOR_STYLE_TRANSFORM_OPTIONS = {
  // Don't transform selectors that already specify `.editor-styles-wrapper`.
  ignoredSelectors: [/\.editor-styles-wrapper/gi]
};
function ExperimentalBlockCanvas({
  shouldIframe = true,
  height = "300px",
  children = /* @__PURE__ */ jsx(BlockList, {}),
  styles,
  contentRef: contentRefProp,
  iframeProps
}) {
  useBlockCommands();
  const isTabletViewport = useViewportMatch("medium", "<");
  const resetTypingRef = useMouseMoveTypingReset();
  const clearerRef = useBlockSelectionClearer();
  const localRef = useRef();
  const contentRef = useMergeRefs([contentRefProp, clearerRef, localRef]);
  const zoomLevel = useSelect(
    (select) => unlock(select(blockEditorStore)).getZoomLevel(),
    []
  );
  const zoomOutIframeProps = zoomLevel !== 100 && !isTabletViewport ? {
    scale: zoomLevel,
    frameSize: "40px"
  } : {};
  if (!shouldIframe) {
    return /* @__PURE__ */ jsxs(
      BlockTools,
      {
        __unstableContentRef: localRef,
        style: { height, display: "flex" },
        children: [
          /* @__PURE__ */ jsx(BlockCanvasCover.Slot, { fillProps: { containerRef: localRef }, children: (covers) => covers.map((cover, index) => /* @__PURE__ */ jsx(BlockCanvasCoverWrapper, { children: cover }, index)) }),
          /* @__PURE__ */ jsx(
            EditorStyles,
            {
              styles,
              scope: ":where(.editor-styles-wrapper)",
              transformOptions: EDITOR_STYLE_TRANSFORM_OPTIONS
            }
          ),
          /* @__PURE__ */ jsx(
            WritingFlow,
            {
              ref: contentRef,
              className: "editor-styles-wrapper",
              tabIndex: -1,
              style: {
                height: "100%",
                width: "100%",
                overflow: "auto"
              },
              children
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsx(
    BlockTools,
    {
      __unstableContentRef: localRef,
      style: { height, display: "flex" },
      children: /* @__PURE__ */ jsxs(
        Iframe,
        {
          ...iframeProps,
          ...zoomOutIframeProps,
          ref: resetTypingRef,
          contentRef,
          style: {
            ...iframeProps?.style
          },
          name: "editor-canvas",
          children: [
            /* @__PURE__ */ jsx(BlockCanvasCover.Slot, { fillProps: { containerRef: localRef }, children: (covers) => covers.map((cover, index) => /* @__PURE__ */ jsx(BlockCanvasCoverWrapper, { children: cover }, index)) }),
            /* @__PURE__ */ jsx(EditorStyles, { styles }),
            children
          ]
        }
      )
    }
  );
}
function BlockCanvas({ children, height, styles }) {
  return /* @__PURE__ */ jsx(ExperimentalBlockCanvas, { height, styles, children });
}
var block_canvas_default = BlockCanvas;
export {
  BlockCanvasCover,
  ExperimentalBlockCanvas,
  block_canvas_default as default
};
//# sourceMappingURL=index.mjs.map
