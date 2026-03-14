// packages/media-fields/src/author/view.tsx
import clsx from "clsx";
import { __ } from "@wordpress/i18n";
import { useState, useCallback, useEffect } from "@wordpress/element";
import { commentAuthorAvatar as authorIcon } from "@wordpress/icons";
import { __experimentalHStack as HStack, Icon } from "@wordpress/components";
import { jsx, jsxs } from "react/jsx-runtime";
function AuthorView({
  item
}) {
  const author = item?._embedded?.author?.[0];
  const text = author?.name;
  const imageUrl = author?.avatar_urls?.[48];
  const [loadingState, setLoadingState] = useState("loading");
  useEffect(() => {
    setLoadingState("loading");
  }, [imageUrl]);
  const imgRef = useCallback((img) => {
    if (img?.complete) {
      setLoadingState("instant");
    }
  }, []);
  const handleLoad = () => {
    if (loadingState === "loading") {
      setLoadingState("loaded");
    }
  };
  return /* @__PURE__ */ jsxs(HStack, { alignment: "left", spacing: 0, children: [
    !!imageUrl && /* @__PURE__ */ jsx(
      "div",
      {
        className: clsx("media-author-field__avatar", {
          "is-loading": loadingState === "loading",
          "is-loaded": loadingState === "loaded"
        }),
        children: /* @__PURE__ */ jsx(
          "img",
          {
            ref: imgRef,
            onLoad: handleLoad,
            alt: __("Author avatar"),
            src: imageUrl
          }
        )
      }
    ),
    !imageUrl && /* @__PURE__ */ jsx("div", { className: "media-author-field__icon", children: /* @__PURE__ */ jsx(Icon, { icon: authorIcon }) }),
    /* @__PURE__ */ jsx("span", { className: "media-author-field__name", children: text })
  ] });
}
export {
  AuthorView as default
};
//# sourceMappingURL=view.mjs.map
