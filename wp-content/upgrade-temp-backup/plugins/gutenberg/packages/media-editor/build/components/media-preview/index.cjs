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

// packages/media-editor/src/components/media-preview/index.tsx
var media_preview_exports = {};
__export(media_preview_exports, {
  default: () => MediaPreview
});
module.exports = __toCommonJS(media_preview_exports);
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_media_editor_provider = require("../media-editor-provider/index.cjs");
var import_utils = require("../../utils/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
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
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", { src: mediaUrl, controls: true, onError, children: displayTitle });
    case "audio":
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", { src: mediaUrl, controls: true, onError, children: displayTitle });
    default:
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "media-editor-preview__file-info", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "media-editor-preview__file-name", children: displayTitle }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "media-editor-preview__mime-type", children: mimeType }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "a",
          {
            href: mediaUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "media-editor-preview__download-link",
            children: (0, import_i18n.__)("View file")
          }
        )
      ] });
  }
}
function MediaPreview(props) {
  const [loadingState, setLoadingState] = (0, import_element.useState)("loading");
  const { media } = (0, import_media_editor_provider.useMediaEditorContext)();
  const {
    source_url: mediaUrl,
    mime_type: mimeType,
    alt_text: altText,
    title
  } = media || {};
  const mediaType = (0, import_utils.getMediaTypeFromMimeType)(mimeType);
  if (!mediaUrl) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "media-editor-preview media-editor-preview--empty", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: (0, import_i18n.__)("No media file available.") }) });
  }
  if (loadingState === "error") {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "media-editor-preview media-editor-preview--error", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: (0, import_i18n.__)("Failed to load media file.") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "media-editor-preview__url", children: mediaUrl })
    ] });
  }
  const displayTitle = typeof title === "string" ? title : title?.rendered || title?.raw;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      ...props,
      className: `media-editor-preview media-editor-preview--${mediaType.type}`,
      children: [
        mediaType.type === "image" && loadingState === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "media-editor-preview__spinner", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Spinner, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
//# sourceMappingURL=index.cjs.map
