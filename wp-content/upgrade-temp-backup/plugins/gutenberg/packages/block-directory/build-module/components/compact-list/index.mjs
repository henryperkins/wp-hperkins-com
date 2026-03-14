// packages/block-directory/src/components/compact-list/index.js
import { __, sprintf } from "@wordpress/i18n";
import DownloadableBlockIcon from "../downloadable-block-icon/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function CompactList({ items }) {
  if (!items.length) {
    return null;
  }
  return /* @__PURE__ */ jsx("ul", { className: "block-directory-compact-list", children: items.map(({ icon, id, title, author }) => /* @__PURE__ */ jsxs("li", { className: "block-directory-compact-list__item", children: [
    /* @__PURE__ */ jsx(DownloadableBlockIcon, { icon, title }),
    /* @__PURE__ */ jsxs("div", { className: "block-directory-compact-list__item-details", children: [
      /* @__PURE__ */ jsx("div", { className: "block-directory-compact-list__item-title", children: title }),
      /* @__PURE__ */ jsx("div", { className: "block-directory-compact-list__item-author", children: sprintf(
        /* translators: %s: Name of the block author. */
        __("By %s"),
        author
      ) })
    ] })
  ] }, id)) });
}
export {
  CompactList as default
};
//# sourceMappingURL=index.mjs.map
