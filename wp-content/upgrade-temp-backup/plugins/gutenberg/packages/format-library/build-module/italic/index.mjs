// packages/format-library/src/italic/index.js
import { __ } from "@wordpress/i18n";
import { toggleFormat } from "@wordpress/rich-text";
import {
  RichTextToolbarButton,
  RichTextShortcut,
  __unstableRichTextInputEvent
} from "@wordpress/block-editor";
import { formatItalic } from "@wordpress/icons";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var name = "core/italic";
var title = __("Italic");
var italic = {
  name,
  title,
  tagName: "em",
  className: null,
  edit({ isActive, value, onChange, onFocus, isVisible = true }) {
    function onToggle() {
      onChange(toggleFormat(value, { type: name, title }));
    }
    function onClick() {
      onChange(toggleFormat(value, { type: name }));
      onFocus();
    }
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        RichTextShortcut,
        {
          type: "primary",
          character: "i",
          onUse: onToggle
        }
      ),
      isVisible && /* @__PURE__ */ jsx(
        RichTextToolbarButton,
        {
          name: "italic",
          icon: formatItalic,
          title,
          onClick,
          isActive,
          shortcutType: "primary",
          shortcutCharacter: "i"
        }
      ),
      /* @__PURE__ */ jsx(
        __unstableRichTextInputEvent,
        {
          inputType: "formatItalic",
          onInput: onToggle
        }
      )
    ] });
  }
};
export {
  italic
};
//# sourceMappingURL=index.mjs.map
