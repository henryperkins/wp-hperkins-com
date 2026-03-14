// packages/media-fields/src/media_thumbnail/view.tsx
import clsx from "clsx";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import {
  __experimentalTruncate as Truncate,
  __experimentalVStack as VStack,
  Icon
} from "@wordpress/components";
import { useState, useRef, useLayoutEffect } from "@wordpress/element";
import { getFilename } from "@wordpress/url";
import { getMediaTypeFromMimeType } from "../utils/get-media-type-from-mime-type.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx("div", { className: "dataviews-media-field__media-thumbnail", children: /* @__PURE__ */ jsxs(
    VStack,
    {
      justify: "center",
      alignment: "center",
      className: "dataviews-media-field__media-thumbnail__stack",
      spacing: 0,
      children: [
        /* @__PURE__ */ jsx(
          Icon,
          {
            className: "dataviews-media-field__media-thumbnail--icon",
            icon: getMediaTypeFromMimeType(item.mime_type).icon,
            size: 24
          }
        ),
        !!filename && /* @__PURE__ */ jsx("div", { className: "dataviews-media-field__media-thumbnail__filename", children: /* @__PURE__ */ jsx(Truncate, { className: "dataviews-media-field__media-thumbnail__filename__truncate", children: filename }) })
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
  const imgRef = useRef(null);
  const [loadingState, setLoadingState] = useState("loading");
  useLayoutEffect(() => {
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
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: clsx("dataviews-media-field__media-thumbnail", {
        "is-loading": loadingState === "loading",
        "is-loaded": loadingState === "loaded"
      }),
      children: /* @__PURE__ */ jsx(
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
  const [imageError, setImageError] = useState(false);
  const _featuredMedia = useSelect(
    (select) => {
      if (!item.featured_media) {
        return;
      }
      return select(coreStore).getEntityRecord(
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
  const filename = getFilename(featuredMedia.source_url || "");
  if (imageError || getMediaTypeFromMimeType(featuredMedia.mime_type).type !== "image") {
    return /* @__PURE__ */ jsx(FallbackView, { item: featuredMedia, filename: filename || "" });
  }
  return /* @__PURE__ */ jsx(
    ImageView,
    {
      item: featuredMedia,
      configSizes: config?.sizes,
      onError: () => setImageError(true)
    }
  );
}
export {
  MediaThumbnailView as default,
  getBestImageUrl
};
//# sourceMappingURL=view.mjs.map
