// packages/block-library/src/comment-content/edit.js
import { _x } from "@wordpress/i18n";
import { RawHTML } from "@wordpress/element";
import { Disabled } from "@wordpress/components";
import { useEntityProp } from "@wordpress/core-data";
import { useBlockProps } from "@wordpress/block-editor";
import useDeprecatedTextAlign from "../utils/deprecated-text-align-attributes.mjs";
import { Fragment, jsx } from "react/jsx-runtime";
function Edit(props) {
  const {
    context: { commentId }
  } = props;
  useDeprecatedTextAlign(props);
  const blockProps = useBlockProps();
  const [content] = useEntityProp(
    "root",
    "comment",
    "content",
    commentId
  );
  if (!commentId || !content) {
    return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("div", { ...blockProps, children: /* @__PURE__ */ jsx("p", { children: _x("Comment Content", "block title") }) }) });
  }
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("div", { ...blockProps, children: /* @__PURE__ */ jsx(Disabled, { children: /* @__PURE__ */ jsx(RawHTML, { children: content.rendered }, "html") }) }) });
}
export {
  Edit as default
};
//# sourceMappingURL=edit.mjs.map
