// packages/format-library/src/underline/index.js
import { __ } from "@wordpress/i18n";
import { toggleFormat } from "@wordpress/rich-text";
import {
  RichTextShortcut,
  __unstableRichTextInputEvent
} from "@wordpress/block-editor";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var name = "core/underline";
var title = __("Underline");
var underline = {
  name,
  title,
  tagName: "span",
  className: null,
  attributes: {
    style: "style"
  },
  edit({ value, onChange }) {
    const onToggle = () => {
      onChange(
        toggleFormat(value, {
          type: name,
          attributes: {
            style: "text-decoration: underline;"
          },
          title
        })
      );
    };
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        RichTextShortcut,
        {
          type: "primary",
          character: "u",
          onUse: onToggle
        }
      ),
      /* @__PURE__ */ jsx(
        __unstableRichTextInputEvent,
        {
          inputType: "formatUnderline",
          onInput: onToggle
        }
      )
    ] });
  }
};
export {
  underline
};
//# sourceMappingURL=index.mjs.map
