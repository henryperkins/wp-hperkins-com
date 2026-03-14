// packages/format-library/src/unknown/index.js
import { __ } from "@wordpress/i18n";
import { removeFormat, slice, isCollapsed } from "@wordpress/rich-text";
import { RichTextToolbarButton } from "@wordpress/block-editor";
import { help } from "@wordpress/icons";
import { jsx } from "react/jsx-runtime";
var name = "core/unknown";
var title = __("Clear Unknown Formatting");
function selectionContainsUnknownFormats(value) {
  if (isCollapsed(value)) {
    return false;
  }
  const selectedValue = slice(value);
  return selectedValue.formats.some((formats) => {
    return formats.some((format) => format.type === name);
  });
}
var unknown = {
  name,
  title,
  tagName: "*",
  className: null,
  edit({ isActive, value, onChange, onFocus }) {
    if (!isActive && !selectionContainsUnknownFormats(value)) {
      return null;
    }
    function onClick() {
      onChange(removeFormat(value, name));
      onFocus();
    }
    return /* @__PURE__ */ jsx(
      RichTextToolbarButton,
      {
        name: "unknown",
        icon: help,
        title,
        onClick,
        isActive: true
      }
    );
  }
};
export {
  unknown
};
//# sourceMappingURL=index.mjs.map
