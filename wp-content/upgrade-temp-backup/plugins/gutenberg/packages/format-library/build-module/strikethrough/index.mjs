// packages/format-library/src/strikethrough/index.js
import { __ } from "@wordpress/i18n";
import { toggleFormat } from "@wordpress/rich-text";
import {
  RichTextToolbarButton,
  RichTextShortcut
} from "@wordpress/block-editor";
import { formatStrikethrough } from "@wordpress/icons";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var name = "core/strikethrough";
var title = __("Strikethrough");
var strikethrough = {
  name,
  title,
  tagName: "s",
  className: null,
  edit({ isActive, value, onChange, onFocus }) {
    function onClick() {
      onChange(toggleFormat(value, { type: name, title }));
      onFocus();
    }
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        RichTextShortcut,
        {
          type: "access",
          character: "d",
          onUse: onClick
        }
      ),
      /* @__PURE__ */ jsx(
        RichTextToolbarButton,
        {
          icon: formatStrikethrough,
          title,
          onClick,
          isActive,
          role: "menuitemcheckbox"
        }
      )
    ] });
  }
};
export {
  strikethrough
};
//# sourceMappingURL=index.mjs.map
