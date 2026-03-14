// packages/block-library/src/table-of-contents/save.js
import { useBlockProps } from "@wordpress/block-editor";
import TableOfContentsList from "./list.mjs";
import { linearToNestedHeadingList } from "./utils.mjs";
import { jsx } from "react/jsx-runtime";
function save({
  attributes: { headings = [], ordered = true }
}) {
  if (headings.length === 0) {
    return null;
  }
  const ListTag = ordered ? "ol" : "ul";
  return /* @__PURE__ */ jsx("nav", { ...useBlockProps.save(), children: /* @__PURE__ */ jsx(ListTag, { children: /* @__PURE__ */ jsx(
    TableOfContentsList,
    {
      nestedHeadingList: linearToNestedHeadingList(headings),
      ordered
    }
  ) }) });
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
