// packages/block-editor/src/components/resizable-box-popover/index.js
import { ResizableBox } from "@wordpress/components";
import BlockPopoverCover from "../block-popover/cover.mjs";
import { jsx } from "react/jsx-runtime";
function ResizableBoxPopover({
  clientId,
  resizableBoxProps,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    BlockPopoverCover,
    {
      clientId,
      __unstablePopoverSlot: "block-toolbar",
      ...props,
      children: /* @__PURE__ */ jsx(ResizableBox, { ...resizableBoxProps })
    }
  );
}
export {
  ResizableBoxPopover as default
};
//# sourceMappingURL=index.mjs.map
