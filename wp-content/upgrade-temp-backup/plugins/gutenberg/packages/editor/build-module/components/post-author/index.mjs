// packages/editor/src/components/post-author/index.js
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import PostAuthorCombobox from "./combobox.mjs";
import PostAuthorSelect from "./select.mjs";
import { AUTHORS_QUERY } from "./constants.mjs";
import { jsx } from "react/jsx-runtime";
var minimumUsersForCombobox = 25;
function PostAuthor() {
  const showCombobox = useSelect((select) => {
    const authors = select(coreStore).getUsers(AUTHORS_QUERY);
    return authors?.length >= minimumUsersForCombobox;
  }, []);
  if (showCombobox) {
    return /* @__PURE__ */ jsx(PostAuthorCombobox, {});
  }
  return /* @__PURE__ */ jsx(PostAuthorSelect, {});
}
var post_author_default = PostAuthor;
export {
  post_author_default as default
};
//# sourceMappingURL=index.mjs.map
