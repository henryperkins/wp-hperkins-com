// packages/block-library/src/utils/media-control.js
import {
  Button,
  DropZone,
  FlexItem,
  Spinner,
  __experimentalItemGroup as ItemGroup,
  __experimentalHStack as HStack,
  __experimentalTruncate as Truncate
} from "@wordpress/components";
import {
  MediaReplaceFlow,
  store as blockEditorStore
} from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { jsx, jsxs } from "react/jsx-runtime";
function MediaControlPreview({
  url,
  alt,
  filename,
  itemGroupProps,
  className
}) {
  return /* @__PURE__ */ jsx(ItemGroup, { ...itemGroupProps, as: "span", children: /* @__PURE__ */ jsxs(HStack, { justify: "flex-start", as: "span", children: [
    /* @__PURE__ */ jsx("img", { src: url, alt }),
    /* @__PURE__ */ jsx(FlexItem, { as: "span", children: /* @__PURE__ */ jsx(Truncate, { numberOfLines: 1, className, children: filename }) })
  ] }) });
}
function MediaControl({
  mediaId,
  mediaUrl,
  alt = "",
  filename,
  allowedTypes,
  onSelect,
  onSelectURL,
  onError,
  onReset,
  isUploading = false,
  emptyLabel = __("Add media")
}) {
  const { getSettings } = useSelect(blockEditorStore);
  const onFilesDrop = (filesList) => {
    const { mediaUpload } = getSettings();
    if (!mediaUpload) {
      return;
    }
    mediaUpload({
      allowedTypes,
      filesList,
      onFileChange([media]) {
        onSelect(media);
      },
      onError,
      multiple: false
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "block-library-utils__media-control", children: [
    /* @__PURE__ */ jsx(
      MediaReplaceFlow,
      {
        mediaId,
        mediaURL: mediaUrl,
        allowedTypes,
        onSelect,
        onSelectURL,
        onError,
        name: mediaUrl ? /* @__PURE__ */ jsx(
          MediaControlPreview,
          {
            url: mediaUrl,
            alt,
            filename
          }
        ) : emptyLabel,
        renderToggle: (props) => /* @__PURE__ */ jsx(Button, { ...props, __next40pxDefaultSize: true, children: isUploading ? /* @__PURE__ */ jsx(Spinner, {}) : props.children }),
        onReset
      }
    ),
    /* @__PURE__ */ jsx(DropZone, { onFilesDrop })
  ] });
}
export {
  MediaControl,
  MediaControlPreview
};
//# sourceMappingURL=media-control.mjs.map
