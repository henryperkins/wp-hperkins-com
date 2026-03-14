// packages/block-editor/src/components/media-replace-flow/index.js
import clsx from "clsx";
import { __, _x } from "@wordpress/i18n";
import { speak } from "@wordpress/a11y";
import {
  FormFileUpload,
  NavigableMenu,
  MenuItem,
  Dropdown,
  withFilters,
  ToolbarButton
} from "@wordpress/components";
import { useSelect, withDispatch } from "@wordpress/data";
import { DOWN } from "@wordpress/keycodes";
import {
  postFeaturedImage,
  upload,
  media as mediaIcon
} from "@wordpress/icons";
import { compose } from "@wordpress/compose";
import { __unstableStripHTML as stripHTML } from "@wordpress/dom";
import { store as noticesStore } from "@wordpress/notices";
import { useMemo } from "@wordpress/element";
import MediaUpload from "../media-upload/index.mjs";
import MediaUploadCheck from "../media-upload/check.mjs";
import LinkControl from "../link-control/index.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import { getComputedAcceptAttribute } from "../media-placeholder/utils.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var noop = () => {
};
var uniqueId = 0;
var MediaReplaceFlow = ({
  mediaURL,
  mediaId,
  mediaIds,
  allowedTypes,
  accept,
  onError,
  onSelect,
  onSelectURL,
  onReset,
  onToggleFeaturedImage,
  useFeaturedImage,
  onFilesUpload = noop,
  name = __("Replace"),
  createNotice,
  removeNotice,
  children,
  multiple = false,
  addToGallery,
  handleUpload = true,
  variant,
  popoverProps,
  renderToggle,
  className
}) => {
  const { mediaUpload, allowedMimeTypes } = useSelect((select) => {
    const { getSettings } = select(blockEditorStore);
    const settings = getSettings();
    return {
      mediaUpload: settings.mediaUpload,
      allowedMimeTypes: settings.allowedMimeTypes
    };
  }, []);
  const errorNoticeID = `block-editor/media-replace-flow/error-notice/${++uniqueId}`;
  const computedAccept = useMemo(
    () => getComputedAcceptAttribute(
      allowedTypes,
      allowedMimeTypes,
      accept
    ),
    [allowedTypes, allowedMimeTypes, accept]
  );
  const onUploadError = (message) => {
    const safeMessage = stripHTML(message);
    if (onError) {
      onError(safeMessage);
      return;
    }
    setTimeout(() => {
      createNotice("error", safeMessage, {
        speak: true,
        id: errorNoticeID,
        isDismissible: true
      });
    }, 1e3);
  };
  const selectMedia = (media, closeMenu) => {
    if (useFeaturedImage && onToggleFeaturedImage) {
      onToggleFeaturedImage();
    }
    closeMenu();
    onSelect(media);
    speak(__("The media file has been replaced"));
    removeNotice(errorNoticeID);
  };
  const uploadFiles = (event, closeMenu) => {
    const files = event.target.files;
    if (!handleUpload) {
      closeMenu();
      return onSelect(files);
    }
    onFilesUpload(files);
    mediaUpload({
      allowedTypes,
      filesList: files,
      onFileChange: ([media]) => {
        selectMedia(media, closeMenu);
      },
      onError: onUploadError
    });
  };
  const openOnArrowDown = (event) => {
    if (event.keyCode === DOWN) {
      event.preventDefault();
      event.target.click();
    }
  };
  const onlyAllowsImages = () => {
    if (!allowedTypes || allowedTypes.length === 0) {
      return false;
    }
    return allowedTypes.every(
      (allowedType) => allowedType === "image" || allowedType.startsWith("image/")
    );
  };
  const gallery = multiple && onlyAllowsImages();
  const mergedPopoverProps = {
    ...popoverProps,
    variant
  };
  return /* @__PURE__ */ jsx(
    Dropdown,
    {
      popoverProps: mergedPopoverProps,
      className,
      contentClassName: clsx(
        "block-editor-media-replace-flow__options",
        variant && `is-variant-${variant}`
      ),
      renderToggle: ({ isOpen, onToggle }) => {
        if (renderToggle) {
          return renderToggle({
            "aria-expanded": isOpen,
            "aria-haspopup": "true",
            onClick: onToggle,
            onKeyDown: openOnArrowDown,
            children: name
          });
        }
        return /* @__PURE__ */ jsx(
          ToolbarButton,
          {
            "aria-expanded": isOpen,
            "aria-haspopup": "true",
            onClick: onToggle,
            onKeyDown: openOnArrowDown,
            children: name
          }
        );
      },
      renderContent: ({ onClose }) => /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs(NavigableMenu, { className: "block-editor-media-replace-flow__media-upload-menu", children: [
          /* @__PURE__ */ jsxs(MediaUploadCheck, { children: [
            /* @__PURE__ */ jsx(
              MediaUpload,
              {
                gallery,
                addToGallery,
                multiple,
                value: multiple ? mediaIds : mediaId,
                onSelect: (media) => selectMedia(media, onClose),
                allowedTypes,
                render: ({ open }) => /* @__PURE__ */ jsx(
                  MenuItem,
                  {
                    icon: mediaIcon,
                    onClick: open,
                    children: __("Open Media Library")
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx(
              FormFileUpload,
              {
                onChange: (event) => {
                  uploadFiles(event, onClose);
                },
                accept: computedAccept,
                multiple: !!multiple,
                render: ({ openFileDialog }) => {
                  return /* @__PURE__ */ jsx(
                    MenuItem,
                    {
                      icon: upload,
                      onClick: () => {
                        openFileDialog();
                      },
                      children: _x("Upload", "verb")
                    }
                  );
                }
              }
            )
          ] }),
          onToggleFeaturedImage && /* @__PURE__ */ jsx(
            MenuItem,
            {
              icon: postFeaturedImage,
              onClick: onToggleFeaturedImage,
              isPressed: useFeaturedImage,
              children: __("Use featured image")
            }
          ),
          typeof children === "function" ? children({ onClose }) : children,
          mediaURL && onReset && /* @__PURE__ */ jsx(
            MenuItem,
            {
              onClick: () => {
                onReset();
                onClose();
              },
              children: __("Reset")
            }
          )
        ] }),
        onSelectURL && /* @__PURE__ */ jsxs("form", { className: "block-editor-media-flow__url-input", children: [
          /* @__PURE__ */ jsx("span", { className: "block-editor-media-replace-flow__image-url-label", children: __("Current media URL:") }),
          /* @__PURE__ */ jsx(
            LinkControl,
            {
              value: { url: mediaURL },
              settings: [],
              showSuggestions: false,
              onChange: ({ url }) => {
                onSelectURL(url);
              },
              searchInputPlaceholder: __(
                "Paste or type URL"
              )
            }
          )
        ] })
      ] })
    }
  );
};
var media_replace_flow_default = compose([
  withDispatch((dispatch) => {
    const { createNotice, removeNotice } = dispatch(noticesStore);
    return {
      createNotice,
      removeNotice
    };
  }),
  withFilters("editor.MediaReplaceFlow")
])(MediaReplaceFlow);
export {
  media_replace_flow_default as default
};
//# sourceMappingURL=index.mjs.map
