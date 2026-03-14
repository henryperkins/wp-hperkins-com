// packages/block-library/src/playlist/edit.js
import clsx from "clsx";
import { v4 as uuid } from "uuid";
import { useCallback, useEffect } from "@wordpress/element";
import {
  store as blockEditorStore,
  MediaPlaceholder,
  MediaReplaceFlow,
  BlockIcon,
  useBlockProps,
  useInnerBlocksProps,
  BlockControls,
  InspectorControls,
  InnerBlocks
} from "@wordpress/block-editor";
import {
  ToggleControl,
  Disabled,
  SelectControl,
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem
} from "@wordpress/components";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as noticesStore } from "@wordpress/notices";
import { __ } from "@wordpress/i18n";
import { audio as icon } from "@wordpress/icons";
import { createBlock } from "@wordpress/blocks";
import { Caption } from "../utils/caption.mjs";
import { useToolsPanelDropdownMenuProps } from "../utils/hooks.mjs";
import { WaveformPlayer } from "../utils/waveform-player.mjs";
import { getTrackAttributes } from "./utils.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
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
  const blockProps = useBlockProps();
  const { replaceInnerBlocks, __unstableMarkNextChangeAsNotPersistent } = useDispatch(blockEditorStore);
  const { createErrorNotice } = useDispatch(noticesStore);
  const dropdownMenuProps = useToolsPanelDropdownMenuProps();
  function onUploadError(message) {
    createErrorNotice(message, { type: "snackbar" });
  }
  const { updateBlockAttributes } = useDispatch(blockEditorStore);
  const { innerBlockTracks } = useSelect(
    (select) => {
      const { getBlock: _getBlock } = select(blockEditorStore);
      return {
        innerBlockTracks: _getBlock(clientId)?.innerBlocks ?? []
      };
    },
    [clientId]
  );
  useEffect(() => {
    const seen = /* @__PURE__ */ new Set();
    let hasDuplicates = false;
    const updatedBlocks = innerBlockTracks.map((block) => {
      if (seen.has(block.attributes.uniqueId)) {
        hasDuplicates = true;
        return {
          ...block,
          attributes: {
            ...block.attributes,
            uniqueId: uuid()
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
  useEffect(() => {
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
  const onSelectTracks = useCallback(
    (media) => {
      if (!media) {
        return;
      }
      if (!Array.isArray(media)) {
        media = [media];
      }
      const trackList = media.map(getTrackAttributes);
      __unstableMarkNextChangeAsNotPersistent();
      setAttributes({
        currentTrack: trackList.length > 0 ? trackList[0].uniqueId : null
      });
      const newBlocks = trackList.map(
        (track) => createBlock("core/playlist-track", track)
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
  const onTrackEnded = useCallback(() => {
    const currentIndex = tracks.findIndex(
      (track) => track.uniqueId === currentTrack
    );
    const nextTrack = tracks[currentIndex + 1] || tracks[0];
    if (nextTrack?.uniqueId) {
      setAttributes({ currentTrack: nextTrack.uniqueId });
    }
  }, [currentTrack, tracks, setAttributes]);
  const onChangeOrder = useCallback(
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
  const hasSelectedChild = useSelect(
    (select) => select(blockEditorStore).hasSelectedInnerBlock(clientId),
    [clientId]
  );
  const hasAnySelected = isSelected || hasSelectedChild;
  const innerBlocksProps = useInnerBlocksProps(blockProps, {
    __experimentalAppenderTagName: "li",
    renderAppender: hasAnySelected && InnerBlocks.ButtonBlockAppender
  });
  if (tracks.length === 0) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        ...blockProps,
        className: clsx("is-placeholder", blockProps.className),
        children: /* @__PURE__ */ jsx(
          MediaPlaceholder,
          {
            icon: /* @__PURE__ */ jsx(BlockIcon, { icon }),
            labels: {
              title: __("Playlist"),
              instructions: __(
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(BlockControls, { group: "other", children: /* @__PURE__ */ jsx(
      MediaReplaceFlow,
      {
        name: __("Edit"),
        onSelect: onSelectTracks,
        accept: "audio/*",
        multiple: true,
        mediaIds: tracks.filter((track) => track.id).map((track) => track.id),
        allowedTypes: ALLOWED_MEDIA_TYPES,
        onError: onUploadError
      }
    ) }),
    /* @__PURE__ */ jsx(InspectorControls, { children: /* @__PURE__ */ jsxs(
      ToolsPanel,
      {
        label: __("Settings"),
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
          /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              label: __("Show Tracklist"),
              isShownByDefault: true,
              hasValue: () => showTracklist !== true,
              onDeselect: () => setAttributes({ showTracklist: true }),
              children: /* @__PURE__ */ jsx(
                ToggleControl,
                {
                  label: __("Show Tracklist"),
                  onChange: toggleAttribute("showTracklist"),
                  checked: showTracklist
                }
              )
            }
          ),
          showTracklist && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              ToolsPanelItem,
              {
                label: __("Show artist name in Tracklist"),
                isShownByDefault: true,
                hasValue: () => showArtists !== true,
                onDeselect: () => setAttributes({ showArtists: true }),
                children: /* @__PURE__ */ jsx(
                  ToggleControl,
                  {
                    label: __(
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
            /* @__PURE__ */ jsx(
              ToolsPanelItem,
              {
                label: __("Show number in Tracklist"),
                isShownByDefault: true,
                hasValue: () => showNumbers !== true,
                onDeselect: () => setAttributes({ showNumbers: true }),
                children: /* @__PURE__ */ jsx(
                  ToggleControl,
                  {
                    label: __("Show number in Tracklist"),
                    onChange: toggleAttribute(
                      "showNumbers"
                    ),
                    checked: showNumbers
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              label: __("Show images"),
              isShownByDefault: true,
              hasValue: () => showImages !== true,
              onDeselect: () => setAttributes({ showImages: true }),
              children: /* @__PURE__ */ jsx(
                ToggleControl,
                {
                  label: __("Show images"),
                  onChange: toggleAttribute("showImages"),
                  checked: showImages
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              label: __("Order"),
              isShownByDefault: true,
              hasValue: () => order !== "asc",
              onDeselect: () => setAttributes({ order: "asc" }),
              children: /* @__PURE__ */ jsx(
                SelectControl,
                {
                  __next40pxDefaultSize: true,
                  label: __("Order"),
                  value: order,
                  options: [
                    { label: __("Descending"), value: "desc" },
                    { label: __("Ascending"), value: "asc" }
                  ],
                  onChange: (value) => onChangeOrder(value)
                }
              )
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs("figure", { ...blockProps, children: [
      /* @__PURE__ */ jsx(Disabled, { isDisabled: !isSelected, children: /* @__PURE__ */ jsx(
        WaveformPlayer,
        {
          src: currentTrackData?.src,
          title: currentTrackData?.title,
          artist: currentTrackData?.artist,
          image: currentTrackData?.image,
          onEnded: onTrackEnded
        }
      ) }),
      showTracklist && /* @__PURE__ */ jsx(
        "ol",
        {
          className: clsx("wp-block-playlist__tracklist", {
            "wp-block-playlist__tracklist-show-numbers": showNumbers
          }),
          children: innerBlocksProps.children
        }
      ),
      /* @__PURE__ */ jsx(
        Caption,
        {
          attributes,
          setAttributes,
          isSelected,
          insertBlocksAfter,
          label: __("Playlist caption text"),
          showToolbarButton: isSelected,
          style: { marginTop: 16 }
        }
      )
    ] })
  ] });
};
var edit_default = PlaylistEdit;
export {
  edit_default as default
};
//# sourceMappingURL=edit.mjs.map
