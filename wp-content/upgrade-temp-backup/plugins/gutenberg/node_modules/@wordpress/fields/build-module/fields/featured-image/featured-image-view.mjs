// packages/fields/src/fields/featured-image/featured-image-view.tsx
import { jsx } from "react/jsx-runtime";
var FeaturedImageView = ({
  item,
  config
}) => {
  const media = item?._embedded?.["wp:featuredmedia"]?.[0];
  const url = media?.source_url;
  if (url) {
    return /* @__PURE__ */ jsx(
      "img",
      {
        className: "fields-controls__featured-image-image",
        src: url,
        alt: "",
        srcSet: media?.media_details?.sizes ? Object.values(media.media_details.sizes).map(
          (size) => `${size.source_url} ${size.width}w`
        ).join(", ") : void 0,
        sizes: config?.sizes || "100vw"
      }
    );
  }
  return /* @__PURE__ */ jsx("span", { className: "fields-controls__featured-image-placeholder" });
};
export {
  FeaturedImageView
};
//# sourceMappingURL=featured-image-view.mjs.map
