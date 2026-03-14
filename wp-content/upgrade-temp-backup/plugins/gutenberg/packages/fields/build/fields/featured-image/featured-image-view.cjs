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

// packages/fields/src/fields/featured-image/featured-image-view.tsx
var featured_image_view_exports = {};
__export(featured_image_view_exports, {
  FeaturedImageView: () => FeaturedImageView
});
module.exports = __toCommonJS(featured_image_view_exports);
var import_jsx_runtime = require("react/jsx-runtime");
var FeaturedImageView = ({
  item,
  config
}) => {
  const media = item?._embedded?.["wp:featuredmedia"]?.[0];
  const url = media?.source_url;
  if (url) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "fields-controls__featured-image-placeholder" });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FeaturedImageView
});
//# sourceMappingURL=featured-image-view.cjs.map
