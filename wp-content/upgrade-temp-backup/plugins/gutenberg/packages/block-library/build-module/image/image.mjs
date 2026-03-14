// packages/block-library/src/image/image.js
import { isBlobURL } from "@wordpress/blob";
import {
  ExternalLink,
  FocalPointPicker,
  ResizableBox,
  Spinner,
  TextareaControl,
  TextControl,
  ToolbarButton,
  ToolbarGroup,
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem,
  __experimentalUseCustomUnits as useCustomUnits,
  Placeholder,
  MenuItem,
  ToolbarItem,
  DropdownMenu,
  Popover
} from "@wordpress/components";
import {
  useMergeRefs,
  useResizeObserver,
  useViewportMatch
} from "@wordpress/compose";
import { useSelect, useDispatch } from "@wordpress/data";
import {
  BlockControls,
  InspectorControls,
  __experimentalImageURLInputUI as ImageURLInputUI,
  MediaReplaceFlow,
  store as blockEditorStore,
  useSettings,
  __experimentalImageEditor as ImageEditor,
  __experimentalUseBorderProps as useBorderProps,
  __experimentalGetShadowClassesAndStyles as getShadowClassesAndStyles,
  privateApis as blockEditorPrivateApis,
  BlockSettingsMenuControls
} from "@wordpress/block-editor";
import {
  createInterpolateElement,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "@wordpress/element";
import { __, _x, sprintf, isRTL } from "@wordpress/i18n";
import { getFilename } from "@wordpress/url";
import { getBlockBindingsSource, switchToBlockType } from "@wordpress/blocks";
import { crop, overlayText, upload, chevronDown } from "@wordpress/icons";
import { store as noticesStore } from "@wordpress/notices";
import { store as coreStore } from "@wordpress/core-data";
import { unlock } from "../lock-unlock.mjs";
import { createUpgradedEmbedBlock } from "../embed/util.mjs";
import { isExternalImage } from "./edit.mjs";
import { Caption } from "../utils/caption.mjs";
import { MediaControl } from "../utils/media-control.mjs";
import { useToolsPanelDropdownMenuProps } from "../utils/hooks.mjs";
import {
  MIN_SIZE,
  ALLOWED_MEDIA_TYPES,
  SIZED_LAYOUTS,
  DEFAULT_MEDIA_SIZE_SLUG
} from "./constants.mjs";
import { evalAspectRatio, mediaPosition } from "./utils.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { DimensionsTool, ResolutionTool } = unlock(blockEditorPrivateApis);
var scaleOptions = [
  {
    value: "cover",
    label: _x("Cover", "Scale option for dimensions control"),
    help: __("Image covers the space evenly.")
  },
  {
    value: "contain",
    label: _x("Contain", "Scale option for dimensions control"),
    help: __("Image is contained without distortion.")
  }
];
var WRITEMODE_POPOVER_PROPS = {
  placement: "bottom-start"
};
var ImageWrapper = ({ href, children }) => {
  if (!href) {
    return children;
  }
  return /* @__PURE__ */ jsx(
    "a",
    {
      href,
      onClick: (event) => event.preventDefault(),
      "aria-disabled": true,
      style: {
        // When the Image block is linked,
        // it's wrapped with a disabled <a /> tag.
        // Restore cursor style so it doesn't appear 'clickable'
        // and remove pointer events. Safari needs the display property.
        pointerEvents: "none",
        cursor: "default",
        display: "inline"
      },
      children
    }
  );
};
function ContentOnlyControls({
  attributes,
  setAttributes,
  lockAltControls,
  lockAltControlsMessage,
  lockTitleControls,
  lockTitleControlsMessage
}) {
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [isAltDialogOpen, setIsAltDialogOpen] = useState(false);
  const [isTitleDialogOpen, setIsTitleDialogOpen] = useState(false);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(ToolbarItem, { ref: setPopoverAnchor, children: (toggleProps) => /* @__PURE__ */ jsx(
      DropdownMenu,
      {
        icon: chevronDown,
        label: __("More"),
        toggleProps: {
          ...toggleProps,
          description: __("Displays more controls.")
        },
        popoverProps: WRITEMODE_POPOVER_PROPS,
        children: ({ onClose }) => /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            MenuItem,
            {
              onClick: () => {
                setIsAltDialogOpen(true);
                onClose();
              },
              "aria-haspopup": "dialog",
              children: _x(
                "Alternative text",
                "Alternative text for an image. Block toolbar label, a low character count is preferred."
              )
            }
          ),
          /* @__PURE__ */ jsx(
            MenuItem,
            {
              onClick: () => {
                setIsTitleDialogOpen(true);
                onClose();
              },
              "aria-haspopup": "dialog",
              children: __("Title text")
            }
          )
        ] })
      }
    ) }),
    isAltDialogOpen && /* @__PURE__ */ jsx(
      Popover,
      {
        placement: "bottom-start",
        anchor: popoverAnchor,
        onClose: () => setIsAltDialogOpen(false),
        offset: 13,
        variant: "toolbar",
        children: /* @__PURE__ */ jsx("div", { className: "wp-block-image__toolbar_content_textarea__container", children: /* @__PURE__ */ jsx(
          TextareaControl,
          {
            className: "wp-block-image__toolbar_content_textarea",
            label: __("Alternative text"),
            value: attributes.alt || "",
            onChange: (value) => setAttributes({ alt: value }),
            disabled: lockAltControls,
            help: lockAltControls ? /* @__PURE__ */ jsx(Fragment, { children: lockAltControlsMessage }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(
                ExternalLink,
                {
                  href: (
                    // translators: Localized tutorial, if one exists. W3C Web Accessibility Initiative link has list of existing translations.
                    __(
                      "https://www.w3.org/WAI/tutorials/images/decision-tree/"
                    )
                  ),
                  children: __(
                    "Describe the purpose of the image."
                  )
                }
              ),
              /* @__PURE__ */ jsx("br", {}),
              __("Leave empty if decorative.")
            ] })
          }
        ) })
      }
    ),
    isTitleDialogOpen && /* @__PURE__ */ jsx(
      Popover,
      {
        placement: "bottom-start",
        anchor: popoverAnchor,
        onClose: () => setIsTitleDialogOpen(false),
        offset: 13,
        variant: "toolbar",
        children: /* @__PURE__ */ jsx("div", { className: "wp-block-image__toolbar_content_textarea__container", children: /* @__PURE__ */ jsx(
          TextControl,
          {
            __next40pxDefaultSize: true,
            className: "wp-block-image__toolbar_content_textarea",
            label: __("Title attribute"),
            value: attributes.title || "",
            onChange: (value) => setAttributes({
              title: value
            }),
            disabled: lockTitleControls,
            help: lockTitleControls ? /* @__PURE__ */ jsx(Fragment, { children: lockTitleControlsMessage }) : createInterpolateElement(
              __(
                "Describe the role of this image on the page. <a>(Note: many devices and browsers do not display this text.)</a>"
              ),
              {
                a: /* @__PURE__ */ jsx(ExternalLink, { href: "https://www.w3.org/TR/html52/dom.html#the-title-attribute" })
              }
            )
          }
        ) })
      }
    )
  ] });
}
function Image({
  temporaryURL,
  isSideloading,
  attributes,
  setAttributes,
  isSingleSelected,
  insertBlocksAfter,
  onReplace,
  onSelectImage,
  onSelectURL,
  onUploadError,
  context,
  clientId,
  blockEditingMode,
  parentLayoutType,
  maxContentWidth
}) {
  const {
    url = "",
    alt,
    align,
    id,
    href,
    rel,
    linkClass,
    linkDestination,
    title,
    width,
    height,
    aspectRatio,
    scale,
    focalPoint,
    linkTarget,
    sizeSlug,
    lightbox,
    metadata
  } = attributes;
  const [imageElement, setImageElement] = useState();
  const [resizeDelta, setResizeDelta] = useState(null);
  const [pixelSize, setPixelSize] = useState({});
  const [offsetTop, setOffsetTop] = useState(0);
  const setResizeObserved = useResizeObserver(([entry]) => {
    if (!resizeDelta) {
      const [box] = entry.borderBoxSize;
      setPixelSize({ width: box.inlineSize, height: box.blockSize });
    }
    setOffsetTop(entry.target.offsetTop);
  });
  const effectResizeableBoxPlacement = useCallback(() => {
    setOffsetTop(imageElement?.offsetTop ?? 0);
  }, [imageElement]);
  const setRefs = useMergeRefs([setImageElement, setResizeObserved]);
  const { allowResize = true } = context;
  const { image, canUserEdit } = useSelect(
    (select) => {
      const imageRecord = id && isSingleSelected ? select(coreStore).getEntityRecord(
        "postType",
        "attachment",
        id,
        { context: "view" }
      ) : null;
      let canEdit = false;
      if (imageRecord && window?.__experimentalMediaEditor) {
        canEdit = !!select(coreStore).canUser("update", {
          kind: "postType",
          name: "attachment",
          id
        });
      }
      return {
        image: imageRecord,
        canUserEdit: canEdit
      };
    },
    [id, isSingleSelected]
  );
  const { canInsertCover, imageEditing, imageSizes, maxWidth } = useSelect(
    (select) => {
      const { getBlockRootClientId, canInsertBlockType, getSettings: getSettings2 } = select(blockEditorStore);
      const rootClientId = getBlockRootClientId(clientId);
      const settings = getSettings2();
      return {
        imageEditing: settings.imageEditing,
        imageSizes: settings.imageSizes,
        maxWidth: settings.maxWidth,
        canInsertCover: canInsertBlockType(
          "core/cover",
          rootClientId
        )
      };
    },
    [clientId]
  );
  const { getBlock, getSettings } = useSelect(blockEditorStore);
  const onNavigateToEntityRecord = getSettings().onNavigateToEntityRecord;
  const { replaceBlocks, toggleSelection } = useDispatch(blockEditorStore);
  const { createErrorNotice, createSuccessNotice } = useDispatch(noticesStore);
  const { editEntityRecord } = useDispatch(coreStore);
  const isLargeViewport = useViewportMatch("medium");
  const isWideAligned = ["wide", "full"].includes(align);
  const [
    { loadedNaturalWidth, loadedNaturalHeight },
    setLoadedNaturalSize
  ] = useState({});
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [externalBlob, setExternalBlob] = useState();
  const [hasImageErrored, setHasImageErrored] = useState(false);
  const hasNonContentControls = blockEditingMode === "default";
  const isContentOnlyMode = blockEditingMode === "contentOnly";
  const showDimensionsControls = allowResize && hasNonContentControls;
  const isResizable = allowResize && hasNonContentControls && !isWideAligned && isLargeViewport;
  const imageSizeOptions = imageSizes.filter(
    ({ slug }) => image?.media_details?.sizes?.[slug]?.source_url
  ).map(({ name, slug }) => ({ value: slug, label: name }));
  useEffect(() => {
    if (!isExternalImage(id, url) || !isSingleSelected || !getSettings().mediaUpload) {
      setExternalBlob();
      return;
    }
    if (externalBlob) {
      return;
    }
    window.fetch(url.includes("?") ? url : url + "?").then((response) => response.blob()).then((blob) => setExternalBlob(blob)).catch(() => {
    });
  }, [id, url, isSingleSelected, externalBlob, getSettings]);
  const { naturalWidth, naturalHeight } = useMemo(() => {
    return {
      naturalWidth: imageElement?.naturalWidth || loadedNaturalWidth || void 0,
      naturalHeight: imageElement?.naturalHeight || loadedNaturalHeight || void 0
    };
  }, [loadedNaturalWidth, loadedNaturalHeight, imageElement?.complete]);
  function onImageError() {
    setHasImageErrored(true);
    const embedBlock = createUpgradedEmbedBlock({ attributes: { url } });
    if (void 0 !== embedBlock) {
      onReplace(embedBlock);
    }
  }
  function onImageLoad(event) {
    setHasImageErrored(false);
    setLoadedNaturalSize({
      loadedNaturalWidth: event.target?.naturalWidth,
      loadedNaturalHeight: event.target?.naturalHeight
    });
  }
  function onSetHref(props) {
    setAttributes(props);
  }
  function onSetLightbox(enable) {
    if (enable && !lightboxSetting?.enabled) {
      setAttributes({
        lightbox: { enabled: true }
      });
    } else if (!enable && lightboxSetting?.enabled) {
      setAttributes({
        lightbox: { enabled: false }
      });
    } else {
      setAttributes({
        lightbox: void 0
      });
    }
  }
  function resetLightbox() {
    if (lightboxSetting?.enabled && lightboxSetting?.allowEditing) {
      setAttributes({
        lightbox: { enabled: false }
      });
    } else {
      setAttributes({
        lightbox: void 0
      });
    }
  }
  function onSetTitle(value) {
    setAttributes({ title: value });
  }
  function updateAlt(newAlt) {
    setAttributes({ alt: newAlt });
  }
  const imperativeFocalPointPreview = (value) => {
    if (imageElement) {
      imageElement.style.setProperty(
        "object-position",
        mediaPosition(value)
      );
    }
  };
  function updateImage(newSizeSlug) {
    const newUrl = image?.media_details?.sizes?.[newSizeSlug]?.source_url;
    if (!newUrl) {
      return null;
    }
    setAttributes({
      url: newUrl,
      sizeSlug: newSizeSlug
    });
  }
  function uploadExternal() {
    const { mediaUpload } = getSettings();
    if (!mediaUpload) {
      return;
    }
    mediaUpload({
      filesList: [externalBlob],
      onFileChange([img2]) {
        onSelectImage(img2);
        if (isBlobURL(img2.url)) {
          return;
        }
        setExternalBlob();
        createSuccessNotice(__("Image uploaded."), {
          type: "snackbar"
        });
      },
      allowedTypes: ALLOWED_MEDIA_TYPES,
      onError(message) {
        createErrorNotice(message, { type: "snackbar" });
      }
    });
  }
  useEffect(() => {
    if (!isSingleSelected) {
      setIsEditingImage(false);
    }
  }, [isSingleSelected]);
  const canEditImage = id && naturalWidth && naturalHeight && imageEditing;
  const allowCrop = isSingleSelected && canEditImage && !isEditingImage && !isContentOnlyMode;
  function switchToCover() {
    replaceBlocks(
      clientId,
      switchToBlockType(getBlock(clientId), "core/cover")
    );
  }
  const dimensionsUnitsOptions = useCustomUnits({
    availableUnits: ["px"]
  });
  const [lightboxSetting] = useSettings("lightbox");
  const showLightboxSetting = (
    // If a block-level override is set, we should give users the option to
    // remove that override, even if the lightbox UI is disabled in the settings.
    !!lightbox && lightbox?.enabled !== lightboxSetting?.enabled || lightboxSetting?.allowEditing
  );
  const lightboxChecked = !!lightbox?.enabled || !lightbox && !!lightboxSetting?.enabled;
  const dropdownMenuProps = useToolsPanelDropdownMenuProps();
  const dimensionsControl = showDimensionsControls && (SIZED_LAYOUTS.includes(parentLayoutType) ? /* @__PURE__ */ jsx(
    DimensionsTool,
    {
      panelId: clientId,
      value: { aspectRatio },
      onChange: ({ aspectRatio: newAspectRatio }) => {
        setAttributes({
          aspectRatio: newAspectRatio,
          scale: "cover"
        });
      },
      defaultAspectRatio: "auto",
      tools: ["aspectRatio"]
    }
  ) : /* @__PURE__ */ jsx(
    DimensionsTool,
    {
      panelId: clientId,
      value: { width, height, scale, aspectRatio },
      onChange: ({
        width: newWidth,
        height: newHeight,
        scale: newScale,
        aspectRatio: newAspectRatio
      }) => {
        setAttributes({
          // CSS includes `height: auto`, but we need
          // `width: auto` to fix the aspect ratio when
          // only height is set due to the width and
          // height attributes set via the server.
          width: !newWidth && newHeight ? "auto" : newWidth,
          height: newHeight,
          scale: newScale,
          aspectRatio: newAspectRatio
        });
      },
      defaultScale: "cover",
      defaultAspectRatio: "auto",
      scaleOptions,
      unitsOptions: dimensionsUnitsOptions,
      tools: isWideAligned ? ["aspectRatio", "scale"] : ["aspectRatio", "widthHeight", "scale"]
    }
  ));
  const resetSettings = () => {
    setAttributes({
      lightbox: void 0
    });
    updateImage(DEFAULT_MEDIA_SIZE_SLUG);
  };
  const arePatternOverridesEnabled = metadata?.bindings?.__default?.source === "core/pattern-overrides";
  const {
    lockUrlControls = false,
    lockHrefControls = false,
    lockAltControls = false,
    lockAltControlsMessage,
    lockTitleControls = false,
    lockTitleControlsMessage,
    hideCaptionControls = false
  } = useSelect(
    (select) => {
      if (!isSingleSelected) {
        return {};
      }
      const {
        url: urlBinding,
        alt: altBinding,
        title: titleBinding,
        caption: captionBinding
      } = metadata?.bindings || {};
      const hasParentPattern = !!context["pattern/overrides"];
      const urlBindingSource = getBlockBindingsSource(
        urlBinding?.source
      );
      const altBindingSource = getBlockBindingsSource(
        altBinding?.source
      );
      const titleBindingSource = getBlockBindingsSource(
        titleBinding?.source
      );
      return {
        lockUrlControls: !!urlBinding && !urlBindingSource?.canUserEditValue?.({
          select,
          context,
          args: urlBinding?.args
        }),
        lockHrefControls: (
          // Disable editing the link of the URL if the image is inside a pattern instance.
          // This is a temporary solution until we support overriding the link on the frontend.
          hasParentPattern || arePatternOverridesEnabled
        ),
        hideCaptionControls: !!captionBinding,
        lockAltControls: !!altBinding && !altBindingSource?.canUserEditValue?.({
          select,
          context,
          args: altBinding?.args
        }),
        lockAltControlsMessage: altBindingSource?.label ? sprintf(
          /* translators: %s: Label of the bindings source. */
          __("Connected to %s"),
          altBindingSource.label
        ) : __("Connected to dynamic data"),
        lockTitleControls: !!titleBinding && !titleBindingSource?.canUserEditValue?.({
          select,
          context,
          args: titleBinding?.args
        }),
        lockTitleControlsMessage: titleBindingSource?.label ? sprintf(
          /* translators: %s: Label of the bindings source. */
          __("Connected to %s"),
          titleBindingSource.label
        ) : __("Connected to dynamic data")
      };
    },
    [
      arePatternOverridesEnabled,
      context,
      isSingleSelected,
      metadata?.bindings
    ]
  );
  const showUrlInput = isSingleSelected && !isEditingImage && !lockHrefControls && !lockUrlControls;
  const showCoverControls = isSingleSelected && canInsertCover && !isContentOnlyMode;
  const showBlockControls = showUrlInput || allowCrop || showCoverControls;
  const mediaReplaceFlow = isSingleSelected && !isEditingImage && !lockUrlControls && // For contentOnly mode, put this button in its own area so it has borders around it.
  /* @__PURE__ */ jsx(BlockControls, { group: isContentOnlyMode ? "inline" : "other", children: /* @__PURE__ */ jsx(
    MediaReplaceFlow,
    {
      mediaId: id,
      mediaURL: url,
      allowedTypes: ALLOWED_MEDIA_TYPES,
      onSelect: onSelectImage,
      onSelectURL,
      onError: onUploadError,
      name: !url ? __("Add image") : __("Replace"),
      onReset: () => onSelectImage(void 0),
      variant: "toolbar"
    }
  ) });
  const hasDataFormBlockFields = window?.__experimentalContentOnlyInspectorFields;
  const editMediaButton = window?.__experimentalMediaEditor && id && isSingleSelected && canUserEdit && !isExternalImage(id, url) && !isEditingImage && onNavigateToEntityRecord && /* @__PURE__ */ jsx(BlockControls, { group: "other", children: /* @__PURE__ */ jsx(
    ToolbarButton,
    {
      onClick: () => {
        onNavigateToEntityRecord({
          postId: id,
          postType: "attachment"
        });
      },
      children: __("Edit media")
    }
  ) });
  const controls = /* @__PURE__ */ jsxs(Fragment, { children: [
    showBlockControls && /* @__PURE__ */ jsxs(BlockControls, { group: "block", children: [
      showUrlInput && /* @__PURE__ */ jsx(
        ImageURLInputUI,
        {
          url: href || "",
          onChangeUrl: onSetHref,
          linkDestination,
          mediaUrl: image && image.source_url || url,
          mediaLink: image && image.link,
          linkTarget,
          linkClass,
          rel,
          showLightboxSetting,
          lightboxEnabled: lightboxChecked,
          onSetLightbox,
          resetLightbox
        }
      ),
      allowCrop && /* @__PURE__ */ jsx(
        ToolbarButton,
        {
          onClick: () => setIsEditingImage(true),
          icon: crop,
          label: __("Crop")
        }
      ),
      showCoverControls && /* @__PURE__ */ jsx(
        ToolbarButton,
        {
          icon: overlayText,
          label: __("Add text over image"),
          onClick: switchToCover
        }
      )
    ] }),
    isSingleSelected && externalBlob && /* @__PURE__ */ jsx(BlockControls, { children: /* @__PURE__ */ jsx(ToolbarGroup, { children: /* @__PURE__ */ jsx(
      ToolbarButton,
      {
        onClick: uploadExternal,
        icon: upload,
        label: __("Upload to Media Library")
      }
    ) }) }),
    isContentOnlyMode && // Add some extra controls for content attributes when content only mode is active.
    // With content only mode active, the inspector is hidden, so users need another way
    // to edit these attributes.
    /* @__PURE__ */ jsx(BlockControls, { group: "block", children: /* @__PURE__ */ jsx(
      ContentOnlyControls,
      {
        attributes,
        setAttributes,
        lockAltControls,
        lockAltControlsMessage,
        lockTitleControls,
        lockTitleControlsMessage
      }
    ) }),
    !hasDataFormBlockFields && isSingleSelected && /* @__PURE__ */ jsx(InspectorControls, { group: "content", children: /* @__PURE__ */ jsxs(
      ToolsPanel,
      {
        label: __("Media"),
        resetAll: () => onSelectImage(void 0),
        dropdownMenuProps,
        children: [
          !lockUrlControls && /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              label: __("Image"),
              hasValue: () => !!url,
              onDeselect: () => onSelectImage(void 0),
              isShownByDefault: true,
              children: /* @__PURE__ */ jsx(
                MediaControl,
                {
                  mediaId: id,
                  mediaUrl: url,
                  alt,
                  filename: image?.media_details?.sizes?.full?.file || image?.slug || getFilename(url),
                  allowedTypes: ALLOWED_MEDIA_TYPES,
                  onSelect: onSelectImage,
                  onSelectURL,
                  onError: onUploadError,
                  onReset: () => onSelectImage(void 0),
                  isUploading: !!temporaryURL || isSideloading,
                  emptyLabel: __("Add image")
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              label: __("Alternative text"),
              isShownByDefault: true,
              hasValue: () => !!alt,
              onDeselect: () => setAttributes({ alt: void 0 }),
              children: /* @__PURE__ */ jsx(
                TextareaControl,
                {
                  label: __("Alternative text"),
                  value: alt || "",
                  onChange: updateAlt,
                  readOnly: lockAltControls,
                  help: lockAltControls ? /* @__PURE__ */ jsx(Fragment, { children: lockAltControlsMessage }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(
                      ExternalLink,
                      {
                        href: (
                          // translators: Localized tutorial, if one exists. W3C Web Accessibility Initiative link has list of existing translations.
                          __(
                            "https://www.w3.org/WAI/tutorials/images/decision-tree/"
                          )
                        ),
                        children: __(
                          "Describe the purpose of the image."
                        )
                      }
                    ),
                    /* @__PURE__ */ jsx("br", {}),
                    __(
                      "Leave empty if decorative."
                    )
                  ] })
                }
              )
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs(
      InspectorControls,
      {
        group: "dimensions",
        resetAllFilter: (attrs) => ({
          ...attrs,
          aspectRatio: void 0,
          width: void 0,
          height: void 0,
          scale: void 0,
          focalPoint: void 0
        }),
        children: [
          dimensionsControl,
          url && scale && /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              label: __("Focal point"),
              isShownByDefault: true,
              hasValue: () => !!focalPoint,
              onDeselect: () => setAttributes({
                focalPoint: void 0
              }),
              panelId: clientId,
              children: /* @__PURE__ */ jsx(
                FocalPointPicker,
                {
                  label: __("Focal point"),
                  url,
                  value: focalPoint,
                  onDragStart: imperativeFocalPointPreview,
                  onDrag: imperativeFocalPointPreview,
                  onChange: (newFocalPoint) => setAttributes({
                    focalPoint: newFocalPoint
                  })
                }
              )
            }
          )
        ]
      }
    ),
    !!imageSizeOptions.length && /* @__PURE__ */ jsx(InspectorControls, { children: /* @__PURE__ */ jsx(
      ToolsPanel,
      {
        label: __("Settings"),
        resetAll: resetSettings,
        dropdownMenuProps,
        children: /* @__PURE__ */ jsx(
          ResolutionTool,
          {
            value: sizeSlug,
            defaultValue: DEFAULT_MEDIA_SIZE_SLUG,
            onChange: updateImage,
            options: imageSizeOptions
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsx(InspectorControls, { group: "advanced", children: /* @__PURE__ */ jsx(
      TextControl,
      {
        __next40pxDefaultSize: true,
        label: __("Title attribute"),
        value: title || "",
        onChange: onSetTitle,
        readOnly: lockTitleControls,
        help: lockTitleControls ? /* @__PURE__ */ jsx(Fragment, { children: lockTitleControlsMessage }) : createInterpolateElement(
          __(
            "Describe the role of this image on the page. <a>(Note: many devices and browsers do not display this text.)</a>"
          ),
          {
            a: /* @__PURE__ */ jsx(ExternalLink, { href: "https://www.w3.org/TR/html52/dom.html#the-title-attribute" })
          }
        )
      }
    ) })
  ] });
  const filename = getFilename(url);
  let defaultedAlt;
  if (alt) {
    defaultedAlt = alt;
  } else if (filename) {
    defaultedAlt = sprintf(
      /* translators: %s: file name */
      __("This image has an empty alt attribute; its file name is %s"),
      filename
    );
  } else {
    defaultedAlt = __("This image has an empty alt attribute");
  }
  const borderProps = useBorderProps(attributes);
  const shadowProps = getShadowClassesAndStyles(attributes);
  const isRounded = attributes.className?.includes("is-style-rounded");
  const { postType, postId, queryId } = context;
  const isDescendentOfQueryLoop = Number.isFinite(queryId);
  let img = temporaryURL && hasImageErrored ? (
    // Show a placeholder during upload when the blob URL can't be loaded. This can
    // happen when the user uploads a HEIC image in a browser that doesn't support them.
    /* @__PURE__ */ jsx(
      Placeholder,
      {
        className: "wp-block-image__placeholder",
        withIllustration: true,
        children: /* @__PURE__ */ jsx(Spinner, {})
      }
    )
  ) : /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "img",
      {
        src: temporaryURL || url,
        alt: defaultedAlt,
        onError: onImageError,
        onLoad: onImageLoad,
        ref: setRefs,
        className: borderProps.className,
        width: naturalWidth,
        height: naturalHeight,
        style: {
          aspectRatio,
          ...resizeDelta ? {
            width: pixelSize.width + resizeDelta.width,
            height: pixelSize.height + resizeDelta.height
          } : { width, height },
          objectFit: scale,
          objectPosition: focalPoint && scale ? mediaPosition(focalPoint) : void 0,
          ...borderProps.style,
          ...shadowProps.style
        }
      }
    ),
    (temporaryURL || isSideloading) && /* @__PURE__ */ jsx(Spinner, {})
  ] });
  if (canEditImage && isEditingImage) {
    img = /* @__PURE__ */ jsx(ImageWrapper, { href, children: /* @__PURE__ */ jsx(
      ImageEditor,
      {
        id,
        url,
        ...pixelSize,
        naturalHeight,
        naturalWidth,
        onSaveImage: (imageAttributes) => setAttributes(imageAttributes),
        onFinishEditing: () => {
          setIsEditingImage(false);
        },
        borderProps: isRounded ? void 0 : borderProps
      }
    ) });
  } else {
    img = /* @__PURE__ */ jsx(ImageWrapper, { href, children: img });
  }
  let resizableBox;
  if (isResizable && isSingleSelected && !isEditingImage && !SIZED_LAYOUTS.includes(parentLayoutType)) {
    const numericRatio = aspectRatio && evalAspectRatio(aspectRatio);
    const customRatio = pixelSize.width / pixelSize.height;
    const naturalRatio = naturalWidth / naturalHeight;
    const ratio = numericRatio || customRatio || naturalRatio || 1;
    const minWidth = naturalWidth < naturalHeight ? MIN_SIZE : MIN_SIZE * ratio;
    const minHeight = naturalHeight < naturalWidth ? MIN_SIZE : MIN_SIZE / ratio;
    const maxWidthBuffer = maxWidth * 2.5;
    const maxResizeWidth = maxContentWidth || maxWidthBuffer;
    let showRightHandle = false;
    let showLeftHandle = false;
    if (align === "center") {
      showRightHandle = true;
      showLeftHandle = true;
    } else if (isRTL()) {
      if (align === "left") {
        showRightHandle = true;
      } else {
        showLeftHandle = true;
      }
    } else {
      if (align === "right") {
        showLeftHandle = true;
      } else {
        showRightHandle = true;
      }
    }
    resizableBox = /* @__PURE__ */ jsx(
      ResizableBox,
      {
        ref: effectResizeableBoxPlacement,
        style: {
          position: "absolute",
          // To match the vertical-align: bottom of the img (from style.scss)
          // syncs the top with the img. This matters when the img height is
          // less than the line-height.
          inset: `${offsetTop}px 0 0 0`
        },
        size: pixelSize,
        minWidth,
        maxWidth: maxResizeWidth,
        minHeight,
        maxHeight: maxResizeWidth / ratio,
        lockAspectRatio: ratio,
        enable: {
          top: false,
          right: showRightHandle,
          bottom: true,
          left: showLeftHandle
        },
        onResizeStart: () => {
          toggleSelection(false);
        },
        onResize: (event, direction, elt, delta) => {
          setResizeDelta(delta);
        },
        onResizeStop: (event, direction, elt, delta) => {
          toggleSelection(true);
          setResizeDelta(null);
          setPixelSize((current) => ({
            width: current.width + delta.width,
            height: current.height + delta.height
          }));
          if (maxContentWidth && // Only do this if the image is bigger than the container to prevent it from being squished.
          // TODO: Remove this check if the image support setting 100% width.
          naturalWidth >= maxContentWidth && Math.abs(elt.offsetWidth - maxContentWidth) < 10) {
            setAttributes({
              width: void 0,
              height: void 0
            });
            return;
          }
          setAttributes({
            width: `${elt.offsetWidth}px`,
            height: "auto",
            aspectRatio: ratio === naturalRatio ? void 0 : String(ratio)
          });
        },
        resizeRatio: align === "center" ? 2 : 1
      }
    );
  }
  if (!url && !temporaryURL) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      mediaReplaceFlow,
      controls
    ] });
  }
  const setPostFeatureImage = () => {
    editEntityRecord("postType", postType, postId, {
      featured_media: id
    });
    createSuccessNotice(__("Post featured image updated."), {
      type: "snackbar"
    });
  };
  const featuredImageControl = !isDescendentOfQueryLoop && postId && id ? /* @__PURE__ */ jsx(BlockSettingsMenuControls, { children: ({ canEdit, selectedClientIds }) => canEdit && selectedClientIds.length === 1 && clientId === selectedClientIds[0] && /* @__PURE__ */ jsx(MenuItem, { onClick: setPostFeatureImage, children: __("Set as featured image") }) }) : null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    editMediaButton,
    mediaReplaceFlow,
    controls,
    featuredImageControl,
    img,
    resizableBox,
    /* @__PURE__ */ jsx(
      Caption,
      {
        attributes,
        setAttributes,
        isSelected: isSingleSelected,
        insertBlocksAfter,
        label: __("Image caption text"),
        showToolbarButton: isSingleSelected && (hasNonContentControls || isContentOnlyMode) && !hideCaptionControls
      }
    )
  ] });
}
export {
  Image as default
};
//# sourceMappingURL=image.mjs.map
