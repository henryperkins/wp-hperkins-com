// packages/edit-post/src/components/browser-url/index.js
import { useEffect, useState } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { addQueryArgs } from "@wordpress/url";
import { store as editorStore } from "@wordpress/editor";
function getPostEditURL(postId) {
  return addQueryArgs("post.php", { post: postId, action: "edit" });
}
function BrowserURL() {
  const [historyId, setHistoryId] = useState(null);
  const { postId, postStatus } = useSelect((select) => {
    const { getCurrentPost } = select(editorStore);
    const post = getCurrentPost();
    let { id, status, type } = post;
    const isTemplate = ["wp_template", "wp_template_part"].includes(
      type
    );
    if (isTemplate) {
      id = post.wp_id;
    }
    return {
      postId: id,
      postStatus: status
    };
  }, []);
  useEffect(() => {
    if (postId && postId !== historyId && postStatus !== "auto-draft") {
      window.history.replaceState(
        { id: postId },
        "Post " + postId,
        getPostEditURL(postId)
      );
      setHistoryId(postId);
    }
  }, [postId, postStatus, historyId]);
  return null;
}
export {
  BrowserURL as default,
  getPostEditURL
};
//# sourceMappingURL=index.mjs.map
