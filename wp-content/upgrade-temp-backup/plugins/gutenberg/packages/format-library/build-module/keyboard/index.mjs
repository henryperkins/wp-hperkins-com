// packages/format-library/src/keyboard/index.js
import { __ } from "@wordpress/i18n";
import { toggleFormat } from "@wordpress/rich-text";
import { RichTextToolbarButton } from "@wordpress/block-editor";
import { button } from "@wordpress/icons";
import { jsx } from "react/jsx-runtime";
var name = "core/keyboard";
var title = __("Keyboard input");
var keyboard = {
  name,
  title,
  tagName: "kbd",
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
        icon: button,
        title,
        onClick,
        isActive,
        role: "menuitemcheckbox"
      }
    );
  }
};
export {
  keyboard
};
//# sourceMappingURL=index.mjs.map
