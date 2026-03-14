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

// packages/editor/src/components/post-publish-panel/maybe-upload-media.js
var maybe_upload_media_exports = {};
__export(maybe_upload_media_exports, {
  default: () => MaybeUploadMediaPanel
});
module.exports = __toCommonJS(maybe_upload_media_exports);
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_block_editor = require("@wordpress/block-editor");
var import_element = require("@wordpress/element");
var import_blob = require("@wordpress/blob");
var import_media_util = require("./media-util.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function flattenBlocks(blocks) {
  const result = [];
  blocks.forEach((block) => {
    result.push(block);
    result.push(...flattenBlocks(block.innerBlocks));
  });
  return result;
}
function hasExternalMedia(block) {
  if (block.name === "core/image" || block.name === "core/cover") {
    return block.attributes.url && !block.attributes.id;
  }
  if (block.name === "core/media-text") {
    return block.attributes.mediaUrl && !block.attributes.mediaId;
  }
  return void 0;
}
function getMediaInfo(block) {
  if (block.name === "core/image" || block.name === "core/cover") {
    const { url, alt, id } = block.attributes;
    return { url, alt, id };
  }
  if (block.name === "core/media-text") {
    const { mediaUrl: url, mediaAlt: alt, mediaId: id } = block.attributes;
    return { url, alt, id };
  }
  return {};
}
function Image({ clientId, alt, url }) {
  const { selectBlock } = (0, import_data.useDispatch)(import_block_editor.store);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.__unstableMotion.img,
    {
      tabIndex: 0,
      role: "button",
      "aria-label": (0, import_i18n.__)("Select image block."),
      onClick: () => {
        selectBlock(clientId);
      },
      onKeyDown: (event) => {
        if (event.key === "Enter" || event.key === " ") {
          selectBlock(clientId);
          event.preventDefault();
        }
      },
      alt,
      src: url,
      animate: { opacity: 1 },
      exit: { opacity: 0, scale: 0 },
      style: {
        width: "32px",
        height: "32px",
        objectFit: "cover",
        borderRadius: "2px",
        cursor: "pointer"
      },
      whileHover: { scale: 1.08 }
    },
    clientId
  );
}
function MaybeUploadMediaPanel() {
  const [isUploading, setIsUploading] = (0, import_element.useState)(false);
  const [isAnimating, setIsAnimating] = (0, import_element.useState)(false);
  const [hadUploadError, setHadUploadError] = (0, import_element.useState)(false);
  const { editorBlocks, mediaUpload } = (0, import_data.useSelect)(
    (select) => ({
      editorBlocks: select(import_block_editor.store).getBlocks(),
      mediaUpload: select(import_block_editor.store).getSettings().mediaUpload
    }),
    []
  );
  const blocksWithExternalMedia = flattenBlocks(editorBlocks).filter(
    (block) => hasExternalMedia(block)
  );
  const { updateBlockAttributes } = (0, import_data.useDispatch)(import_block_editor.store);
  if (!mediaUpload || !blocksWithExternalMedia.length) {
    return null;
  }
  const panelBodyTitle = [
    (0, import_i18n.__)("Suggestion:"),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "editor-post-publish-panel__link", children: (0, import_i18n.__)("External media") }, "label")
  ];
  function updateBlockWithUploadedMedia(block, media) {
    if (block.name === "core/image" || block.name === "core/cover") {
      updateBlockAttributes(block.clientId, {
        id: media.id,
        url: media.url
      });
    }
    if (block.name === "core/media-text") {
      updateBlockAttributes(block.clientId, {
        mediaId: media.id,
        mediaUrl: media.url
      });
    }
  }
  function uploadImages() {
    setIsUploading(true);
    setHadUploadError(false);
    const mediaUrls = new Set(
      blocksWithExternalMedia.map((block) => {
        const { url } = getMediaInfo(block);
        return url;
      })
    );
    const uploadPromises = Object.fromEntries(
      Object.entries((0, import_media_util.fetchMedia)([...mediaUrls])).map(
        ([url, filePromise]) => {
          const uploadPromise = filePromise.then(
            (blob) => new Promise((resolve, reject) => {
              mediaUpload({
                filesList: [blob],
                onFileChange: ([media]) => {
                  if ((0, import_blob.isBlobURL)(media.url)) {
                    return;
                  }
                  resolve(media);
                },
                onError() {
                  reject();
                }
              });
            })
          );
          return [url, uploadPromise];
        }
      )
    );
    Promise.allSettled(
      blocksWithExternalMedia.map((block) => {
        const { url } = getMediaInfo(block);
        return uploadPromises[url].then(
          (media) => updateBlockWithUploadedMedia(block, media)
        ).then(() => setIsAnimating(true)).catch(() => setHadUploadError(true));
      })
    ).finally(() => {
      setIsUploading(false);
    });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.PanelBody, { initialOpen: true, title: panelBodyTitle, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: (0, import_i18n.__)(
      "Upload external images to the Media Library. Images from different domains may load slowly, display incorrectly, or be removed unexpectedly."
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "div",
      {
        style: {
          display: "inline-flex",
          flexWrap: "wrap",
          gap: "8px"
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.__unstableAnimatePresence,
            {
              onExitComplete: () => setIsAnimating(false),
              children: blocksWithExternalMedia.map((block) => {
                const { url, alt } = getMediaInfo(block);
                return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Image,
                  {
                    clientId: block.clientId,
                    url,
                    alt
                  },
                  block.clientId
                );
              })
            }
          ),
          isUploading || isAnimating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Spinner, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              size: "compact",
              variant: "primary",
              onClick: uploadImages,
              children: (0, import_i18n._x)("Upload", "verb")
            }
          )
        ]
      }
    ),
    hadUploadError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: (0, import_i18n.__)("Upload failed, try again.") })
  ] });
}
//# sourceMappingURL=maybe-upload-media.cjs.map
