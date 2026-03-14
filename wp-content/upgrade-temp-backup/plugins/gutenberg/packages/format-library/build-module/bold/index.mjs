// packages/format-library/src/bold/index.js
import { __ } from "@wordpress/i18n";
import { toggleFormat } from "@wordpress/rich-text";
import {
  RichTextToolbarButton,
  RichTextShortcut,
  __unstableRichTextInputEvent
} from "@wordpress/block-editor";
import { formatBold } from "@wordpress/icons";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var name = "core/bold";
var title = __("Bold");
var bold = {
  name,
  title,
  tagName: "strong",
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
          character: "b",
          onUse: onToggle
        }
      ),
      isVisible && /* @__PURE__ */ jsx(
        RichTextToolbarButton,
        {
          name: "bold",
          icon: formatBold,
          title,
          onClick,
          isActive,
          shortcutType: "primary",
          shortcutCharacter: "b"
        }
      ),
      /* @__PURE__ */ jsx(
        __unstableRichTextInputEvent,
        {
          inputType: "formatBold",
          onInput: onToggle
        }
      )
    ] });
  }
};
export {
  bold
};
//# sourceMappingURL=index.mjs.map
