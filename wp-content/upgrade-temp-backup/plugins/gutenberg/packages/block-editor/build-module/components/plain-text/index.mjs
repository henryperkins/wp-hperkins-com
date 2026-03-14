// packages/block-editor/src/components/plain-text/index.js
import TextareaAutosize from "react-autosize-textarea";
import clsx from "clsx";
import { forwardRef } from "@wordpress/element";
import EditableText from "../editable-text/index.mjs";
import { jsx } from "react/jsx-runtime";
var PlainText = forwardRef(({ __experimentalVersion, ...props }, ref) => {
  if (__experimentalVersion === 2) {
    return /* @__PURE__ */ jsx(EditableText, { ref, ...props });
  }
  const { className, onChange, ...remainingProps } = props;
  return /* @__PURE__ */ jsx(
    TextareaAutosize,
    {
      ref,
      className: clsx("block-editor-plain-text", className),
      onChange: (event) => onChange(event.target.value),
      ...remainingProps
    }
  );
});
var plain_text_default = PlainText;
export {
  plain_text_default as default
};
//# sourceMappingURL=index.mjs.map
