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

// packages/block-library/src/playlist-track/edit.js
var edit_exports = {};
__export(edit_exports, {
  default: () => edit_default
});
module.exports = __toCommonJS(edit_exports);
var import_uuid = require("uuid");
var import_blob = require("@wordpress/blob");
var import_element = require("@wordpress/element");
var import_block_editor = require("@wordpress/block-editor");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_notices = require("@wordpress/notices");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_dom = require("@wordpress/dom");
var import_hooks = require("../utils/hooks.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var ALLOWED_MEDIA_TYPES = ["audio"];
var ALBUM_COVER_ALLOWED_MEDIA_TYPES = ["image"];
var PlaylistTrackEdit = ({ attributes, setAttributes, context }) => {
  const { id, uniqueId, src, album, artist, image, length, title } = attributes;
  const [temporaryURL, setTemporaryURL] = (0, import_element.useState)(attributes.blob);
  const showArtists = context?.showArtists;
  const currentTrack = context?.currentTrack;
  const imageButton = (0, import_element.useRef)();
  const blockProps = (0, import_block_editor.useBlockProps)();
  const { createErrorNotice } = (0, import_data.useDispatch)(import_notices.store);
  function onUploadError(message) {
    createErrorNotice(message, { type: "snackbar" });
  }
  (0, import_hooks.useUploadMediaFromBlobURL)({
    src: temporaryURL,
    allowedTypes: ALLOWED_MEDIA_TYPES,
    onChange: onSelectTrack,
    onError: onUploadError
  });
  function onSelectTrack(media) {
    if (!media || !media.url) {
      setAttributes({
        blob: void 0,
        id: void 0,
        uniqueId: void 0,
        artist: void 0,
        album: void 0,
        image: void 0,
        length: void 0,
        title: void 0,
        url: void 0
      });
      setTemporaryURL();
      return;
    }
    if ((0, import_blob.isBlobURL)(media.url)) {
      setTemporaryURL(media.url);
      return;
    }
    setAttributes({
      blob: void 0,
      id: media.id,
      uniqueId: (0, import_uuid.v4)(),
      src: media.url,
      artist: media.artist || media?.meta?.artist || media?.media_details?.artist || (0, import_i18n.__)("Unknown artist"),
      album: media.album || media?.meta?.album || media?.media_details?.album || (0, import_i18n.__)("Unknown album"),
      // Prevent using the default media attachment icon as the track image.
      image: media?.image?.src && media?.image?.src.endsWith("/images/media/audio.svg") ? "" : media?.image?.src,
      length: media?.fileLength || media?.media_details?.length_formatted,
      title: media.title
    });
    setTemporaryURL();
  }
  function onSelectAlbumCoverImage(coverImage) {
    setAttributes({ image: coverImage.url });
  }
  function onRemoveAlbumCoverImage() {
    setAttributes({ image: void 0 });
    imageButton.current.focus();
  }
  if (!src && !temporaryURL) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ...blockProps, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_editor.MediaPlaceholder,
      {
        icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockIcon, { icon: import_icons.audio }),
        labels: {
          title: (0, import_i18n.__)("Track"),
          instructions: (0, import_i18n.__)(
            "Upload an audio file or pick one from your media library."
          )
        },
        onSelect: onSelectTrack,
        accept: "audio/*",
        allowedTypes: ALLOWED_MEDIA_TYPES,
        value: attributes,
        onError: onUploadError
      }
    ) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockControls, { group: "other", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_editor.MediaReplaceFlow,
      {
        name: (0, import_i18n.__)("Replace"),
        onSelect: onSelectTrack,
        accept: "audio/*",
        mediaId: id,
        mediaURL: src,
        allowedTypes: ALLOWED_MEDIA_TYPES,
        onError: onUploadError
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.InspectorControls, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.PanelBody, { title: (0, import_i18n.__)("Settings"), children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.TextControl,
        {
          __next40pxDefaultSize: true,
          label: (0, import_i18n.__)("Artist"),
          value: artist ? (0, import_dom.__unstableStripHTML)(artist) : "",
          onChange: (artistValue) => {
            setAttributes({ artist: artistValue });
          }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.TextControl,
        {
          __next40pxDefaultSize: true,
          label: (0, import_i18n.__)("Album"),
          value: album ? (0, import_dom.__unstableStripHTML)(album) : "",
          onChange: (albumValue) => {
            setAttributes({ album: albumValue });
          }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.TextControl,
        {
          __next40pxDefaultSize: true,
          label: (0, import_i18n.__)("Title"),
          value: title ? (0, import_dom.__unstableStripHTML)(title) : "",
          onChange: (titleValue) => {
            setAttributes({ title: titleValue });
          }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.MediaUploadCheck, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "editor-video-poster-control", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.BaseControl.VisualLabel, { children: (0, import_i18n.__)("Album cover image") }),
        !!image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "img",
          {
            src: image,
            alt: (0, import_i18n.__)(
              "Preview of the album cover image"
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_block_editor.MediaUpload,
          {
            title: (0, import_i18n.__)("Select image"),
            onSelect: onSelectAlbumCoverImage,
            allowedTypes: ALBUM_COVER_ALLOWED_MEDIA_TYPES,
            render: ({ open }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.Button,
              {
                __next40pxDefaultSize: true,
                variant: "primary",
                onClick: open,
                ref: imageButton,
                children: !image ? (0, import_i18n.__)("Select") : (0, import_i18n.__)("Replace")
              }
            )
          }
        ),
        !!image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            __next40pxDefaultSize: true,
            onClick: onRemoveAlbumCoverImage,
            variant: "tertiary",
            children: (0, import_i18n.__)("Remove")
          }
        )
      ] }) })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { ...blockProps, children: [
      !!temporaryURL && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Spinner, {}),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        "button",
        {
          className: "wp-block-playlist-track__button",
          "data-wp-context": JSON.stringify({ uniqueId }),
          "aria-current": currentTrack === uniqueId ? "true" : "false",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "wp-block-playlist-track__content", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_block_editor.RichText,
                {
                  tagName: "span",
                  className: "wp-block-playlist-track__title",
                  value: title,
                  placeholder: (0, import_i18n.__)("Add title"),
                  onChange: (value) => {
                    setAttributes({ title: value });
                  },
                  allowedFormats: [],
                  withoutInteractiveFormatting: true
                }
              ),
              showArtists && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_block_editor.RichText,
                {
                  tagName: "span",
                  className: "wp-block-playlist-track__artist",
                  value: artist,
                  placeholder: (0, import_i18n.__)("Add artist"),
                  onChange: (value) => setAttributes({ artist: value }),
                  allowedFormats: [],
                  withoutInteractiveFormatting: true
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "wp-block-playlist-track__length", children: [
              length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                className: "screen-reader-text",
                /* translators: %s: Visually hidden label for the track length (screen reader text). */
                children: (0, import_i18n.__)("Length:")
              }),
              length
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "screen-reader-text", children: (0, import_i18n.__)("Select to play this track") })
          ]
        }
      )
    ] })
  ] });
};
var edit_default = PlaylistTrackEdit;
//# sourceMappingURL=edit.cjs.map
