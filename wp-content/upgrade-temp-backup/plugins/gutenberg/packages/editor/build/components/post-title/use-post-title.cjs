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

// packages/editor/src/components/post-title/use-post-title.js
var use_post_title_exports = {};
__export(use_post_title_exports, {
  default: () => usePostTitle
});
module.exports = __toCommonJS(use_post_title_exports);
var import_data = require("@wordpress/data");
var import_store = require("../../store/index.cjs");
function usePostTitle() {
  const { editPost } = (0, import_data.useDispatch)(import_store.store);
  const { title } = (0, import_data.useSelect)((select) => {
    const { getEditedPostAttribute } = select(import_store.store);
    return {
      title: getEditedPostAttribute("title")
    };
  }, []);
  function updateTitle(newTitle) {
    editPost({ title: newTitle });
  }
  return { title, setTitle: updateTitle };
}
//# sourceMappingURL=use-post-title.cjs.map
