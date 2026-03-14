"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/post-content-information/index.js
var post_content_information_exports = {};
__export(post_content_information_exports, {
  default: () => PostContentInformation
});
module.exports = __toCommonJS(post_content_information_exports);
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_wordcount = require("@wordpress/wordcount");
var import_element = require("@wordpress/element");
var import_core_data = require("@wordpress/core-data");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_constants = require("../../store/constants.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var AVERAGE_READING_RATE = 189;
function PostContentInformation() {
  const { postContent } = (0, import_data.useSelect)((select) => {
    const { getEditedPostAttribute, getCurrentPostType, getCurrentPostId } = select(import_store.store);
    const { getCurrentRevision, isRevisionsMode } = (0, import_lock_unlock.unlock)(
      select(import_store.store)
    );
    if (isRevisionsMode()) {
      return {
        postContent: getCurrentRevision()?.content?.raw
      };
    }
    const { canUser } = select(import_core_data.store);
    const { getEntityRecord } = select(import_core_data.store);
    const siteSettings = canUser("read", {
      kind: "root",
      name: "site"
    }) ? getEntityRecord("root", "site") : void 0;
    const postType = getCurrentPostType();
    const _id = getCurrentPostId();
    const isPostsPage = +_id === siteSettings?.page_for_posts;
    const showPostContentInfo = !isPostsPage && ![import_constants.TEMPLATE_POST_TYPE, import_constants.TEMPLATE_PART_POST_TYPE].includes(
      postType
    );
    return {
      postContent: showPostContentInfo && getEditedPostAttribute("content")
    };
  }, []);
  const wordCountType = (0, import_i18n._x)("words", "Word count type. Do not translate!");
  const wordsCounted = (0, import_element.useMemo)(
    () => postContent ? (0, import_wordcount.count)(postContent, wordCountType) : 0,
    [postContent, wordCountType]
  );
  if (!wordsCounted) {
    return null;
  }
  const readingTime = Math.round(wordsCounted / AVERAGE_READING_RATE);
  const wordsCountText = (0, import_i18n.sprintf)(
    // translators: %s: the number of words in the post.
    (0, import_i18n._n)("%s word", "%s words", wordsCounted),
    wordsCounted.toLocaleString()
  );
  const minutesText = readingTime <= 1 ? (0, import_i18n.__)("1 minute") : (0, import_i18n.sprintf)(
    /* translators: %s: the number of minutes to read the post. */
    (0, import_i18n._n)("%s minute", "%s minutes", readingTime),
    readingTime.toLocaleString()
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-post-content-information", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { children: (0, import_i18n.sprintf)(
    /* translators: 1: How many words a post has. 2: the number of minutes to read the post (e.g. 130 words, 2 minutes read time.) */
    (0, import_i18n.__)("%1$s, %2$s read time."),
    wordsCountText,
    minutesText
  ) }) });
}
//# sourceMappingURL=index.cjs.map
