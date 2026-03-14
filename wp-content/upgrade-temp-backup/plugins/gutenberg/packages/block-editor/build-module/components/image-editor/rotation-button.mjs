// packages/block-editor/src/components/image-editor/rotation-button.js
import { ToolbarButton } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { rotateRight as rotateRightIcon } from "@wordpress/icons";
import { useImageEditingContext } from "./context.mjs";
import { jsx } from "react/jsx-runtime";
function RotationButton() {
  const { isInProgress, rotateClockwise } = useImageEditingContext();
  return /* @__PURE__ */ jsx(
    ToolbarButton,
    {
      icon: rotateRightIcon,
      label: __("Rotate"),
      onClick: rotateClockwise,
      disabled: isInProgress
    }
  );
}
export {
  RotationButton as default
};
//# sourceMappingURL=rotation-button.mjs.map
