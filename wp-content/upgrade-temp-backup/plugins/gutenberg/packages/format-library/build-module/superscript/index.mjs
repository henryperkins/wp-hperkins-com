// packages/format-library/src/superscript/index.js
import { __ } from "@wordpress/i18n";
import { toggleFormat } from "@wordpress/rich-text";
import { RichTextToolbarButton } from "@wordpress/block-editor";
import { superscript as superscriptIcon } from "@wordpress/icons";
import { jsx } from "react/jsx-runtime";
var name = "core/superscript";
var title = __("Superscript");
var superscript = {
  name,
  title,
  tagName: "sup",
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
        icon: superscriptIcon,
        title,
        onClick,
        isActive,
        role: "menuitemcheckbox"
      }
    );
  }
};
export {
  superscript
};
//# sourceMappingURL=index.mjs.map
