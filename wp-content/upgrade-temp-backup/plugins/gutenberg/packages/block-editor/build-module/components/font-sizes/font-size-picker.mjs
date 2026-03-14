// packages/block-editor/src/components/font-sizes/font-size-picker.js
import { FontSizePicker as BaseFontSizePicker } from "@wordpress/components";
import { useSettings } from "../use-settings/index.mjs";
import { jsx } from "react/jsx-runtime";
function FontSizePicker(props) {
  const [fontSizes, customFontSize] = useSettings(
    "typography.fontSizes",
    "typography.customFontSize"
  );
  return /* @__PURE__ */ jsx(
    BaseFontSizePicker,
    {
      ...props,
      fontSizes,
      disableCustomFontSizes: !customFontSize,
      __next40pxDefaultSize: true
    }
  );
}
var font_size_picker_default = FontSizePicker;
export {
  font_size_picker_default as default
};
//# sourceMappingURL=font-size-picker.mjs.map
