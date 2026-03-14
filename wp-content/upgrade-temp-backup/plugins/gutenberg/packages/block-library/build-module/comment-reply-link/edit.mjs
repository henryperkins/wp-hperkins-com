// packages/block-library/src/comment-reply-link/edit.js
import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";
import useDeprecatedTextAlign from "../utils/deprecated-text-align-attributes.mjs";
import { Fragment, jsx } from "react/jsx-runtime";
function Edit(props) {
  useDeprecatedTextAlign(props);
  const blockProps = useBlockProps();
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("div", { ...blockProps, children: /* @__PURE__ */ jsx(
    "a",
    {
      href: "#comment-reply-pseudo-link",
      onClick: (event) => event.preventDefault(),
      children: __("Reply")
    }
  ) }) });
}
var edit_default = Edit;
export {
  edit_default as default
};
//# sourceMappingURL=edit.mjs.map
