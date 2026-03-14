// packages/block-library/src/cover/edit/block-controls.js
import { useState } from "@wordpress/element";
import {
  BlockControls,
  MediaReplaceFlow,
  __experimentalBlockAlignmentMatrixControl as BlockAlignmentMatrixControl,
  __experimentalBlockFullHeightAligmentControl as FullHeightAlignmentControl,
  privateApis as blockEditorPrivateApis
} from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import { MenuItem } from "@wordpress/components";
import { link } from "@wordpress/icons";
import { ALLOWED_MEDIA_TYPES, EMBED_VIDEO_BACKGROUND_TYPE } from "../shared.mjs";
import { unlock } from "../../lock-unlock.mjs";
import EmbedVideoUrlInput from "./embed-video-url-input.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { cleanEmptyObject } = unlock(blockEditorPrivateApis);
function CoverBlockControls({
  attributes,
  setAttributes,
  onSelectMedia,
  currentSettings,
  toggleUseFeaturedImage,
  onClearMedia,
  onSelectEmbedUrl,
  blockEditingMode
}) {
  const {
    contentPosition,
    id,
    useFeaturedImage,
    minHeight,
    minHeightUnit,
    backgroundType
  } = attributes;
  const { hasInnerBlocks, url } = currentSettings;
  const [prevMinHeightValue, setPrevMinHeightValue] = useState(minHeight);
  const [prevMinHeightUnit, setPrevMinHeightUnit] = useState(minHeightUnit);
  const [isEmbedUrlInputOpen, setIsEmbedUrlInputOpen] = useState(false);
  const isMinFullHeight = minHeightUnit === "vh" && minHeight === 100 && !attributes?.style?.dimensions?.aspectRatio;
  const isContentOnlyMode = blockEditingMode === "contentOnly";
  const toggleMinFullHeight = () => {
    if (isMinFullHeight) {
      if (prevMinHeightUnit === "vh" && prevMinHeightValue === 100) {
        return setAttributes({
          minHeight: void 0,
          minHeightUnit: void 0
        });
      }
      return setAttributes({
        minHeight: prevMinHeightValue,
        minHeightUnit: prevMinHeightUnit
      });
    }
    setPrevMinHeightValue(minHeight);
    setPrevMinHeightUnit(minHeightUnit);
    return setAttributes({
      minHeight: 100,
      minHeightUnit: "vh",
      style: cleanEmptyObject({
        ...attributes?.style,
        dimensions: {
          ...attributes?.style?.dimensions,
          aspectRatio: void 0
          // Reset aspect ratio when minHeight is set.
        }
      })
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    !isContentOnlyMode && /* @__PURE__ */ jsxs(BlockControls, { group: "block", children: [
      /* @__PURE__ */ jsx(
        BlockAlignmentMatrixControl,
        {
          label: __("Change content position"),
          value: contentPosition,
          onChange: (nextPosition) => setAttributes({
            contentPosition: nextPosition
          }),
          isDisabled: !hasInnerBlocks
        }
      ),
      /* @__PURE__ */ jsx(
        FullHeightAlignmentControl,
        {
          isActive: isMinFullHeight,
          onToggle: toggleMinFullHeight,
          isDisabled: !hasInnerBlocks
        }
      )
    ] }),
    /* @__PURE__ */ jsx(BlockControls, { group: "other", children: /* @__PURE__ */ jsx(
      MediaReplaceFlow,
      {
        mediaId: id,
        mediaURL: url,
        allowedTypes: ALLOWED_MEDIA_TYPES,
        onSelect: onSelectMedia,
        onToggleFeaturedImage: toggleUseFeaturedImage,
        useFeaturedImage,
        name: !url ? __("Add media") : __("Replace"),
        onReset: onClearMedia,
        variant: "toolbar",
        children: ({ onClose }) => /* @__PURE__ */ jsx(
          MenuItem,
          {
            icon: link,
            onClick: () => {
              setIsEmbedUrlInputOpen(true);
              onClose();
            },
            children: __("Embed video from URL")
          }
        )
      }
    ) }),
    isEmbedUrlInputOpen && /* @__PURE__ */ jsx(
      EmbedVideoUrlInput,
      {
        onSubmit: (embedUrl) => {
          onSelectEmbedUrl(embedUrl);
        },
        onClose: () => setIsEmbedUrlInputOpen(false),
        initialUrl: backgroundType === EMBED_VIDEO_BACKGROUND_TYPE ? url : ""
      }
    )
  ] });
}
export {
  CoverBlockControls as default
};
//# sourceMappingURL=block-controls.mjs.map
