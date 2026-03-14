// packages/block-library/src/playlist-track/edit.js
import { v4 as uuid } from "uuid";
import { isBlobURL } from "@wordpress/blob";
import { useRef, useState } from "@wordpress/element";
import {
  MediaPlaceholder,
  MediaReplaceFlow,
  MediaUpload,
  MediaUploadCheck,
  BlockIcon,
  useBlockProps,
  BlockControls,
  InspectorControls,
  RichText
} from "@wordpress/block-editor";
import {
  Button,
  PanelBody,
  TextControl,
  BaseControl,
  Spinner
} from "@wordpress/components";
import { useDispatch } from "@wordpress/data";
import { store as noticesStore } from "@wordpress/notices";
import { __ } from "@wordpress/i18n";
import { audio as icon } from "@wordpress/icons";
import { __unstableStripHTML as stripHTML } from "@wordpress/dom";
import { useUploadMediaFromBlobURL } from "../utils/hooks.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var ALLOWED_MEDIA_TYPES = ["audio"];
var ALBUM_COVER_ALLOWED_MEDIA_TYPES = ["image"];
var PlaylistTrackEdit = ({ attributes, setAttributes, context }) => {
  const { id, uniqueId, src, album, artist, image, length, title } = attributes;
  const [temporaryURL, setTemporaryURL] = useState(attributes.blob);
  const showArtists = context?.showArtists;
  const currentTrack = context?.currentTrack;
  const imageButton = useRef();
  const blockProps = useBlockProps();
  const { createErrorNotice } = useDispatch(noticesStore);
  function onUploadError(message) {
    createErrorNotice(message, { type: "snackbar" });
  }
  useUploadMediaFromBlobURL({
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
    if (isBlobURL(media.url)) {
      setTemporaryURL(media.url);
      return;
    }
    setAttributes({
      blob: void 0,
      id: media.id,
      uniqueId: uuid(),
      src: media.url,
      artist: media.artist || media?.meta?.artist || media?.media_details?.artist || __("Unknown artist"),
      album: media.album || media?.meta?.album || media?.media_details?.album || __("Unknown album"),
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
    return /* @__PURE__ */ jsx("div", { ...blockProps, children: /* @__PURE__ */ jsx(
      MediaPlaceholder,
      {
        icon: /* @__PURE__ */ jsx(BlockIcon, { icon }),
        labels: {
          title: __("Track"),
          instructions: __(
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(BlockControls, { group: "other", children: /* @__PURE__ */ jsx(
      MediaReplaceFlow,
      {
        name: __("Replace"),
        onSelect: onSelectTrack,
        accept: "audio/*",
        mediaId: id,
        mediaURL: src,
        allowedTypes: ALLOWED_MEDIA_TYPES,
        onError: onUploadError
      }
    ) }),
    /* @__PURE__ */ jsx(InspectorControls, { children: /* @__PURE__ */ jsxs(PanelBody, { title: __("Settings"), children: [
      /* @__PURE__ */ jsx(
        TextControl,
        {
          __next40pxDefaultSize: true,
          label: __("Artist"),
          value: artist ? stripHTML(artist) : "",
          onChange: (artistValue) => {
            setAttributes({ artist: artistValue });
          }
        }
      ),
      /* @__PURE__ */ jsx(
        TextControl,
        {
          __next40pxDefaultSize: true,
          label: __("Album"),
          value: album ? stripHTML(album) : "",
          onChange: (albumValue) => {
            setAttributes({ album: albumValue });
          }
        }
      ),
      /* @__PURE__ */ jsx(
        TextControl,
        {
          __next40pxDefaultSize: true,
          label: __("Title"),
          value: title ? stripHTML(title) : "",
          onChange: (titleValue) => {
            setAttributes({ title: titleValue });
          }
        }
      ),
      /* @__PURE__ */ jsx(MediaUploadCheck, { children: /* @__PURE__ */ jsxs("div", { className: "editor-video-poster-control", children: [
        /* @__PURE__ */ jsx(BaseControl.VisualLabel, { children: __("Album cover image") }),
        !!image && /* @__PURE__ */ jsx(
          "img",
          {
            src: image,
            alt: __(
              "Preview of the album cover image"
            )
          }
        ),
        /* @__PURE__ */ jsx(
          MediaUpload,
          {
            title: __("Select image"),
            onSelect: onSelectAlbumCoverImage,
            allowedTypes: ALBUM_COVER_ALLOWED_MEDIA_TYPES,
            render: ({ open }) => /* @__PURE__ */ jsx(
              Button,
              {
                __next40pxDefaultSize: true,
                variant: "primary",
                onClick: open,
                ref: imageButton,
                children: !image ? __("Select") : __("Replace")
              }
            )
          }
        ),
        !!image && /* @__PURE__ */ jsx(
          Button,
          {
            __next40pxDefaultSize: true,
            onClick: onRemoveAlbumCoverImage,
            variant: "tertiary",
            children: __("Remove")
          }
        )
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxs("li", { ...blockProps, children: [
      !!temporaryURL && /* @__PURE__ */ jsx(Spinner, {}),
      /* @__PURE__ */ jsxs(
        "button",
        {
          className: "wp-block-playlist-track__button",
          "data-wp-context": JSON.stringify({ uniqueId }),
          "aria-current": currentTrack === uniqueId ? "true" : "false",
          children: [
            /* @__PURE__ */ jsxs("span", { className: "wp-block-playlist-track__content", children: [
              /* @__PURE__ */ jsx(
                RichText,
                {
                  tagName: "span",
                  className: "wp-block-playlist-track__title",
                  value: title,
                  placeholder: __("Add title"),
                  onChange: (value) => {
                    setAttributes({ title: value });
                  },
                  allowedFormats: [],
                  withoutInteractiveFormatting: true
                }
              ),
              showArtists && /* @__PURE__ */ jsx(
                RichText,
                {
                  tagName: "span",
                  className: "wp-block-playlist-track__artist",
                  value: artist,
                  placeholder: __("Add artist"),
                  onChange: (value) => setAttributes({ artist: value }),
                  allowedFormats: [],
                  withoutInteractiveFormatting: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "wp-block-playlist-track__length", children: [
              length && /* @__PURE__ */ jsx("span", {
                className: "screen-reader-text",
                /* translators: %s: Visually hidden label for the track length (screen reader text). */
                children: __("Length:")
              }),
              length
            ] }),
            /* @__PURE__ */ jsx("span", { className: "screen-reader-text", children: __("Select to play this track") })
          ]
        }
      )
    ] })
  ] });
};
var edit_default = PlaylistTrackEdit;
export {
  edit_default as default
};
//# sourceMappingURL=edit.mjs.map
