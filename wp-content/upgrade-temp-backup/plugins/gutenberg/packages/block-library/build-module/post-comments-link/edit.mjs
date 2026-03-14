// packages/block-library/src/post-comments-link/edit.js
import { useBlockProps } from "@wordpress/block-editor";
import { useState, useEffect } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import apiFetch from "@wordpress/api-fetch";
import { addQueryArgs } from "@wordpress/url";
import { __, sprintf, _n } from "@wordpress/i18n";
import { store as coreStore } from "@wordpress/core-data";
import { jsx } from "react/jsx-runtime";
function PostCommentsLinkEdit({ context }) {
  const { postType, postId } = context;
  const [commentsCount, setCommentsCount] = useState();
  const blockProps = useBlockProps();
  useEffect(() => {
    if (!postId) {
      return;
    }
    const currentPostId = postId;
    apiFetch({
      path: addQueryArgs("/wp/v2/comments", {
        post: postId
      }),
      parse: false
    }).then((res) => {
      if (currentPostId === postId) {
        setCommentsCount(res.headers.get("X-WP-Total"));
      }
    });
  }, [postId]);
  const post = useSelect(
    (select) => select(coreStore).getEditedEntityRecord(
      "postType",
      postType,
      postId
    ),
    [postType, postId]
  );
  let commentsText;
  if (commentsCount !== void 0) {
    const commentsNumber = parseInt(commentsCount);
    if (commentsNumber === 0) {
      commentsText = __("No comments");
    } else {
      commentsText = sprintf(
        /* translators: %s: Number of comments */
        _n("%s comment", "%s comments", commentsNumber),
        commentsNumber.toLocaleString()
      );
    }
  }
  return /* @__PURE__ */ jsx("div", { ...blockProps, children: post?.link && commentsText !== void 0 ? /* @__PURE__ */ jsx(
    "a",
    {
      href: post?.link + "#comments",
      onClick: (event) => event.preventDefault(),
      children: commentsText
    }
  ) : /* @__PURE__ */ jsx(
    "a",
    {
      href: "#post-comments-link-pseudo-link",
      onClick: (event) => event.preventDefault(),
      children: __("No comments")
    }
  ) });
}
var edit_default = PostCommentsLinkEdit;
export {
  edit_default as default
};
//# sourceMappingURL=edit.mjs.map
