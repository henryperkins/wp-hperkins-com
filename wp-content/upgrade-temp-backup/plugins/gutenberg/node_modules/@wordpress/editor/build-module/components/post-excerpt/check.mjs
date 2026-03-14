// packages/editor/src/components/post-excerpt/check.js
import PostTypeSupportCheck from "../post-type-support-check/index.mjs";
import { jsx } from "react/jsx-runtime";
function PostExcerptCheck({ children }) {
  return /* @__PURE__ */ jsx(PostTypeSupportCheck, { supportKeys: "excerpt", children });
}
var check_default = PostExcerptCheck;
export {
  check_default as default
};
//# sourceMappingURL=check.mjs.map
