"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/media-fields/src/media_thumbnail/view.tsx
var view_exports = {};
__export(view_exports, {
  default: () => MediaThumbnailView,
  getBestImageUrl: () => getBestImageUrl
});
module.exports = __toCommonJS(view_exports);
var import_clsx = __toESM(require("clsx"));
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_url = require("@wordpress/url");
var import_get_media_type_from_mime_type = require("../utils/get-media-type-from-mime-type.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function getBestImageUrl(featuredMedia, configSizes) {
  const sizes = featuredMedia?.media_details?.sizes;
  if (!sizes) {
    return featuredMedia.source_url;
  }
  const sizeEntries = Object.values(sizes);
  if (!sizeEntries.length) {
    return featuredMedia.source_url;
  }
  const targetWidth = configSizes ? parseInt(configSizes, 10) : NaN;
  if (!Number.isNaN(targetWidth)) {
    const validEntries = sizeEntries.filter(
      (s) => typeof s.width === "number" && !Number.isNaN(s.width)
    );
    if (!validEntries.length) {
      return featuredMedia.source_url;
    }
    const sorted = [...validEntries].sort(
      (a, b) => a.width - b.width
    );
    const match = sorted.find((s) => s.width >= targetWidth);
    if (match) {
      return match.source_url;
    }
    return sorted[sorted.length - 1].source_url;
  }
  return featuredMedia.source_url;
}
function FallbackView({
  item,
  filename
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dataviews-media-field__media-thumbnail", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.__experimentalVStack,
    {
      justify: "center",
      alignment: "center",
      className: "dataviews-media-field__media-thumbnail__stack",
      spacing: 0,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Icon,
          {
            className: "dataviews-media-field__media-thumbnail--icon",
            icon: (0, import_get_media_type_from_mime_type.getMediaTypeFromMimeType)(item.mime_type).icon,
            size: 24
          }
        ),
        !!filename && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dataviews-media-field__media-thumbnail__filename", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalTruncate, { className: "dataviews-media-field__media-thumbnail__filename__truncate", children: filename }) })
      ]
    }
  ) });
}
function ImageView({
  item,
  configSizes,
  onError
}) {
  const imageUrl = getBestImageUrl(item, configSizes);
  const imgRef = (0, import_element.useRef)(null);
  const [loadingState, setLoadingState] = (0, import_element.useState)("loading");
  (0, import_element.useLayoutEffect)(() => {
    if (imgRef.current?.complete) {
      setLoadingState("instant");
    } else {
      setLoadingState("loading");
    }
  }, [imageUrl]);
  const handleLoad = () => {
    if (loadingState === "loading") {
      setLoadingState("loaded");
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      className: (0, import_clsx.default)("dataviews-media-field__media-thumbnail", {
        "is-loading": loadingState === "loading",
        "is-loaded": loadingState === "loaded"
      }),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "img",
        {
          ref: imgRef,
          className: "dataviews-media-field__media-thumbnail--image",
          src: imageUrl,
          alt: item.alt_text || item.title.raw,
          onLoad: handleLoad,
          onError,
          loading: "lazy"
        }
      )
    }
  );
}
function MediaThumbnailView({
  item,
  config
}) {
  const [imageError, setImageError] = (0, import_element.useState)(false);
  const _featuredMedia = (0, import_data.useSelect)(
    (select) => {
      if (!item.featured_media) {
        return;
      }
      return select(import_core_data.store).getEntityRecord(
        "postType",
        "attachment",
        item.featured_media
      );
    },
    [item.featured_media]
  );
  const featuredMedia = item.featured_media ? _featuredMedia : item;
  if (!featuredMedia) {
    return null;
  }
  const filename = (0, import_url.getFilename)(featuredMedia.source_url || "");
  if (imageError || (0, import_get_media_type_from_mime_type.getMediaTypeFromMimeType)(featuredMedia.mime_type).type !== "image") {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FallbackView, { item: featuredMedia, filename: filename || "" });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    ImageView,
    {
      item: featuredMedia,
      configSizes: config?.sizes,
      onError: () => setImageError(true)
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getBestImageUrl
});
//# sourceMappingURL=view.cjs.map
