// packages/block-editor/src/components/block-full-height-alignment-control/index.js
import { __ } from "@wordpress/i18n";
import { ToolbarButton } from "@wordpress/components";
import { fullHeight } from "@wordpress/icons";
import { jsx } from "react/jsx-runtime";
function BlockFullHeightAlignmentControl({
  isActive,
  label = __("Full height"),
  onToggle,
  isDisabled
}) {
  return /* @__PURE__ */ jsx(
    ToolbarButton,
    {
      isActive,
      icon: fullHeight,
      label,
      onClick: () => onToggle(!isActive),
      disabled: isDisabled
    }
  );
}
var block_full_height_alignment_control_default = BlockFullHeightAlignmentControl;
export {
  block_full_height_alignment_control_default as default
};
//# sourceMappingURL=index.mjs.map
