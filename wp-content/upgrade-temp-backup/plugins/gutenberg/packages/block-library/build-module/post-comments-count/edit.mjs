// packages/block-library/src/post-comments-count/edit.js
import { useBlockProps } from "@wordpress/block-editor";
import { useState, useEffect } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import { addQueryArgs } from "@wordpress/url";
import { jsx } from "react/jsx-runtime";
function PostCommentsCountEdit({ context }) {
  const { postId } = context;
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
  const hasPostAndComments = postId && commentsCount !== void 0;
  const blockStyles = {
    ...blockProps.style,
    textDecoration: hasPostAndComments ? blockProps.style?.textDecoration : void 0
  };
  return /* @__PURE__ */ jsx("div", { ...blockProps, style: blockStyles, children: hasPostAndComments ? commentsCount : "0" });
}
export {
  PostCommentsCountEdit as default
};
//# sourceMappingURL=edit.mjs.map
