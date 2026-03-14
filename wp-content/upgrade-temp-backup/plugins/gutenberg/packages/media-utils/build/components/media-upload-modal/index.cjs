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

// packages/media-utils/src/components/media-upload-modal/index.tsx
var media_upload_modal_exports = {};
__export(media_upload_modal_exports, {
  MediaUploadModal: () => MediaUploadModal,
  default: () => media_upload_modal_default
});
module.exports = __toCommonJS(media_upload_modal_exports);
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_icons = require("@wordpress/icons");
var import_dataviews = require("@wordpress/dataviews");
var import_media_fields = require("@wordpress/media-fields");
var import_notices = require("@wordpress/notices");
var import_blob = require("@wordpress/blob");
var import_transform_attachment = require("../../utils/transform-attachment.cjs");
var import_upload_media = require("../../utils/upload-media.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useEntityRecordsWithPermissions } = (0, import_lock_unlock.unlock)(import_core_data.privateApis);
var LAYOUT_PICKER_GRID = "pickerGrid";
var LAYOUT_PICKER_TABLE = "pickerTable";
var NOTICES_CONTEXT = "media-modal";
var NOTICE_ID_UPLOAD_PROGRESS = "media-modal-upload-progress";
function MediaUploadModal({
  allowedTypes,
  multiple = false,
  value,
  onSelect,
  onClose,
  onUpload,
  title = (0, import_i18n.__)("Select Media"),
  isOpen,
  isDismissible = true,
  modalClass,
  search = true,
  searchLabel = (0, import_i18n.__)("Search media")
}) {
  const [selection, setSelection] = (0, import_element.useState)(() => {
    if (!value) {
      return [];
    }
    return Array.isArray(value) ? value.map(String) : [String(value)];
  });
  const { createSuccessNotice, createErrorNotice, createInfoNotice } = (0, import_data.useDispatch)(import_notices.store);
  const { invalidateResolution } = (0, import_data.useDispatch)(import_core_data.store);
  const [view, setView] = (0, import_element.useState)(() => ({
    type: LAYOUT_PICKER_GRID,
    fields: [],
    showTitle: false,
    titleField: "title",
    mediaField: "media_thumbnail",
    search: "",
    page: 1,
    perPage: 20,
    filters: [],
    layout: {
      previewSize: 170
    }
  }));
  const queryArgs = (0, import_element.useMemo)(() => {
    const filters = {};
    view.filters?.forEach((filter) => {
      if (filter.field === "media_type") {
        filters.media_type = filter.value;
      }
      if (filter.field === "author") {
        if (filter.operator === "isAny") {
          filters.author = filter.value;
        } else if (filter.operator === "isNone") {
          filters.author_exclude = filter.value;
        }
      }
      if (filter.field === "date" || filter.field === "modified") {
        if (filter.operator === "before") {
          filters.before = filter.value;
        } else if (filter.operator === "after") {
          filters.after = filter.value;
        }
      }
      if (filter.field === "mime_type") {
        filters.mime_type = filter.value;
      }
    });
    if (!filters.media_type) {
      filters.media_type = allowedTypes?.includes("*") ? void 0 : allowedTypes;
    }
    return {
      per_page: view.perPage || 20,
      page: view.page || 1,
      status: "inherit",
      order: view.sort?.direction,
      orderby: view.sort?.field,
      search: view.search,
      _embed: "author,wp:attached-to",
      ...filters
    };
  }, [view, allowedTypes]);
  const {
    records: mediaRecords,
    isResolving: isLoading,
    totalItems,
    totalPages
  } = useEntityRecordsWithPermissions("postType", "attachment", queryArgs);
  const fields = (0, import_element.useMemo)(
    () => [
      // Media field definitions from @wordpress/media-fields
      // Cast is safe because RestAttachment has the same properties as Attachment
      {
        ...import_media_fields.mediaThumbnailField,
        enableHiding: false
        // Within the modal, the thumbnail should always be shown.
      },
      {
        id: "title",
        type: "text",
        label: (0, import_i18n.__)("Title"),
        getValue: ({ item }) => {
          const titleValue = item.title.raw || item.title.rendered;
          return titleValue || (0, import_i18n.__)("(no title)");
        }
      },
      import_media_fields.altTextField,
      import_media_fields.captionField,
      import_media_fields.descriptionField,
      import_media_fields.dateAddedField,
      import_media_fields.dateModifiedField,
      import_media_fields.authorField,
      import_media_fields.filenameField,
      import_media_fields.filesizeField,
      import_media_fields.mediaDimensionsField,
      import_media_fields.mimeTypeField,
      import_media_fields.attachedToField
    ],
    []
  );
  const actions = (0, import_element.useMemo)(
    () => [
      {
        id: "select",
        label: multiple ? (0, import_i18n.__)("Select") : (0, import_i18n.__)("Select"),
        isPrimary: true,
        supportsBulk: multiple,
        async callback() {
          if (selection.length === 0) {
            return;
          }
          const selectedPostsQuery = {
            include: selection,
            per_page: -1
          };
          const selectedPosts = await (0, import_data.resolveSelect)(
            import_core_data.store
          ).getEntityRecords(
            "postType",
            "attachment",
            selectedPostsQuery
          );
          const transformedPosts = (selectedPosts ?? []).map(import_transform_attachment.transformAttachment).filter(Boolean);
          const selectedItems = multiple ? transformedPosts : transformedPosts?.[0];
          onSelect(selectedItems);
        }
      }
    ],
    [multiple, onSelect, selection]
  );
  const handleModalClose = (0, import_element.useCallback)(() => {
    onClose?.();
  }, [onClose]);
  const handleUpload = onUpload || import_upload_media.uploadMedia;
  const handleUploadComplete = (0, import_element.useCallback)(
    (attachments) => {
      const allComplete = attachments.every(
        (attachment) => attachment.id && attachment.url && !(0, import_blob.isBlobURL)(attachment.url)
      );
      if (allComplete && attachments.length > 0) {
        createSuccessNotice(
          (0, import_i18n.sprintf)(
            // translators: %s: number of files
            (0, import_i18n._n)(
              "Uploaded %s file",
              "Uploaded %s files",
              attachments.length
            ),
            attachments.length.toLocaleString()
          ),
          {
            type: "snackbar",
            context: NOTICES_CONTEXT,
            id: NOTICE_ID_UPLOAD_PROGRESS
          }
        );
        const uploadedIds = attachments.map((attachment) => String(attachment.id)).filter(Boolean);
        if (multiple) {
          setSelection((prev) => [...prev, ...uploadedIds]);
        } else {
          setSelection(uploadedIds.slice(0, 1));
        }
        invalidateResolution("getEntityRecords", [
          "postType",
          "attachment",
          queryArgs
        ]);
      }
    },
    [createSuccessNotice, invalidateResolution, queryArgs, multiple]
  );
  const handleUploadError = (0, import_element.useCallback)(
    (error) => {
      createErrorNotice(error.message, {
        type: "snackbar",
        context: NOTICES_CONTEXT,
        id: NOTICE_ID_UPLOAD_PROGRESS
      });
    },
    [createErrorNotice]
  );
  const handleFileSelect = (0, import_element.useCallback)(
    (event) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        const filesArray = Array.from(files);
        createInfoNotice(
          (0, import_i18n.sprintf)(
            // translators: %s: number of files
            (0, import_i18n._n)(
              "Uploading %s file",
              "Uploading %s files",
              filesArray.length
            ),
            filesArray.length.toLocaleString()
          ),
          {
            type: "snackbar",
            context: NOTICES_CONTEXT,
            id: NOTICE_ID_UPLOAD_PROGRESS,
            explicitDismiss: true
          }
        );
        handleUpload({
          allowedTypes,
          filesList: filesArray,
          onFileChange: handleUploadComplete,
          onError: handleUploadError
        });
      }
    },
    [
      allowedTypes,
      handleUpload,
      createInfoNotice,
      handleUploadComplete,
      handleUploadError
    ]
  );
  const paginationInfo = (0, import_element.useMemo)(
    () => ({
      totalItems,
      totalPages
    }),
    [totalItems, totalPages]
  );
  const defaultLayouts = (0, import_element.useMemo)(
    () => ({
      [LAYOUT_PICKER_GRID]: {
        fields: [],
        showTitle: false
      },
      [LAYOUT_PICKER_TABLE]: {
        fields: [
          "filename",
          "filesize",
          "media_dimensions",
          "author",
          "date"
        ],
        showTitle: true
      }
    }),
    []
  );
  const acceptTypes = (0, import_element.useMemo)(() => {
    if (allowedTypes?.includes("*")) {
      return void 0;
    }
    return allowedTypes?.join(",");
  }, [allowedTypes]);
  if (!isOpen) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.Modal,
    {
      title,
      onRequestClose: handleModalClose,
      isDismissible,
      className: modalClass,
      overlayClassName: "media-upload-modal",
      size: "fill",
      headerActions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.FormFileUpload,
        {
          accept: acceptTypes,
          multiple: true,
          onChange: handleFileSelect,
          __next40pxDefaultSize: true,
          render: ({ openFileDialog }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              onClick: openFileDialog,
              icon: import_icons.upload,
              __next40pxDefaultSize: true,
              children: (0, import_i18n.__)("Upload media")
            }
          )
        }
      ),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.DropZone,
          {
            onFilesDrop: (files) => {
              let filteredFiles = files;
              if (allowedTypes && !allowedTypes.includes("*")) {
                filteredFiles = files.filter(
                  (file) => allowedTypes.some((allowedType) => {
                    return file.type === allowedType || file.type.startsWith(
                      allowedType.replace("*", "")
                    );
                  })
                );
              }
              if (filteredFiles.length > 0) {
                createInfoNotice(
                  (0, import_i18n.sprintf)(
                    // translators: %s: number of files
                    (0, import_i18n._n)(
                      "Uploading %s file",
                      "Uploading %s files",
                      filteredFiles.length
                    ),
                    filteredFiles.length.toLocaleString()
                  ),
                  {
                    type: "snackbar",
                    context: NOTICES_CONTEXT,
                    id: NOTICE_ID_UPLOAD_PROGRESS,
                    explicitDismiss: true
                  }
                );
                handleUpload({
                  allowedTypes,
                  filesList: filteredFiles,
                  onFileChange: handleUploadComplete,
                  onError: handleUploadError
                });
              }
            },
            label: (0, import_i18n.__)("Drop files to upload")
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_dataviews.DataViewsPicker,
          {
            data: mediaRecords || [],
            fields,
            view,
            onChangeView: setView,
            actions,
            selection,
            onChangeSelection: setSelection,
            isLoading,
            paginationInfo,
            defaultLayouts,
            getItemId: (item) => String(item.id),
            search,
            searchLabel,
            itemListLabel: (0, import_i18n.__)("Media items")
          }
        ),
        (0, import_element.createPortal)(
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_notices.SnackbarNotices,
            {
              className: "media-upload-modal__snackbar",
              context: NOTICES_CONTEXT
            }
          ),
          document.body
        )
      ]
    }
  );
}
var media_upload_modal_default = MediaUploadModal;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MediaUploadModal
});
//# sourceMappingURL=index.cjs.map
