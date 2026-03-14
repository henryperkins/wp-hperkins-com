// packages/block-library/src/list/tag-name.js
import { forwardRef } from "@wordpress/element";
import { jsx } from "react/jsx-runtime";
function TagName(props, ref) {
  const { ordered, ...extraProps } = props;
  const Tag = ordered ? "ol" : "ul";
  return /* @__PURE__ */ jsx(Tag, { ref, ...extraProps });
}
var tag_name_default = forwardRef(TagName);
export {
  tag_name_default as default
};
//# sourceMappingURL=tag-name.mjs.map
