"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-editor/src/components/block-canvas/index.js
var block_canvas_exports = {};
__export(block_canvas_exports, {
  BlockCanvasCover: () => BlockCanvasCover,
  ExperimentalBlockCanvas: () => ExperimentalBlockCanvas,
  default: () => block_canvas_default
});
module.exports = __toCommonJS(block_canvas_exports);
var import_compose = require("@wordpress/compose");
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_block_list = __toESM(require("../block-list/index.cjs"));
var import_block_tools = __toESM(require("../block-tools/index.cjs"));
var import_editor_styles = __toESM(require("../editor-styles/index.cjs"));
var import_iframe = __toESM(require("../iframe/index.cjs"));
var import_writing_flow = __toESM(require("../writing-flow/index.cjs"));
var import_observe_typing = require("../observe-typing/index.cjs");
var import_block_selection_clearer = require("../block-selection-clearer/index.cjs");
var import_use_block_commands = require("../use-block-commands/index.cjs");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var BlockCanvasCover = (0, import_components.createSlotFill)(/* @__PURE__ */ Symbol("BlockCanvasCover"));
function BlockCanvasCoverWrapper({ children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
  children = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_list.default, {}),
  styles,
  contentRef: contentRefProp,
  iframeProps
}) {
  (0, import_use_block_commands.useBlockCommands)();
  const isTabletViewport = (0, import_compose.useViewportMatch)("medium", "<");
  const resetTypingRef = (0, import_observe_typing.useMouseMoveTypingReset)();
  const clearerRef = (0, import_block_selection_clearer.useBlockSelectionClearer)();
  const localRef = (0, import_element.useRef)();
  const contentRef = (0, import_compose.useMergeRefs)([contentRefProp, clearerRef, localRef]);
  const zoomLevel = (0, import_data.useSelect)(
    (select) => (0, import_lock_unlock.unlock)(select(import_store.store)).getZoomLevel(),
    []
  );
  const zoomOutIframeProps = zoomLevel !== 100 && !isTabletViewport ? {
    scale: zoomLevel,
    frameSize: "40px"
  } : {};
  if (!shouldIframe) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      import_block_tools.default,
      {
        __unstableContentRef: localRef,
        style: { height, display: "flex" },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockCanvasCover.Slot, { fillProps: { containerRef: localRef }, children: (covers) => covers.map((cover, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockCanvasCoverWrapper, { children: cover }, index)) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_editor_styles.default,
            {
              styles,
              scope: ":where(.editor-styles-wrapper)",
              transformOptions: EDITOR_STYLE_TRANSFORM_OPTIONS
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_writing_flow.default,
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_block_tools.default,
    {
      __unstableContentRef: localRef,
      style: { height, display: "flex" },
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        import_iframe.default,
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
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockCanvasCover.Slot, { fillProps: { containerRef: localRef }, children: (covers) => covers.map((cover, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockCanvasCoverWrapper, { children: cover }, index)) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor_styles.default, { styles }),
            children
          ]
        }
      )
    }
  );
}
function BlockCanvas({ children, height, styles }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExperimentalBlockCanvas, { height, styles, children });
}
var block_canvas_default = BlockCanvas;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BlockCanvasCover,
  ExperimentalBlockCanvas
});
//# sourceMappingURL=index.cjs.map
