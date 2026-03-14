// packages/block-editor/src/components/block-switcher/preview-block-popover.js
import { Popover } from "@wordpress/components";
import { useViewportMatch } from "@wordpress/compose";
import BlockPreview from "../block-preview/index.mjs";
import { jsx } from "react/jsx-runtime";
function PreviewBlockPopover({
  blocks,
  placement = "right-start",
  offset = 16,
  anchor
}) {
  const isMobile = useViewportMatch("medium", "<");
  if (isMobile) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className: "block-editor-block-switcher__popover-preview-container", children: /* @__PURE__ */ jsx(
    Popover,
    {
      className: "block-editor-block-switcher__popover-preview",
      placement,
      focusOnMount: false,
      offset,
      anchor,
      children: /* @__PURE__ */ jsx("div", { className: "block-editor-block-switcher__preview", children: /* @__PURE__ */ jsx(BlockPreview, { viewportWidth: 601, blocks }) })
    }
  ) });
}
export {
  PreviewBlockPopover as default
};
//# sourceMappingURL=preview-block-popover.mjs.map
