"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/global-styles-ui/src/block-preview-panel.tsx
var block_preview_panel_exports = {};
__export(block_preview_panel_exports, {
  default: () => block_preview_panel_default
});
module.exports = __toCommonJS(block_preview_panel_exports);
var import_block_editor = require("@wordpress/block-editor");
var import_blocks = require("@wordpress/blocks");
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_utils = require("./utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var BlockPreviewPanel = ({
  name,
  variation = ""
}) => {
  const blockExample = (0, import_blocks.getBlockType)(name)?.example;
  const blocks = (0, import_element.useMemo)(() => {
    if (!blockExample) {
      return null;
    }
    const example = {
      ...blockExample,
      attributes: {
        ...blockExample.attributes,
        style: void 0,
        className: variation ? (0, import_utils.getVariationClassName)(variation) : blockExample.attributes?.className
      }
    };
    return (0, import_blocks.getBlockFromExample)(name, example);
  }, [name, blockExample, variation]);
  const viewportWidth = blockExample?.viewportWidth ?? 500;
  const previewHeight = 144;
  const sidebarWidth = 235;
  const scale = sidebarWidth / viewportWidth;
  const minHeight = scale !== 0 && scale < 1 && previewHeight ? previewHeight / scale : previewHeight;
  if (!blockExample) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalSpacer, { marginX: 4, marginBottom: 4, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      className: "global-styles-ui__block-preview-panel",
      style: { maxHeight: previewHeight, boxSizing: "initial" },
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_block_editor.BlockPreview,
        {
          blocks,
          viewportWidth,
          minHeight: previewHeight,
          additionalStyles: (
            //We want this CSS to be in sync with the one in InserterPreviewPanel.
            [
              {
                css: `
								body{
									padding: 24px;
									min-height:${Math.round(minHeight)}px;
									display:flex;
									align-items:center;
								}
								.is-root-container { width: 100%; }
							`
              }
            ]
          )
        }
      )
    }
  ) });
};
var block_preview_panel_default = BlockPreviewPanel;
//# sourceMappingURL=block-preview-panel.cjs.map
