// packages/block-editor/src/components/writing-mode-control/index.js
import clsx from "clsx";
import { __, isRTL } from "@wordpress/i18n";
import { textHorizontal, textVertical } from "@wordpress/icons";
import {
  __experimentalToggleGroupControl as ToggleGroupControl,
  __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon
} from "@wordpress/components";
import { jsx } from "react/jsx-runtime";
var WRITING_MODES = [
  {
    label: __("Horizontal"),
    value: "horizontal-tb",
    icon: textHorizontal
  },
  {
    label: __("Vertical"),
    value: isRTL() ? "vertical-lr" : "vertical-rl",
    icon: textVertical
  }
];
function WritingModeControl({ className, value, onChange }) {
  return /* @__PURE__ */ jsx(
    ToggleGroupControl,
    {
      isDeselectable: true,
      __next40pxDefaultSize: true,
      label: __("Orientation"),
      className: clsx("block-editor-writing-mode-control", className),
      value,
      onChange: (newValue) => {
        onChange(newValue === value ? void 0 : newValue);
      },
      children: WRITING_MODES.map((option) => {
        return /* @__PURE__ */ jsx(
          ToggleGroupControlOptionIcon,
          {
            value: option.value,
            icon: option.icon,
            label: option.label
          },
          option.value
        );
      })
    }
  );
}
export {
  WritingModeControl as default
};
//# sourceMappingURL=index.mjs.map
