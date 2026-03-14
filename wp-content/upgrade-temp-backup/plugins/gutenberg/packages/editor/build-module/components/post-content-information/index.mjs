// packages/editor/src/components/post-content-information/index.js
import { __experimentalText as Text } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { __, _x, _n, sprintf } from "@wordpress/i18n";
import { count as wordCount } from "@wordpress/wordcount";
import { useMemo } from "@wordpress/element";
import { store as coreStore } from "@wordpress/core-data";
import { store as editorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import {
  TEMPLATE_POST_TYPE,
  TEMPLATE_PART_POST_TYPE
} from "../../store/constants.mjs";
import { jsx } from "react/jsx-runtime";
var AVERAGE_READING_RATE = 189;
function PostContentInformation() {
  const { postContent } = useSelect((select) => {
    const { getEditedPostAttribute, getCurrentPostType, getCurrentPostId } = select(editorStore);
    const { getCurrentRevision, isRevisionsMode } = unlock(
      select(editorStore)
    );
    if (isRevisionsMode()) {
      return {
        postContent: getCurrentRevision()?.content?.raw
      };
    }
    const { canUser } = select(coreStore);
    const { getEntityRecord } = select(coreStore);
    const siteSettings = canUser("read", {
      kind: "root",
      name: "site"
    }) ? getEntityRecord("root", "site") : void 0;
    const postType = getCurrentPostType();
    const _id = getCurrentPostId();
    const isPostsPage = +_id === siteSettings?.page_for_posts;
    const showPostContentInfo = !isPostsPage && ![TEMPLATE_POST_TYPE, TEMPLATE_PART_POST_TYPE].includes(
      postType
    );
    return {
      postContent: showPostContentInfo && getEditedPostAttribute("content")
    };
  }, []);
  const wordCountType = _x("words", "Word count type. Do not translate!");
  const wordsCounted = useMemo(
    () => postContent ? wordCount(postContent, wordCountType) : 0,
    [postContent, wordCountType]
  );
  if (!wordsCounted) {
    return null;
  }
  const readingTime = Math.round(wordsCounted / AVERAGE_READING_RATE);
  const wordsCountText = sprintf(
    // translators: %s: the number of words in the post.
    _n("%s word", "%s words", wordsCounted),
    wordsCounted.toLocaleString()
  );
  const minutesText = readingTime <= 1 ? __("1 minute") : sprintf(
    /* translators: %s: the number of minutes to read the post. */
    _n("%s minute", "%s minutes", readingTime),
    readingTime.toLocaleString()
  );
  return /* @__PURE__ */ jsx("div", { className: "editor-post-content-information", children: /* @__PURE__ */ jsx(Text, { children: sprintf(
    /* translators: 1: How many words a post has. 2: the number of minutes to read the post (e.g. 130 words, 2 minutes read time.) */
    __("%1$s, %2$s read time."),
    wordsCountText,
    minutesText
  ) }) });
}
export {
  PostContentInformation as default
};
//# sourceMappingURL=index.mjs.map
