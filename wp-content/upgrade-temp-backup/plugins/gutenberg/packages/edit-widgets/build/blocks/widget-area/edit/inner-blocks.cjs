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

// packages/edit-widgets/src/blocks/widget-area/edit/inner-blocks.js
var inner_blocks_exports = {};
__export(inner_blocks_exports, {
  default: () => WidgetAreaInnerBlocks
});
module.exports = __toCommonJS(inner_blocks_exports);
var import_clsx = __toESM(require("clsx"));
var import_core_data = require("@wordpress/core-data");
var import_block_editor = require("@wordpress/block-editor");
var import_element = require("@wordpress/element");
var import_use_is_dragging_within = __toESM(require("./use-is-dragging-within.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function WidgetAreaInnerBlocks({ id }) {
  const [blocks, onInput, onChange] = (0, import_core_data.useEntityBlockEditor)(
    "root",
    "postType"
  );
  const innerBlocksRef = (0, import_element.useRef)();
  const isDraggingWithinInnerBlocks = (0, import_use_is_dragging_within.default)(innerBlocksRef);
  const shouldHighlightDropZone = isDraggingWithinInnerBlocks;
  const innerBlocksProps = (0, import_block_editor.useInnerBlocksProps)(
    { ref: innerBlocksRef },
    {
      value: blocks,
      onInput,
      onChange,
      templateLock: false,
      renderAppender: import_block_editor.InnerBlocks.ButtonBlockAppender
    }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      "data-widget-area-id": id,
      className: (0, import_clsx.default)(
        "wp-block-widget-area__inner-blocks block-editor-inner-blocks editor-styles-wrapper",
        {
          "wp-block-widget-area__highlight-drop-zone": shouldHighlightDropZone
        }
      ),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ...innerBlocksProps })
    }
  );
}
//# sourceMappingURL=inner-blocks.cjs.map
