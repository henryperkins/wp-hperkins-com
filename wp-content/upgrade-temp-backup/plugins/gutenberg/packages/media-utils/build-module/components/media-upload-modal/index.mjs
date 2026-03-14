// packages/media-utils/src/components/media-upload-modal/index.tsx
import {
  createPortal,
  useState,
  useCallback,
  useMemo
} from "@wordpress/element";
import { __, sprintf, _n } from "@wordpress/i18n";
import {
  privateApis as coreDataPrivateApis,
  store as coreStore
} from "@wordpress/core-data";
import { resolveSelect, useDispatch } from "@wordpress/data";
import { Modal, DropZone, FormFileUpload, Button } from "@wordpress/components";
import { upload as uploadIcon } from "@wordpress/icons";
import { DataViewsPicker } from "@wordpress/dataviews";
import {
  altTextField,
  attachedToField,
  authorField,
  captionField,
  dateAddedField,
  dateModifiedField,
  descriptionField,
  filenameField,
  filesizeField,
  mediaDimensionsField,
  mediaThumbnailField,
  mimeTypeField
} from "@wordpress/media-fields";
import { store as noticesStore, SnackbarNotices } from "@wordpress/notices";
import { isBlobURL } from "@wordpress/blob";
import { transformAttachment } from "../../utils/transform-attachment.mjs";
import { uploadMedia } from "../../utils/upload-media.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { useEntityRecordsWithPermissions } = unlock(coreDataPrivateApis);
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
  title = __("Select Media"),
  isOpen,
  isDismissible = true,
  modalClass,
  search = true,
  searchLabel = __("Search media")
}) {
  const [selection, setSelection] = useState(() => {
    if (!value) {
      return [];
    }
    return Array.isArray(value) ? value.map(String) : [String(value)];
  });
  const { createSuccessNotice, createErrorNotice, createInfoNotice } = useDispatch(noticesStore);
  const { invalidateResolution } = useDispatch(coreStore);
  const [view, setView] = useState(() => ({
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
  const queryArgs = useMemo(() => {
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
  const fields = useMemo(
    () => [
      // Media field definitions from @wordpress/media-fields
      // Cast is safe because RestAttachment has the same properties as Attachment
      {
        ...mediaThumbnailField,
        enableHiding: false
        // Within the modal, the thumbnail should always be shown.
      },
      {
        id: "title",
        type: "text",
        label: __("Title"),
        getValue: ({ item }) => {
          const titleValue = item.title.raw || item.title.rendered;
          return titleValue || __("(no title)");
        }
      },
      altTextField,
      captionField,
      descriptionField,
      dateAddedField,
      dateModifiedField,
      authorField,
      filenameField,
      filesizeField,
      mediaDimensionsField,
      mimeTypeField,
      attachedToField
    ],
    []
  );
  const actions = useMemo(
    () => [
      {
        id: "select",
        label: multiple ? __("Select") : __("Select"),
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
          const selectedPosts = await resolveSelect(
            coreStore
          ).getEntityRecords(
            "postType",
            "attachment",
            selectedPostsQuery
          );
          const transformedPosts = (selectedPosts ?? []).map(transformAttachment).filter(Boolean);
          const selectedItems = multiple ? transformedPosts : transformedPosts?.[0];
          onSelect(selectedItems);
        }
      }
    ],
    [multiple, onSelect, selection]
  );
  const handleModalClose = useCallback(() => {
    onClose?.();
  }, [onClose]);
  const handleUpload = onUpload || uploadMedia;
  const handleUploadComplete = useCallback(
    (attachments) => {
      const allComplete = attachments.every(
        (attachment) => attachment.id && attachment.url && !isBlobURL(attachment.url)
      );
      if (allComplete && attachments.length > 0) {
        createSuccessNotice(
          sprintf(
            // translators: %s: number of files
            _n(
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
  const handleUploadError = useCallback(
    (error) => {
      createErrorNotice(error.message, {
        type: "snackbar",
        context: NOTICES_CONTEXT,
        id: NOTICE_ID_UPLOAD_PROGRESS
      });
    },
    [createErrorNotice]
  );
  const handleFileSelect = useCallback(
    (event) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        const filesArray = Array.from(files);
        createInfoNotice(
          sprintf(
            // translators: %s: number of files
            _n(
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
  const paginationInfo = useMemo(
    () => ({
      totalItems,
      totalPages
    }),
    [totalItems, totalPages]
  );
  const defaultLayouts = useMemo(
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
  const acceptTypes = useMemo(() => {
    if (allowedTypes?.includes("*")) {
      return void 0;
    }
    return allowedTypes?.join(",");
  }, [allowedTypes]);
  if (!isOpen) {
    return null;
  }
  return /* @__PURE__ */ jsxs(
    Modal,
    {
      title,
      onRequestClose: handleModalClose,
      isDismissible,
      className: modalClass,
      overlayClassName: "media-upload-modal",
      size: "fill",
      headerActions: /* @__PURE__ */ jsx(
        FormFileUpload,
        {
          accept: acceptTypes,
          multiple: true,
          onChange: handleFileSelect,
          __next40pxDefaultSize: true,
          render: ({ openFileDialog }) => /* @__PURE__ */ jsx(
            Button,
            {
              onClick: openFileDialog,
              icon: uploadIcon,
              __next40pxDefaultSize: true,
              children: __("Upload media")
            }
          )
        }
      ),
      children: [
        /* @__PURE__ */ jsx(
          DropZone,
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
                  sprintf(
                    // translators: %s: number of files
                    _n(
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
            label: __("Drop files to upload")
          }
        ),
        /* @__PURE__ */ jsx(
          DataViewsPicker,
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
            itemListLabel: __("Media items")
          }
        ),
        createPortal(
          /* @__PURE__ */ jsx(
            SnackbarNotices,
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
export {
  MediaUploadModal,
  media_upload_modal_default as default
};
//# sourceMappingURL=index.mjs.map
