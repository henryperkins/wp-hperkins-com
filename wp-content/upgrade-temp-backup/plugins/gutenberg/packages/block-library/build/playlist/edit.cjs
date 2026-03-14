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

// packages/block-library/src/playlist/edit.js
var edit_exports = {};
__export(edit_exports, {
  default: () => edit_default
});
module.exports = __toCommonJS(edit_exports);
var import_clsx = __toESM(require("clsx"));
var import_uuid = require("uuid");
var import_element = require("@wordpress/element");
var import_block_editor = require("@wordpress/block-editor");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_notices = require("@wordpress/notices");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_blocks = require("@wordpress/blocks");
var import_caption = require("../utils/caption.cjs");
var import_hooks = require("../utils/hooks.cjs");
var import_waveform_player = require("../utils/waveform-player.cjs");
var import_utils = require("./utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var ALLOWED_MEDIA_TYPES = ["audio"];
var PlaylistEdit = ({
  attributes,
  setAttributes,
  isSelected,
  insertBlocksAfter,
  clientId
}) => {
  const {
    order,
    showTracklist,
    showNumbers,
    showImages,
    showArtists,
    currentTrack
  } = attributes;
  const blockProps = (0, import_block_editor.useBlockProps)();
  const { replaceInnerBlocks, __unstableMarkNextChangeAsNotPersistent } = (0, import_data.useDispatch)(import_block_editor.store);
  const { createErrorNotice } = (0, import_data.useDispatch)(import_notices.store);
  const dropdownMenuProps = (0, import_hooks.useToolsPanelDropdownMenuProps)();
  function onUploadError(message) {
    createErrorNotice(message, { type: "snackbar" });
  }
  const { updateBlockAttributes } = (0, import_data.useDispatch)(import_block_editor.store);
  const { innerBlockTracks } = (0, import_data.useSelect)(
    (select) => {
      const { getBlock: _getBlock } = select(import_block_editor.store);
      return {
        innerBlockTracks: _getBlock(clientId)?.innerBlocks ?? []
      };
    },
    [clientId]
  );
  (0, import_element.useEffect)(() => {
    const seen = /* @__PURE__ */ new Set();
    let hasDuplicates = false;
    const updatedBlocks = innerBlockTracks.map((block) => {
      if (seen.has(block.attributes.uniqueId)) {
        hasDuplicates = true;
        return {
          ...block,
          attributes: {
            ...block.attributes,
            uniqueId: (0, import_uuid.v4)()
          }
        };
      }
      seen.add(block.attributes.uniqueId);
      return block;
    });
    if (hasDuplicates) {
      replaceInnerBlocks(clientId, updatedBlocks);
    }
  }, [innerBlockTracks, clientId, replaceInnerBlocks]);
  const validTracks = innerBlockTracks.filter(
    (block) => !!block.attributes.uniqueId
  );
  const tracks = validTracks.map((block) => block.attributes);
  const firstTrackId = validTracks[0]?.attributes?.uniqueId;
  (0, import_element.useEffect)(() => {
    if (tracks.length === 0) {
      if (currentTrack !== null) {
        updateBlockAttributes(clientId, { currentTrack: null });
      }
    } else if (
      // If the currentTrack is not the first track, update it to the first track.
      firstTrackId && firstTrackId !== currentTrack
    ) {
      updateBlockAttributes(clientId, { currentTrack: firstTrackId });
    }
  }, [
    tracks,
    currentTrack,
    firstTrackId,
    clientId,
    updateBlockAttributes
  ]);
  const onSelectTracks = (0, import_element.useCallback)(
    (media) => {
      if (!media) {
        return;
      }
      if (!Array.isArray(media)) {
        media = [media];
      }
      const trackList = media.map(import_utils.getTrackAttributes);
      __unstableMarkNextChangeAsNotPersistent();
      setAttributes({
        currentTrack: trackList.length > 0 ? trackList[0].uniqueId : null
      });
      const newBlocks = trackList.map(
        (track) => (0, import_blocks.createBlock)("core/playlist-track", track)
      );
      replaceInnerBlocks(clientId, newBlocks);
    },
    [
      __unstableMarkNextChangeAsNotPersistent,
      setAttributes,
      replaceInnerBlocks,
      clientId
    ]
  );
  const currentTrackData = tracks.find(
    (track) => track.uniqueId === currentTrack
  );
  const onTrackEnded = (0, import_element.useCallback)(() => {
    const currentIndex = tracks.findIndex(
      (track) => track.uniqueId === currentTrack
    );
    const nextTrack = tracks[currentIndex + 1] || tracks[0];
    if (nextTrack?.uniqueId) {
      setAttributes({ currentTrack: nextTrack.uniqueId });
    }
  }, [currentTrack, tracks, setAttributes]);
  const onChangeOrder = (0, import_element.useCallback)(
    (trackOrder) => {
      const sortedBlocks = [...innerBlockTracks].sort((a, b) => {
        const titleA = a.attributes.title || "";
        const titleB = b.attributes.title || "";
        if (trackOrder === "asc") {
          return titleA.localeCompare(titleB);
        }
        return titleB.localeCompare(titleA);
      });
      const firstUniqueId = sortedBlocks[0]?.attributes?.uniqueId;
      replaceInnerBlocks(clientId, sortedBlocks);
      setAttributes({
        order: trackOrder,
        currentTrack: firstUniqueId && firstUniqueId !== currentTrack ? firstUniqueId : currentTrack
      });
    },
    [
      clientId,
      currentTrack,
      innerBlockTracks,
      replaceInnerBlocks,
      setAttributes
    ]
  );
  function toggleAttribute(attribute) {
    return (newValue) => {
      setAttributes({ [attribute]: newValue });
    };
  }
  const hasSelectedChild = (0, import_data.useSelect)(
    (select) => select(import_block_editor.store).hasSelectedInnerBlock(clientId),
    [clientId]
  );
  const hasAnySelected = isSelected || hasSelectedChild;
  const innerBlocksProps = (0, import_block_editor.useInnerBlocksProps)(blockProps, {
    __experimentalAppenderTagName: "li",
    renderAppender: hasAnySelected && import_block_editor.InnerBlocks.ButtonBlockAppender
  });
  if (tracks.length === 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        ...blockProps,
        className: (0, import_clsx.default)("is-placeholder", blockProps.className),
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_block_editor.MediaPlaceholder,
          {
            icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockIcon, { icon: import_icons.audio }),
            labels: {
              title: (0, import_i18n.__)("Playlist"),
              instructions: (0, import_i18n.__)(
                "Upload an audio file or pick one from your media library."
              )
            },
            onSelect: onSelectTracks,
            accept: "audio/*",
            multiple: true,
            allowedTypes: ALLOWED_MEDIA_TYPES,
            onError: onUploadError
          }
        )
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockControls, { group: "other", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_editor.MediaReplaceFlow,
      {
        name: (0, import_i18n.__)("Edit"),
        onSelect: onSelectTracks,
        accept: "audio/*",
        multiple: true,
        mediaIds: tracks.filter((track) => track.id).map((track) => track.id),
        allowedTypes: ALLOWED_MEDIA_TYPES,
        onError: onUploadError
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.InspectorControls, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      import_components.__experimentalToolsPanel,
      {
        label: (0, import_i18n.__)("Settings"),
        resetAll: () => {
          setAttributes({
            showTracklist: true,
            showArtists: true,
            showNumbers: true,
            showImages: true,
            order: "asc"
          });
        },
        dropdownMenuProps,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.__experimentalToolsPanelItem,
            {
              label: (0, import_i18n.__)("Show Tracklist"),
              isShownByDefault: true,
              hasValue: () => showTracklist !== true,
              onDeselect: () => setAttributes({ showTracklist: true }),
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.ToggleControl,
                {
                  label: (0, import_i18n.__)("Show Tracklist"),
                  onChange: toggleAttribute("showTracklist"),
                  checked: showTracklist
                }
              )
            }
          ),
          showTracklist && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.__experimentalToolsPanelItem,
              {
                label: (0, import_i18n.__)("Show artist name in Tracklist"),
                isShownByDefault: true,
                hasValue: () => showArtists !== true,
                onDeselect: () => setAttributes({ showArtists: true }),
                children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_components.ToggleControl,
                  {
                    label: (0, import_i18n.__)(
                      "Show artist name in Tracklist"
                    ),
                    onChange: toggleAttribute(
                      "showArtists"
                    ),
                    checked: showArtists
                  }
                )
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.__experimentalToolsPanelItem,
              {
                label: (0, import_i18n.__)("Show number in Tracklist"),
                isShownByDefault: true,
                hasValue: () => showNumbers !== true,
                onDeselect: () => setAttributes({ showNumbers: true }),
                children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_components.ToggleControl,
                  {
                    label: (0, import_i18n.__)("Show number in Tracklist"),
                    onChange: toggleAttribute(
                      "showNumbers"
                    ),
                    checked: showNumbers
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.__experimentalToolsPanelItem,
            {
              label: (0, import_i18n.__)("Show images"),
              isShownByDefault: true,
              hasValue: () => showImages !== true,
              onDeselect: () => setAttributes({ showImages: true }),
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.ToggleControl,
                {
                  label: (0, import_i18n.__)("Show images"),
                  onChange: toggleAttribute("showImages"),
                  checked: showImages
                }
              )
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.__experimentalToolsPanelItem,
            {
              label: (0, import_i18n.__)("Order"),
              isShownByDefault: true,
              hasValue: () => order !== "asc",
              onDeselect: () => setAttributes({ order: "asc" }),
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.SelectControl,
                {
                  __next40pxDefaultSize: true,
                  label: (0, import_i18n.__)("Order"),
                  value: order,
                  options: [
                    { label: (0, import_i18n.__)("Descending"), value: "desc" },
                    { label: (0, import_i18n.__)("Ascending"), value: "asc" }
                  ],
                  onChange: (value) => onChangeOrder(value)
                }
              )
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { ...blockProps, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Disabled, { isDisabled: !isSelected, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_waveform_player.WaveformPlayer,
        {
          src: currentTrackData?.src,
          title: currentTrackData?.title,
          artist: currentTrackData?.artist,
          image: currentTrackData?.image,
          onEnded: onTrackEnded
        }
      ) }),
      showTracklist && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "ol",
        {
          className: (0, import_clsx.default)("wp-block-playlist__tracklist", {
            "wp-block-playlist__tracklist-show-numbers": showNumbers
          }),
          children: innerBlocksProps.children
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_caption.Caption,
        {
          attributes,
          setAttributes,
          isSelected,
          insertBlocksAfter,
          label: (0, import_i18n.__)("Playlist caption text"),
          showToolbarButton: isSelected,
          style: { marginTop: 16 }
        }
      )
    ] })
  ] });
};
var edit_default = PlaylistEdit;
//# sourceMappingURL=edit.cjs.map
