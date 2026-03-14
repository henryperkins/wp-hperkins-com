// packages/media-editor/src/components/media-preview/index.tsx
import { Spinner } from "@wordpress/components";
import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { useMediaEditorContext } from "../media-editor-provider/index.mjs";
import { getMediaTypeFromMimeType } from "../../utils/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function MediaPreviewContent({
  mediaType,
  mediaUrl,
  altText,
  displayTitle,
  mimeType,
  onLoad,
  onError,
  loadingState
}) {
  switch (mediaType.type) {
    case "image":
      return /* @__PURE__ */ jsx(
        "img",
        {
          className: loadingState === "loaded" ? "loaded" : "",
          src: mediaUrl,
          alt: altText || "",
          onLoad,
          onError
        }
      );
    case "video":
      return /* @__PURE__ */ jsx("video", { src: mediaUrl, controls: true, onError, children: displayTitle });
    case "audio":
      return /* @__PURE__ */ jsx("audio", { src: mediaUrl, controls: true, onError, children: displayTitle });
    default:
      return /* @__PURE__ */ jsxs("div", { className: "media-editor-preview__file-info", children: [
        /* @__PURE__ */ jsx("p", { className: "media-editor-preview__file-name", children: displayTitle }),
        /* @__PURE__ */ jsx("p", { className: "media-editor-preview__mime-type", children: mimeType }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: mediaUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "media-editor-preview__download-link",
            children: __("View file")
          }
        )
      ] });
  }
}
function MediaPreview(props) {
  const [loadingState, setLoadingState] = useState("loading");
  const { media } = useMediaEditorContext();
  const {
    source_url: mediaUrl,
    mime_type: mimeType,
    alt_text: altText,
    title
  } = media || {};
  const mediaType = getMediaTypeFromMimeType(mimeType);
  if (!mediaUrl) {
    return /* @__PURE__ */ jsx("div", { className: "media-editor-preview media-editor-preview--empty", children: /* @__PURE__ */ jsx("p", { children: __("No media file available.") }) });
  }
  if (loadingState === "error") {
    return /* @__PURE__ */ jsxs("div", { className: "media-editor-preview media-editor-preview--error", children: [
      /* @__PURE__ */ jsx("p", { children: __("Failed to load media file.") }),
      /* @__PURE__ */ jsx("p", { className: "media-editor-preview__url", children: mediaUrl })
    ] });
  }
  const displayTitle = typeof title === "string" ? title : title?.rendered || title?.raw;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ...props,
      className: `media-editor-preview media-editor-preview--${mediaType.type}`,
      children: [
        mediaType.type === "image" && loadingState === "loading" && /* @__PURE__ */ jsx("div", { className: "media-editor-preview__spinner", children: /* @__PURE__ */ jsx(Spinner, {}) }),
        /* @__PURE__ */ jsx(
          MediaPreviewContent,
          {
            mediaType,
            mediaUrl,
            altText,
            displayTitle,
            mimeType,
            onLoad: () => setLoadingState("loaded"),
            onError: () => setLoadingState("error"),
            loadingState
          }
        )
      ]
    }
  );
}
export {
  MediaPreview as default
};
//# sourceMappingURL=index.mjs.map
