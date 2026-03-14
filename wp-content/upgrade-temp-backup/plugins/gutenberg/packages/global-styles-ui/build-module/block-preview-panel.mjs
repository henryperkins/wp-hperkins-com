// packages/global-styles-ui/src/block-preview-panel.tsx
import { BlockPreview } from "@wordpress/block-editor";
import { getBlockType, getBlockFromExample } from "@wordpress/blocks";
import { __experimentalSpacer as Spacer } from "@wordpress/components";
import { useMemo } from "@wordpress/element";
import { getVariationClassName } from "./utils.mjs";
import { jsx } from "react/jsx-runtime";
var BlockPreviewPanel = ({
  name,
  variation = ""
}) => {
  const blockExample = getBlockType(name)?.example;
  const blocks = useMemo(() => {
    if (!blockExample) {
      return null;
    }
    const example = {
      ...blockExample,
      attributes: {
        ...blockExample.attributes,
        style: void 0,
        className: variation ? getVariationClassName(variation) : blockExample.attributes?.className
      }
    };
    return getBlockFromExample(name, example);
  }, [name, blockExample, variation]);
  const viewportWidth = blockExample?.viewportWidth ?? 500;
  const previewHeight = 144;
  const sidebarWidth = 235;
  const scale = sidebarWidth / viewportWidth;
  const minHeight = scale !== 0 && scale < 1 && previewHeight ? previewHeight / scale : previewHeight;
  if (!blockExample) {
    return null;
  }
  return /* @__PURE__ */ jsx(Spacer, { marginX: 4, marginBottom: 4, children: /* @__PURE__ */ jsx(
    "div",
    {
      className: "global-styles-ui__block-preview-panel",
      style: { maxHeight: previewHeight, boxSizing: "initial" },
      children: /* @__PURE__ */ jsx(
        BlockPreview,
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
export {
  block_preview_panel_default as default
};
//# sourceMappingURL=block-preview-panel.mjs.map
