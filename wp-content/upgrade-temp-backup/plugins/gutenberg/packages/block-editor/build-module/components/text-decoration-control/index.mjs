// packages/block-editor/src/components/text-decoration-control/index.js
import clsx from "clsx";
import { reset, formatStrikethrough, formatUnderline } from "@wordpress/icons";
import { __ } from "@wordpress/i18n";
import {
  __experimentalToggleGroupControl as ToggleGroupControl,
  __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon
} from "@wordpress/components";
import { jsx } from "react/jsx-runtime";
var TEXT_DECORATIONS = [
  {
    label: __("None"),
    value: "none",
    icon: reset
  },
  {
    label: __("Underline"),
    value: "underline",
    icon: formatUnderline
  },
  {
    label: __("Strikethrough"),
    value: "line-through",
    icon: formatStrikethrough
  }
];
function TextDecorationControl({
  value,
  onChange,
  className
}) {
  return /* @__PURE__ */ jsx(
    ToggleGroupControl,
    {
      isDeselectable: true,
      __next40pxDefaultSize: true,
      label: __("Decoration"),
      className: clsx(
        "block-editor-text-decoration-control",
        className
      ),
      value,
      onChange: (newValue) => {
        onChange(newValue === value ? void 0 : newValue);
      },
      children: TEXT_DECORATIONS.map((option) => {
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
  TextDecorationControl as default
};
//# sourceMappingURL=index.mjs.map
