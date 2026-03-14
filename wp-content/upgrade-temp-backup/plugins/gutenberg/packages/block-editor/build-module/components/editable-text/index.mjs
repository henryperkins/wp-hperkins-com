// packages/block-editor/src/components/editable-text/index.js
import { forwardRef } from "@wordpress/element";
import RichText from "../rich-text/index.mjs";
import { jsx } from "react/jsx-runtime";
var EditableText = forwardRef((props, ref) => {
  return /* @__PURE__ */ jsx(RichText, { ref, ...props, __unstableDisableFormats: true });
});
EditableText.Content = function Content({
  value = "",
  tagName: Tag = "div",
  ...props
}) {
  return /* @__PURE__ */ jsx(Tag, { ...props, children: value });
};
var editable_text_default = EditableText;
export {
  editable_text_default as default
};
//# sourceMappingURL=index.mjs.map
