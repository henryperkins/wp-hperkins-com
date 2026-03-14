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

// packages/block-library/src/cover/edit/block-controls.js
var block_controls_exports = {};
__export(block_controls_exports, {
  default: () => CoverBlockControls
});
module.exports = __toCommonJS(block_controls_exports);
var import_element = require("@wordpress/element");
var import_block_editor = require("@wordpress/block-editor");
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_icons = require("@wordpress/icons");
var import_shared = require("../shared.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_embed_video_url_input = __toESM(require("./embed-video-url-input.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var { cleanEmptyObject } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
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
  const [prevMinHeightValue, setPrevMinHeightValue] = (0, import_element.useState)(minHeight);
  const [prevMinHeightUnit, setPrevMinHeightUnit] = (0, import_element.useState)(minHeightUnit);
  const [isEmbedUrlInputOpen, setIsEmbedUrlInputOpen] = (0, import_element.useState)(false);
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    !isContentOnlyMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_block_editor.BlockControls, { group: "block", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_block_editor.__experimentalBlockAlignmentMatrixControl,
        {
          label: (0, import_i18n.__)("Change content position"),
          value: contentPosition,
          onChange: (nextPosition) => setAttributes({
            contentPosition: nextPosition
          }),
          isDisabled: !hasInnerBlocks
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_block_editor.__experimentalBlockFullHeightAligmentControl,
        {
          isActive: isMinFullHeight,
          onToggle: toggleMinFullHeight,
          isDisabled: !hasInnerBlocks
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockControls, { group: "other", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_editor.MediaReplaceFlow,
      {
        mediaId: id,
        mediaURL: url,
        allowedTypes: import_shared.ALLOWED_MEDIA_TYPES,
        onSelect: onSelectMedia,
        onToggleFeaturedImage: toggleUseFeaturedImage,
        useFeaturedImage,
        name: !url ? (0, import_i18n.__)("Add media") : (0, import_i18n.__)("Replace"),
        onReset: onClearMedia,
        variant: "toolbar",
        children: ({ onClose }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.MenuItem,
          {
            icon: import_icons.link,
            onClick: () => {
              setIsEmbedUrlInputOpen(true);
              onClose();
            },
            children: (0, import_i18n.__)("Embed video from URL")
          }
        )
      }
    ) }),
    isEmbedUrlInputOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_embed_video_url_input.default,
      {
        onSubmit: (embedUrl) => {
          onSelectEmbedUrl(embedUrl);
        },
        onClose: () => setIsEmbedUrlInputOpen(false),
        initialUrl: backgroundType === import_shared.EMBED_VIDEO_BACKGROUND_TYPE ? url : ""
      }
    )
  ] });
}
//# sourceMappingURL=block-controls.cjs.map
