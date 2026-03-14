// packages/fields/src/fields/author/author-view.tsx
import clsx from "clsx";
import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { commentAuthorAvatar as authorIcon } from "@wordpress/icons";
import { __experimentalHStack as HStack, Icon } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { jsx, jsxs } from "react/jsx-runtime";
function AuthorView({ item }) {
  const authorId = item?.author;
  const embeddedAuthorId = item?._embedded?.author?.[0]?.id;
  const shouldFetch = Boolean(
    authorId && (!embeddedAuthorId || authorId !== embeddedAuthorId)
  );
  const author = useSelect(
    (select) => {
      if (!shouldFetch) {
        return null;
      }
      const { getEntityRecord } = select(coreStore);
      return authorId ? getEntityRecord("root", "user", authorId) : null;
    },
    [authorId, shouldFetch]
  );
  const text = author?.name || item?._embedded?.author?.[0]?.name;
  const imageUrl = author?.avatar_urls?.[48] || item?._embedded?.author?.[0]?.avatar_urls?.[48];
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  return /* @__PURE__ */ jsxs(HStack, { alignment: "left", spacing: 0, children: [
    !!imageUrl && /* @__PURE__ */ jsx(
      "div",
      {
        className: clsx("fields-controls__author-avatar", {
          "is-loaded": isImageLoaded
        }),
        children: /* @__PURE__ */ jsx(
          "img",
          {
            onLoad: () => setIsImageLoaded(true),
            alt: __("Author avatar"),
            src: imageUrl
          }
        )
      }
    ),
    !imageUrl && /* @__PURE__ */ jsx("div", { className: "fields-controls__author-icon", children: /* @__PURE__ */ jsx(Icon, { icon: authorIcon }) }),
    /* @__PURE__ */ jsx("span", { className: "fields-controls__author-name", children: text })
  ] });
}
var author_view_default = AuthorView;
export {
  author_view_default as default
};
//# sourceMappingURL=author-view.mjs.map
