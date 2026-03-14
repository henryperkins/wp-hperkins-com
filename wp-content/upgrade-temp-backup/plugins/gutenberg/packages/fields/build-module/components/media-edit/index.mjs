// packages/fields/src/components/media-edit/index.tsx
import clsx from "clsx";
import {
  Button,
  DropZone,
  Icon,
  Spinner,
  __experimentalText as Text,
  __experimentalTruncate as Truncate,
  __experimentalVStack as VStack,
  __experimentalHStack as HStack,
  BaseControl,
  Tooltip,
  VisuallyHidden
} from "@wordpress/components";
import { isBlobURL, getBlobTypeByURL } from "@wordpress/blob";
import { store as coreStore } from "@wordpress/core-data";
import { useSelect, useDispatch } from "@wordpress/data";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import {
  archive,
  audio,
  video,
  file,
  closeSmall,
  error as errorIcon,
  chevronUp,
  chevronDown,
  chevronLeft,
  chevronRight
} from "@wordpress/icons";
import {
  MediaUpload,
  uploadMedia,
  privateApis as mediaUtilsPrivateApis
} from "@wordpress/media-utils";
import { store as noticesStore } from "@wordpress/notices";
import { unlock } from "../../lock-unlock.mjs";
import useMovingAnimation from "./use-moving-animation.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { MediaUploadModal } = unlock(mediaUtilsPrivateApis);
function AnimatedMediaItem({
  children,
  index,
  className
}) {
  const ref = useMovingAnimation(index);
  return /* @__PURE__ */ jsx("div", { ref, className, children });
}
function normalizeValue(value) {
  if (Array.isArray(value)) {
    return value;
  }
  return value ? [value] : [];
}
function ConditionalMediaUpload({ render, multiple, ...props }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  if (window.__experimentalDataViewsMediaModal) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      render && render({ open: () => setIsModalOpen(true) }),
      isModalOpen && /* @__PURE__ */ jsx(
        MediaUploadModal,
        {
          ...props,
          multiple,
          isOpen: isModalOpen,
          onClose: () => {
            setIsModalOpen(false);
            props.onClose?.();
          },
          onSelect: (media) => {
            setIsModalOpen(false);
            props.onSelect?.(media);
          }
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsx(
    MediaUpload,
    {
      ...props,
      render,
      multiple: multiple ? "add" : void 0
    }
  );
}
function MediaPickerButton({
  open,
  children,
  label,
  showTooltip = false,
  onFilesDrop,
  attachment,
  isUploading = false
}) {
  const isBlob = attachment && isBlobURL(attachment.source_url);
  const mediaPickerButton = /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx("fields__media-edit-picker-button", {
        "has-attachment": attachment
      }),
      role: "button",
      tabIndex: 0,
      onClick: () => {
        if (!isUploading) {
          open();
        }
      },
      onKeyDown: (event) => {
        if (isUploading) {
          return;
        }
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open();
        }
      },
      "aria-label": label,
      "aria-disabled": isUploading,
      children: [
        children,
        isBlob && /* @__PURE__ */ jsx("span", { className: "fields__media-edit-picker-button-spinner", children: /* @__PURE__ */ jsx(Spinner, {}) }),
        !isUploading && /* @__PURE__ */ jsx(
          DropZone,
          {
            onFilesDrop: (files) => onFilesDrop(files, attachment?.id)
          }
        )
      ]
    }
  );
  if (!showTooltip) {
    return mediaPickerButton;
  }
  return /* @__PURE__ */ jsx(Tooltip, { text: label, placement: "top", children: mediaPickerButton });
}
var archiveMimeTypes = [
  "application/zip",
  "application/x-zip-compressed",
  "application/x-rar-compressed",
  "application/x-7z-compressed",
  "application/x-tar",
  "application/x-gzip"
];
function MediaTitle({ attachment }) {
  return /* @__PURE__ */ jsx(Truncate, { className: "fields__media-edit-filename", children: attachment.title.rendered });
}
function MediaEditPlaceholder(props) {
  return /* @__PURE__ */ jsx(MediaPickerButton, { ...props, children: /* @__PURE__ */ jsx("span", { className: "fields__media-edit-placeholder", children: props.label }) });
}
function MoveButtons({
  itemId,
  index,
  totalItems,
  isUploading,
  moveItem,
  orientation = "vertical"
}) {
  const isHorizontal = orientation === "horizontal";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Button,
      {
        __next40pxDefaultSize: true,
        icon: isHorizontal ? chevronLeft : chevronUp,
        label: isHorizontal ? __("Move left") : __("Move up"),
        size: "small",
        disabled: isUploading || index === 0,
        accessibleWhenDisabled: true,
        tooltipPosition: "top",
        onClick: (event) => {
          event.stopPropagation();
          moveItem(itemId, "up");
        }
      }
    ),
    /* @__PURE__ */ jsx(
      Button,
      {
        __next40pxDefaultSize: true,
        icon: isHorizontal ? chevronRight : chevronDown,
        label: isHorizontal ? __("Move right") : __("Move down"),
        size: "small",
        disabled: isUploading || index === totalItems - 1,
        accessibleWhenDisabled: true,
        tooltipPosition: "top",
        onClick: (event) => {
          event.stopPropagation();
          moveItem(itemId, "down");
        }
      }
    )
  ] });
}
function MediaPreview({ attachment }) {
  const url = attachment.source_url;
  const mimeType = attachment.mime_type || "";
  if (mimeType.startsWith("image")) {
    return /* @__PURE__ */ jsx(
      "img",
      {
        className: "fields__media-edit-thumbnail",
        alt: attachment.alt_text || "",
        src: url
      }
    );
  } else if (mimeType.startsWith("audio")) {
    return /* @__PURE__ */ jsx(Icon, { icon: audio });
  } else if (mimeType.startsWith("video")) {
    return /* @__PURE__ */ jsx(Icon, { icon: video });
  } else if (archiveMimeTypes.includes(mimeType)) {
    return /* @__PURE__ */ jsx(Icon, { icon: archive });
  }
  return /* @__PURE__ */ jsx(Icon, { icon: file });
}
function ExpandedMediaEditAttachments({
  allItems,
  addButtonLabel,
  multiple,
  removeItem,
  moveItem,
  open,
  onFilesDrop,
  isUploading,
  setTargetItemId
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx("fields__media-edit-expanded", {
        "is-multiple": multiple,
        "is-single": !multiple,
        "is-empty": !allItems?.length
      }),
      children: [
        allItems?.map((attachment, index) => {
          const hasPreviewImage = attachment.mime_type?.startsWith("image");
          const isBlob = isBlobURL(attachment.source_url);
          const attachmentNumericId = attachment.id;
          return /* @__PURE__ */ jsxs(
            AnimatedMediaItem,
            {
              index,
              className: clsx("fields__media-edit-expanded-item", {
                "has-preview-image": hasPreviewImage
              }),
              children: [
                /* @__PURE__ */ jsx(
                  MediaPickerButton,
                  {
                    open: () => {
                      setTargetItemId(attachmentNumericId);
                      open();
                    },
                    label: !isBlob ? sprintf(
                      /* translators: %s: The title of the media item. */
                      __("Replace %s"),
                      attachment.title.rendered
                    ) : __("Replace"),
                    showTooltip: true,
                    onFilesDrop,
                    attachment,
                    isUploading,
                    children: /* @__PURE__ */ jsx("div", { className: "fields__media-edit-expanded-preview", children: /* @__PURE__ */ jsx(
                      VStack,
                      {
                        spacing: 0,
                        alignment: "center",
                        justify: "center",
                        className: "fields__media-edit-expanded-preview-stack",
                        children: (!isBlob || hasPreviewImage) && /* @__PURE__ */ jsx(
                          MediaPreview,
                          {
                            attachment
                          }
                        )
                      }
                    ) })
                  }
                ),
                !isBlob && /* @__PURE__ */ jsx("div", { className: "fields__media-edit-expanded-overlay", children: /* @__PURE__ */ jsxs(
                  HStack,
                  {
                    className: "fields__media-edit-expanded-actions",
                    spacing: 0,
                    alignment: "flex-end",
                    expanded: false,
                    children: [
                      multiple && allItems.length > 1 && /* @__PURE__ */ jsx(
                        MoveButtons,
                        {
                          itemId: attachmentNumericId,
                          index,
                          totalItems: allItems.length,
                          isUploading,
                          moveItem,
                          orientation: "horizontal"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Button,
                        {
                          __next40pxDefaultSize: true,
                          icon: closeSmall,
                          label: __("Remove"),
                          size: "small",
                          disabled: isUploading,
                          accessibleWhenDisabled: true,
                          tooltipPosition: "top",
                          onClick: (event) => {
                            event.stopPropagation();
                            removeItem(attachmentNumericId);
                          }
                        }
                      )
                    ]
                  }
                ) })
              ]
            },
            attachment.id
          );
        }),
        (multiple || !allItems?.length) && /* @__PURE__ */ jsx(
          MediaEditPlaceholder,
          {
            open: () => {
              setTargetItemId(void 0);
              open();
            },
            label: addButtonLabel,
            onFilesDrop,
            isUploading
          }
        )
      ]
    }
  );
}
function CompactMediaEditAttachments({
  allItems,
  addButtonLabel,
  multiple,
  removeItem,
  moveItem,
  open,
  onFilesDrop,
  isUploading,
  setTargetItemId
}) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    !!allItems?.length && /* @__PURE__ */ jsx(
      "div",
      {
        className: clsx("fields__media-edit-compact-group", {
          "is-single": allItems.length === 1
        }),
        children: /* @__PURE__ */ jsx(VStack, { spacing: 0, children: allItems.map((attachment, index) => {
          const isBlob = isBlobURL(attachment.source_url);
          const showMoveButtons = multiple && allItems.length > 1;
          const attachmentNumericId = attachment.id;
          return /* @__PURE__ */ jsxs(
            AnimatedMediaItem,
            {
              index,
              className: "fields__media-edit-compact",
              children: [
                /* @__PURE__ */ jsx(
                  MediaPickerButton,
                  {
                    open: () => {
                      setTargetItemId(
                        attachmentNumericId
                      );
                      open();
                    },
                    label: __("Replace"),
                    showTooltip: true,
                    onFilesDrop,
                    attachment,
                    isUploading,
                    children: /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(
                        MediaPreview,
                        {
                          attachment
                        }
                      ),
                      !isBlob && /* @__PURE__ */ jsx(
                        MediaTitle,
                        {
                          attachment
                        }
                      )
                    ] })
                  }
                ),
                !isBlob && /* @__PURE__ */ jsxs(
                  HStack,
                  {
                    className: "fields__media-edit-compact-movers",
                    spacing: 0,
                    alignment: "flex-end",
                    expanded: false,
                    children: [
                      showMoveButtons && /* @__PURE__ */ jsx(
                        MoveButtons,
                        {
                          itemId: attachmentNumericId,
                          index,
                          totalItems: allItems.length,
                          isUploading,
                          moveItem,
                          orientation: "vertical"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Button,
                        {
                          __next40pxDefaultSize: true,
                          icon: closeSmall,
                          label: __("Remove"),
                          size: "small",
                          disabled: isUploading,
                          accessibleWhenDisabled: true,
                          tooltipPosition: "top",
                          onClick: (event) => {
                            event.stopPropagation();
                            removeItem(
                              attachmentNumericId
                            );
                          }
                        }
                      )
                    ]
                  }
                )
              ]
            },
            attachment.id
          );
        }) })
      }
    ),
    (multiple || !allItems?.length) && /* @__PURE__ */ jsx(
      MediaEditPlaceholder,
      {
        open: () => {
          setTargetItemId(void 0);
          open();
        },
        label: addButtonLabel,
        onFilesDrop,
        isUploading
      }
    )
  ] });
}
function MediaEdit({
  data,
  field,
  onChange,
  hideLabelFromVision,
  allowedTypes = ["image"],
  multiple,
  isExpanded,
  validity
}) {
  const value = field.getValue({ item: data });
  const [isTouched, setIsTouched] = useState(false);
  const validityTargetRef = useRef(null);
  const [customValidity, setCustomValidity] = useState(void 0);
  useEffect(() => {
    const validityTarget = validityTargetRef.current;
    const handler = () => {
      setIsTouched(true);
    };
    validityTarget?.addEventListener("invalid", handler);
    return () => validityTarget?.removeEventListener("invalid", handler);
  }, []);
  const attachments = useSelect(
    (select) => {
      if (!value) {
        return null;
      }
      const normalizedValue = normalizeValue(value);
      const sortedIds = normalizedValue.toSorted((a, b) => a - b);
      const { getEntityRecords } = select(coreStore);
      return getEntityRecords("postType", "attachment", {
        include: sortedIds
      });
    },
    [value]
  );
  const stableAttachmentsRef = useRef(
    null
  );
  if (attachments !== null) {
    stableAttachmentsRef.current = attachments;
  }
  let stableAttachments = attachments;
  if (attachments === null && stableAttachmentsRef.current && value) {
    const stableIds = new Set(
      stableAttachmentsRef.current.map((a) => a.id)
    );
    if (normalizeValue(value).every((id) => stableIds.has(id))) {
      stableAttachments = stableAttachmentsRef.current;
    }
  }
  const orderedAttachments = useMemo(() => {
    if (!stableAttachments) {
      return null;
    }
    const normalizedValue = normalizeValue(value);
    const attachmentMap = new Map(
      stableAttachments.map((a) => [a.id, a])
    );
    return normalizedValue.map((id) => attachmentMap.get(id)).filter((a) => a !== void 0);
  }, [stableAttachments, value]);
  const { createErrorNotice } = useDispatch(noticesStore);
  const { receiveEntityRecords } = useDispatch(coreStore);
  const [targetItemId, setTargetItemId] = useState();
  const openModalRef = useRef(void 0);
  const [pendingOpen, setPendingOpen] = useState(false);
  const [blobs, setBlobs] = useState([]);
  useEffect(() => {
    if (pendingOpen) {
      setPendingOpen(false);
      openModalRef.current?.();
    }
  }, [pendingOpen]);
  const onChangeControl = useCallback(
    (newValue) => onChange(field.setValue({ item: data, value: newValue })),
    [data, field, onChange]
  );
  const removeItem = useCallback(
    (itemId) => {
      const currentIds = normalizeValue(value);
      const newIds = currentIds.filter((id) => id !== itemId);
      setIsTouched(true);
      onChangeControl(newIds.length ? newIds : void 0);
    },
    [value, onChangeControl]
  );
  const moveItem = useCallback(
    (itemId, direction) => {
      if (!orderedAttachments) {
        return;
      }
      const currentIds = orderedAttachments.map((a) => a.id);
      const index = currentIds.indexOf(itemId);
      const newIndex = direction === "up" ? index - 1 : index + 1;
      [currentIds[index], currentIds[newIndex]] = [
        currentIds[newIndex],
        currentIds[index]
      ];
      onChangeControl(currentIds);
    },
    [orderedAttachments, onChangeControl]
  );
  const onFilesDrop = useCallback(
    (files, _targetItemId) => {
      setTargetItemId(_targetItemId);
      uploadMedia({
        allowedTypes: allowedTypes?.length ? allowedTypes : void 0,
        filesList: files,
        onFileChange(uploadedMedia) {
          const blobUrls = uploadedMedia.filter((item) => isBlobURL(item.url)).map((item) => item.url);
          setBlobs(blobUrls);
          if (!!blobUrls.length) {
            return;
          }
          receiveEntityRecords(
            "postType",
            "attachment",
            [],
            void 0,
            true
          );
          const uploadedIds = uploadedMedia.map(
            (item) => item.id
          );
          if (!multiple) {
            onChangeControl(uploadedIds[0]);
            setTargetItemId(void 0);
            return;
          }
          const currentValue = normalizeValue(value);
          if (_targetItemId === void 0) {
            onChangeControl([...currentValue, ...uploadedIds]);
          } else {
            const newValue = [...currentValue];
            newValue.splice(
              currentValue.indexOf(_targetItemId),
              1,
              ...uploadedIds
            );
            onChangeControl(newValue);
          }
          setTargetItemId(void 0);
        },
        onError(error) {
          setTargetItemId(void 0);
          setBlobs([]);
          createErrorNotice(error.message, { type: "snackbar" });
        },
        multiple: !!multiple
      });
    },
    [
      allowedTypes,
      value,
      multiple,
      createErrorNotice,
      onChangeControl,
      receiveEntityRecords
    ]
  );
  const addButtonLabel = field.placeholder || (multiple ? __("Choose files") : __("Choose file"));
  const allItems = useMemo(() => {
    if (!blobs.length) {
      return orderedAttachments;
    }
    const items = [
      ...orderedAttachments || []
    ];
    const blobItems = blobs.map((url) => ({
      id: url,
      source_url: url,
      mime_type: getBlobTypeByURL(url)
    }));
    if (targetItemId !== void 0) {
      const targetIndex = items.findIndex(
        (a) => a.id === targetItemId
      );
      items.splice(targetIndex, 1, ...blobItems);
    } else {
      items.push(...blobItems);
    }
    return items;
  }, [orderedAttachments, targetItemId, blobs]);
  useEffect(() => {
    if (!isTouched) {
      return;
    }
    const input = validityTargetRef.current;
    if (!input) {
      return;
    }
    if (validity) {
      const customValidityResult = validity?.custom;
      setCustomValidity(customValidityResult);
      if (customValidityResult?.type === "invalid") {
        input.setCustomValidity(
          customValidityResult.message || __("Invalid")
        );
      } else {
        input.setCustomValidity("");
      }
    } else {
      input.setCustomValidity("");
      setCustomValidity(void 0);
    }
  }, [isTouched, field.isValid, validity]);
  const onBlur = useCallback(
    (event) => {
      if (isTouched) {
        return;
      }
      if (!event.relatedTarget || !event.currentTarget.contains(event.relatedTarget)) {
        setIsTouched(true);
      }
    },
    [isTouched]
  );
  return /* @__PURE__ */ jsxs("div", { onBlur, children: [
    /* @__PURE__ */ jsx("fieldset", { className: "fields__media-edit", "data-field-id": field.id, children: /* @__PURE__ */ jsx(
      ConditionalMediaUpload,
      {
        onSelect: (selectedMedia) => {
          if (!multiple) {
            onChangeControl(selectedMedia.id);
            setTargetItemId(void 0);
            return;
          }
          const newIds = Array.isArray(selectedMedia) ? selectedMedia.map((m) => m.id) : [selectedMedia.id];
          const currentValue = normalizeValue(value);
          if (!currentValue.length) {
            onChangeControl(newIds);
          } else if (targetItemId === void 0) {
            const existingItems = currentValue.filter(
              (id) => newIds.includes(id)
            );
            const newItems = newIds.filter(
              (id) => !currentValue.includes(id)
            );
            onChangeControl([
              ...existingItems,
              ...newItems
            ]);
          } else if (selectedMedia.id !== targetItemId) {
            const filtered = currentValue.filter(
              (id) => id !== selectedMedia.id
            );
            onChangeControl(
              filtered.map(
                (id) => id === targetItemId ? selectedMedia.id : id
              )
            );
          }
          setTargetItemId(void 0);
        },
        onClose: () => setTargetItemId(void 0),
        allowedTypes,
        value: targetItemId !== void 0 ? targetItemId : value,
        multiple: multiple && targetItemId === void 0,
        title: field.label,
        render: ({ open }) => {
          openModalRef.current = open;
          const AttachmentsComponent = isExpanded ? ExpandedMediaEditAttachments : CompactMediaEditAttachments;
          return /* @__PURE__ */ jsxs(VStack, { spacing: 2, children: [
            field.label && (hideLabelFromVision ? /* @__PURE__ */ jsx(VisuallyHidden, { as: "legend", children: field.label }) : /* @__PURE__ */ jsx(
              BaseControl.VisualLabel,
              {
                as: "legend",
                style: { marginBottom: 0 },
                children: field.label
              }
            )),
            /* @__PURE__ */ jsx(
              AttachmentsComponent,
              {
                allItems,
                addButtonLabel,
                multiple,
                removeItem,
                moveItem,
                open: () => setPendingOpen(true),
                onFilesDrop,
                isUploading: !!blobs.length,
                setTargetItemId
              }
            ),
            field.description && /* @__PURE__ */ jsx(Text, { variant: "muted", children: field.description })
          ] });
        }
      }
    ) }),
    /* @__PURE__ */ jsx(VisuallyHidden, { children: /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        ref: validityTargetRef,
        value: value ?? "",
        tabIndex: -1,
        "aria-hidden": "true",
        onChange: () => {
        }
      }
    ) }),
    customValidity && /* @__PURE__ */ jsx("div", { "aria-live": "polite", children: /* @__PURE__ */ jsxs(
      "p",
      {
        className: clsx(
          "components-validated-control__indicator",
          {
            "is-invalid": customValidity.type === "invalid",
            "is-valid": customValidity.type === "valid"
          }
        ),
        children: [
          /* @__PURE__ */ jsx(
            Icon,
            {
              className: "components-validated-control__indicator-icon",
              icon: errorIcon,
              size: 16,
              fill: "currentColor"
            }
          ),
          customValidity.message
        ]
      }
    ) })
  ] });
}
export {
  MediaEdit as default
};
//# sourceMappingURL=index.mjs.map
