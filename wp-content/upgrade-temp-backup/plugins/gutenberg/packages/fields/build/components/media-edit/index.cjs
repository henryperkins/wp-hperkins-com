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

// packages/fields/src/components/media-edit/index.tsx
var media_edit_exports = {};
__export(media_edit_exports, {
  default: () => MediaEdit
});
module.exports = __toCommonJS(media_edit_exports);
var import_clsx = __toESM(require("clsx"));
var import_components = require("@wordpress/components");
var import_blob = require("@wordpress/blob");
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_media_utils = require("@wordpress/media-utils");
var import_notices = require("@wordpress/notices");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_use_moving_animation = __toESM(require("./use-moving-animation.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var { MediaUploadModal } = (0, import_lock_unlock.unlock)(import_media_utils.privateApis);
function AnimatedMediaItem({
  children,
  index,
  className
}) {
  const ref = (0, import_use_moving_animation.default)(index);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref, className, children });
}
function normalizeValue(value) {
  if (Array.isArray(value)) {
    return value;
  }
  return value ? [value] : [];
}
function ConditionalMediaUpload({ render, multiple, ...props }) {
  const [isModalOpen, setIsModalOpen] = (0, import_element.useState)(false);
  if (window.__experimentalDataViewsMediaModal) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      render && render({ open: () => setIsModalOpen(true) }),
      isModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_media_utils.MediaUpload,
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
  const isBlob = attachment && (0, import_blob.isBlobURL)(attachment.source_url);
  const mediaPickerButton = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: (0, import_clsx.default)("fields__media-edit-picker-button", {
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
        isBlob && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "fields__media-edit-picker-button-spinner", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Spinner, {}) }),
        !isUploading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.DropZone,
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Tooltip, { text: label, placement: "top", children: mediaPickerButton });
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalTruncate, { className: "fields__media-edit-filename", children: attachment.title.rendered });
}
function MediaEditPlaceholder(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaPickerButton, { ...props, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "fields__media-edit-placeholder", children: props.label }) });
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Button,
      {
        __next40pxDefaultSize: true,
        icon: isHorizontal ? import_icons.chevronLeft : import_icons.chevronUp,
        label: isHorizontal ? (0, import_i18n.__)("Move left") : (0, import_i18n.__)("Move up"),
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
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Button,
      {
        __next40pxDefaultSize: true,
        icon: isHorizontal ? import_icons.chevronRight : import_icons.chevronDown,
        label: isHorizontal ? (0, import_i18n.__)("Move right") : (0, import_i18n.__)("Move down"),
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
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "img",
      {
        className: "fields__media-edit-thumbnail",
        alt: attachment.alt_text || "",
        src: url
      }
    );
  } else if (mimeType.startsWith("audio")) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Icon, { icon: import_icons.audio });
  } else if (mimeType.startsWith("video")) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Icon, { icon: import_icons.video });
  } else if (archiveMimeTypes.includes(mimeType)) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Icon, { icon: import_icons.archive });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Icon, { icon: import_icons.file });
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: (0, import_clsx.default)("fields__media-edit-expanded", {
        "is-multiple": multiple,
        "is-single": !multiple,
        "is-empty": !allItems?.length
      }),
      children: [
        allItems?.map((attachment, index) => {
          const hasPreviewImage = attachment.mime_type?.startsWith("image");
          const isBlob = (0, import_blob.isBlobURL)(attachment.source_url);
          const attachmentNumericId = attachment.id;
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            AnimatedMediaItem,
            {
              index,
              className: (0, import_clsx.default)("fields__media-edit-expanded-item", {
                "has-preview-image": hasPreviewImage
              }),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  MediaPickerButton,
                  {
                    open: () => {
                      setTargetItemId(attachmentNumericId);
                      open();
                    },
                    label: !isBlob ? (0, import_i18n.sprintf)(
                      /* translators: %s: The title of the media item. */
                      (0, import_i18n.__)("Replace %s"),
                      attachment.title.rendered
                    ) : (0, import_i18n.__)("Replace"),
                    showTooltip: true,
                    onFilesDrop,
                    attachment,
                    isUploading,
                    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fields__media-edit-expanded-preview", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_components.__experimentalVStack,
                      {
                        spacing: 0,
                        alignment: "center",
                        justify: "center",
                        className: "fields__media-edit-expanded-preview-stack",
                        children: (!isBlob || hasPreviewImage) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                          MediaPreview,
                          {
                            attachment
                          }
                        )
                      }
                    ) })
                  }
                ),
                !isBlob && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fields__media-edit-expanded-overlay", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  import_components.__experimentalHStack,
                  {
                    className: "fields__media-edit-expanded-actions",
                    spacing: 0,
                    alignment: "flex-end",
                    expanded: false,
                    children: [
                      multiple && allItems.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        import_components.Button,
                        {
                          __next40pxDefaultSize: true,
                          icon: import_icons.closeSmall,
                          label: (0, import_i18n.__)("Remove"),
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
        (multiple || !allItems?.length) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    !!allItems?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className: (0, import_clsx.default)("fields__media-edit-compact-group", {
          "is-single": allItems.length === 1
        }),
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalVStack, { spacing: 0, children: allItems.map((attachment, index) => {
          const isBlob = (0, import_blob.isBlobURL)(attachment.source_url);
          const showMoveButtons = multiple && allItems.length > 1;
          const attachmentNumericId = attachment.id;
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            AnimatedMediaItem,
            {
              index,
              className: "fields__media-edit-compact",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  MediaPickerButton,
                  {
                    open: () => {
                      setTargetItemId(
                        attachmentNumericId
                      );
                      open();
                    },
                    label: (0, import_i18n.__)("Replace"),
                    showTooltip: true,
                    onFilesDrop,
                    attachment,
                    isUploading,
                    children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        MediaPreview,
                        {
                          attachment
                        }
                      ),
                      !isBlob && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        MediaTitle,
                        {
                          attachment
                        }
                      )
                    ] })
                  }
                ),
                !isBlob && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  import_components.__experimentalHStack,
                  {
                    className: "fields__media-edit-compact-movers",
                    spacing: 0,
                    alignment: "flex-end",
                    expanded: false,
                    children: [
                      showMoveButtons && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        import_components.Button,
                        {
                          __next40pxDefaultSize: true,
                          icon: import_icons.closeSmall,
                          label: (0, import_i18n.__)("Remove"),
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
    (multiple || !allItems?.length) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
  const [isTouched, setIsTouched] = (0, import_element.useState)(false);
  const validityTargetRef = (0, import_element.useRef)(null);
  const [customValidity, setCustomValidity] = (0, import_element.useState)(void 0);
  (0, import_element.useEffect)(() => {
    const validityTarget = validityTargetRef.current;
    const handler = () => {
      setIsTouched(true);
    };
    validityTarget?.addEventListener("invalid", handler);
    return () => validityTarget?.removeEventListener("invalid", handler);
  }, []);
  const attachments = (0, import_data.useSelect)(
    (select) => {
      if (!value) {
        return null;
      }
      const normalizedValue = normalizeValue(value);
      const sortedIds = normalizedValue.toSorted((a, b) => a - b);
      const { getEntityRecords } = select(import_core_data.store);
      return getEntityRecords("postType", "attachment", {
        include: sortedIds
      });
    },
    [value]
  );
  const stableAttachmentsRef = (0, import_element.useRef)(
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
  const orderedAttachments = (0, import_element.useMemo)(() => {
    if (!stableAttachments) {
      return null;
    }
    const normalizedValue = normalizeValue(value);
    const attachmentMap = new Map(
      stableAttachments.map((a) => [a.id, a])
    );
    return normalizedValue.map((id) => attachmentMap.get(id)).filter((a) => a !== void 0);
  }, [stableAttachments, value]);
  const { createErrorNotice } = (0, import_data.useDispatch)(import_notices.store);
  const { receiveEntityRecords } = (0, import_data.useDispatch)(import_core_data.store);
  const [targetItemId, setTargetItemId] = (0, import_element.useState)();
  const openModalRef = (0, import_element.useRef)(void 0);
  const [pendingOpen, setPendingOpen] = (0, import_element.useState)(false);
  const [blobs, setBlobs] = (0, import_element.useState)([]);
  (0, import_element.useEffect)(() => {
    if (pendingOpen) {
      setPendingOpen(false);
      openModalRef.current?.();
    }
  }, [pendingOpen]);
  const onChangeControl = (0, import_element.useCallback)(
    (newValue) => onChange(field.setValue({ item: data, value: newValue })),
    [data, field, onChange]
  );
  const removeItem = (0, import_element.useCallback)(
    (itemId) => {
      const currentIds = normalizeValue(value);
      const newIds = currentIds.filter((id) => id !== itemId);
      setIsTouched(true);
      onChangeControl(newIds.length ? newIds : void 0);
    },
    [value, onChangeControl]
  );
  const moveItem = (0, import_element.useCallback)(
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
  const onFilesDrop = (0, import_element.useCallback)(
    (files, _targetItemId) => {
      setTargetItemId(_targetItemId);
      (0, import_media_utils.uploadMedia)({
        allowedTypes: allowedTypes?.length ? allowedTypes : void 0,
        filesList: files,
        onFileChange(uploadedMedia) {
          const blobUrls = uploadedMedia.filter((item) => (0, import_blob.isBlobURL)(item.url)).map((item) => item.url);
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
  const addButtonLabel = field.placeholder || (multiple ? (0, import_i18n.__)("Choose files") : (0, import_i18n.__)("Choose file"));
  const allItems = (0, import_element.useMemo)(() => {
    if (!blobs.length) {
      return orderedAttachments;
    }
    const items = [
      ...orderedAttachments || []
    ];
    const blobItems = blobs.map((url) => ({
      id: url,
      source_url: url,
      mime_type: (0, import_blob.getBlobTypeByURL)(url)
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
  (0, import_element.useEffect)(() => {
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
          customValidityResult.message || (0, import_i18n.__)("Invalid")
        );
      } else {
        input.setCustomValidity("");
      }
    } else {
      input.setCustomValidity("");
      setCustomValidity(void 0);
    }
  }, [isTouched, field.isValid, validity]);
  const onBlur = (0, import_element.useCallback)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { onBlur, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("fieldset", { className: "fields__media-edit", "data-field-id": field.id, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 2, children: [
            field.label && (hideLabelFromVision ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.VisuallyHidden, { as: "legend", children: field.label }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.BaseControl.VisualLabel,
              {
                as: "legend",
                style: { marginBottom: 0 },
                children: field.label
              }
            )),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
            field.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { variant: "muted", children: field.description })
          ] });
        }
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.VisuallyHidden, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
    customValidity && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { "aria-live": "polite", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "p",
      {
        className: (0, import_clsx.default)(
          "components-validated-control__indicator",
          {
            "is-invalid": customValidity.type === "invalid",
            "is-valid": customValidity.type === "valid"
          }
        ),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Icon,
            {
              className: "components-validated-control__indicator-icon",
              icon: import_icons.error,
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
//# sourceMappingURL=index.cjs.map
