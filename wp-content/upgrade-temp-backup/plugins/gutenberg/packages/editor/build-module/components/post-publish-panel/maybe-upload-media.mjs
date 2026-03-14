// packages/editor/src/components/post-publish-panel/maybe-upload-media.js
import {
  PanelBody,
  Button,
  Spinner,
  __unstableMotion as motion,
  __unstableAnimatePresence as AnimatePresence
} from "@wordpress/components";
import { useSelect, useDispatch } from "@wordpress/data";
import { __, _x } from "@wordpress/i18n";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { useState } from "@wordpress/element";
import { isBlobURL } from "@wordpress/blob";
import { fetchMedia } from "./media-util.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
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
  const { selectBlock } = useDispatch(blockEditorStore);
  return /* @__PURE__ */ jsx(
    motion.img,
    {
      tabIndex: 0,
      role: "button",
      "aria-label": __("Select image block."),
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
  const [isUploading, setIsUploading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hadUploadError, setHadUploadError] = useState(false);
  const { editorBlocks, mediaUpload } = useSelect(
    (select) => ({
      editorBlocks: select(blockEditorStore).getBlocks(),
      mediaUpload: select(blockEditorStore).getSettings().mediaUpload
    }),
    []
  );
  const blocksWithExternalMedia = flattenBlocks(editorBlocks).filter(
    (block) => hasExternalMedia(block)
  );
  const { updateBlockAttributes } = useDispatch(blockEditorStore);
  if (!mediaUpload || !blocksWithExternalMedia.length) {
    return null;
  }
  const panelBodyTitle = [
    __("Suggestion:"),
    /* @__PURE__ */ jsx("span", { className: "editor-post-publish-panel__link", children: __("External media") }, "label")
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
      Object.entries(fetchMedia([...mediaUrls])).map(
        ([url, filePromise]) => {
          const uploadPromise = filePromise.then(
            (blob) => new Promise((resolve, reject) => {
              mediaUpload({
                filesList: [blob],
                onFileChange: ([media]) => {
                  if (isBlobURL(media.url)) {
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
  return /* @__PURE__ */ jsxs(PanelBody, { initialOpen: true, title: panelBodyTitle, children: [
    /* @__PURE__ */ jsx("p", { children: __(
      "Upload external images to the Media Library. Images from different domains may load slowly, display incorrectly, or be removed unexpectedly."
    ) }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        style: {
          display: "inline-flex",
          flexWrap: "wrap",
          gap: "8px"
        },
        children: [
          /* @__PURE__ */ jsx(
            AnimatePresence,
            {
              onExitComplete: () => setIsAnimating(false),
              children: blocksWithExternalMedia.map((block) => {
                const { url, alt } = getMediaInfo(block);
                return /* @__PURE__ */ jsx(
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
          isUploading || isAnimating ? /* @__PURE__ */ jsx(Spinner, {}) : /* @__PURE__ */ jsx(
            Button,
            {
              size: "compact",
              variant: "primary",
              onClick: uploadImages,
              children: _x("Upload", "verb")
            }
          )
        ]
      }
    ),
    hadUploadError && /* @__PURE__ */ jsx("p", { children: __("Upload failed, try again.") })
  ] });
}
export {
  MaybeUploadMediaPanel as default
};
//# sourceMappingURL=maybe-upload-media.mjs.map
