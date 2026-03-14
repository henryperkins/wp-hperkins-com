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

// packages/edit-post/src/components/browser-url/index.js
var browser_url_exports = {};
__export(browser_url_exports, {
  default: () => BrowserURL,
  getPostEditURL: () => getPostEditURL
});
module.exports = __toCommonJS(browser_url_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_url = require("@wordpress/url");
var import_editor = require("@wordpress/editor");
function getPostEditURL(postId) {
  return (0, import_url.addQueryArgs)("post.php", { post: postId, action: "edit" });
}
function BrowserURL() {
  const [historyId, setHistoryId] = (0, import_element.useState)(null);
  const { postId, postStatus } = (0, import_data.useSelect)((select) => {
    const { getCurrentPost } = select(import_editor.store);
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
  (0, import_element.useEffect)(() => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getPostEditURL
});
//# sourceMappingURL=index.cjs.map
