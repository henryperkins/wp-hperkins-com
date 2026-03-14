// packages/format-library/src/subscript/index.js
import { __ } from "@wordpress/i18n";
import { toggleFormat } from "@wordpress/rich-text";
import { RichTextToolbarButton } from "@wordpress/block-editor";
import { subscript as subscriptIcon } from "@wordpress/icons";
import { jsx } from "react/jsx-runtime";
var name = "core/subscript";
var title = __("Subscript");
var subscript = {
  name,
  title,
  tagName: "sub",
  className: null,
  edit({ isActive, value, onChange, onFocus }) {
    function onToggle() {
      onChange(toggleFormat(value, { type: name, title }));
    }
    function onClick() {
      onToggle();
      onFocus();
    }
    return /* @__PURE__ */ jsx(
      RichTextToolbarButton,
      {
        icon: subscriptIcon,
        title,
        onClick,
        isActive,
        role: "menuitemcheckbox"
      }
    );
  }
};
export {
  subscript
};
//# sourceMappingURL=index.mjs.map
