// packages/editor/src/components/post-featured-image/check.js
import PostTypeSupportCheck from "../post-type-support-check/index.mjs";
import ThemeSupportCheck from "../theme-support-check/index.mjs";
import { jsx } from "react/jsx-runtime";
function PostFeaturedImageCheck({ children }) {
  return /* @__PURE__ */ jsx(ThemeSupportCheck, { supportKeys: "post-thumbnails", children: /* @__PURE__ */ jsx(PostTypeSupportCheck, { supportKeys: "thumbnail", children }) });
}
var check_default = PostFeaturedImageCheck;
export {
  check_default as default
};
//# sourceMappingURL=check.mjs.map
