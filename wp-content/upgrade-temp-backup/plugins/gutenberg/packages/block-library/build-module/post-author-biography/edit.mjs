// packages/block-library/src/post-author-biography/edit.js
import { useBlockProps } from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { store as coreStore } from "@wordpress/core-data";
import useDeprecatedTextAlign from "../utils/deprecated-text-align-attributes.mjs";
import { Fragment, jsx } from "react/jsx-runtime";
function PostAuthorBiographyEdit(props) {
  useDeprecatedTextAlign(props);
  const {
    context: { postType, postId }
  } = props;
  const { authorDetails } = useSelect(
    (select) => {
      const { getEditedEntityRecord, getUser } = select(coreStore);
      const _authorId = getEditedEntityRecord(
        "postType",
        postType,
        postId
      )?.author;
      return {
        authorDetails: _authorId ? getUser(_authorId) : null
      };
    },
    [postType, postId]
  );
  const blockProps = useBlockProps();
  const displayAuthorBiography = authorDetails?.description || __("Author Biography");
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
    "div",
    {
      ...blockProps,
      dangerouslySetInnerHTML: { __html: displayAuthorBiography }
    }
  ) });
}
var edit_default = PostAuthorBiographyEdit;
export {
  edit_default as default
};
//# sourceMappingURL=edit.mjs.map
