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

// packages/edit-site/src/components/post-list/quick-edit-modal.js
var quick_edit_modal_exports = {};
__export(quick_edit_modal_exports, {
  QuickEditModal: () => QuickEditModal
});
module.exports = __toCommonJS(quick_edit_modal_exports);
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_dataviews = require("@wordpress/dataviews");
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_editor = require("@wordpress/editor");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { usePostFields, PostCardPanel } = (0, import_lock_unlock.unlock)(import_editor.privateApis);
var fieldsWithBulkEditSupport = ["status", "date", "author", "discussion"];
function QuickEditModal({ postType, postId, closeModal }) {
  const isBulk = postId.length > 1;
  const [localEdits, setLocalEdits] = (0, import_element.useState)({});
  const { record, hasFinishedResolution, canSwitchTemplate } = (0, import_data.useSelect)(
    (select) => {
      const {
        getEditedEntityRecord,
        hasFinishedResolution: hasFinished
      } = select(import_core_data.store);
      if (isBulk) {
        return {
          record: null,
          hasFinishedResolution: true
        };
      }
      const args = ["postType", postType, postId[0]];
      const { getHomePage, getPostsPageId } = (0, import_lock_unlock.unlock)(
        select(import_core_data.store)
      );
      const singlePostId = String(postId[0]);
      const isPostsPage = singlePostId !== void 0 && getPostsPageId() === singlePostId;
      const isFrontPage = singlePostId !== void 0 && postType === "page" && getHomePage()?.postId === singlePostId;
      return {
        record: getEditedEntityRecord(...args),
        hasFinishedResolution: hasFinished(
          "getEditedEntityRecord",
          args
        ),
        canSwitchTemplate: !isPostsPage && !isFrontPage
      };
    },
    [postType, postId, isBulk]
  );
  const { editEntityRecord, saveEditedEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
  const _fields = usePostFields({ postType });
  const fields = (0, import_element.useMemo)(
    () => _fields?.map((field) => {
      if (field.id === "status") {
        return {
          ...field,
          elements: field.elements.filter(
            (element) => element.value !== "trash"
          )
        };
      }
      if (field.id === "template") {
        return {
          ...field,
          readOnly: !canSwitchTemplate
        };
      }
      return field;
    }),
    [_fields, canSwitchTemplate]
  );
  const form = (0, import_element.useMemo)(() => {
    const allFields = [
      {
        id: "featured_media",
        layout: {
          type: "regular",
          labelPosition: "none"
        }
      },
      {
        id: "status",
        label: (0, import_i18n.__)("Status"),
        children: [
          {
            id: "status",
            layout: { type: "regular", labelPosition: "none" }
          },
          "scheduled_date",
          "password"
        ]
      },
      "author",
      "date",
      "slug",
      "parent",
      {
        id: "discussion",
        label: (0, import_i18n.__)("Discussion"),
        children: [
          {
            id: "comment_status",
            layout: { type: "regular", labelPosition: "none" }
          },
          "ping_status"
        ]
      },
      "template"
    ];
    return {
      layout: {
        type: "panel"
      },
      fields: isBulk ? allFields.filter(
        (field) => fieldsWithBulkEditSupport.includes(
          typeof field === "string" ? field : field.id
        )
      ) : allFields
    };
  }, [isBulk]);
  const onChange = (edits) => {
    const currentData = { ...record, ...localEdits };
    if (edits.status && edits.status !== "future" && currentData?.status === "future" && new Date(currentData.date) > /* @__PURE__ */ new Date()) {
      edits.date = null;
    }
    if (edits.status && edits.status === "private" && currentData?.password) {
      edits.password = "";
    }
    setLocalEdits((prev) => ({ ...prev, ...edits }));
  };
  (0, import_element.useEffect)(() => {
    setLocalEdits({});
  }, [postId]);
  const onSave = async () => {
    for (const id of postId) {
      editEntityRecord("postType", postType, id, localEdits);
    }
    if (isBulk) {
      await Promise.allSettled(
        postId.map(
          (id) => saveEditedEntityRecord("postType", postType, id)
        )
      );
    } else {
      await saveEditedEntityRecord("postType", postType, postId[0]);
    }
    closeModal?.();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.Modal,
    {
      overlayClassName: "dataviews-action-modal__quick-edit",
      __experimentalHideHeader: true,
      onRequestClose: closeModal,
      focusOnMount: "firstElement",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dataviews-action-modal__quick-edit-header", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          PostCardPanel,
          {
            postType,
            postId,
            onClose: closeModal,
            hideActions: true
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dataviews-action-modal__quick-edit-content", children: hasFinishedResolution && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_dataviews.DataForm,
          {
            data: { ...record, ...localEdits },
            fields,
            form,
            onChange
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { className: "dataviews-action-modal__quick-edit-footer", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              __next40pxDefaultSize: true,
              variant: "secondary",
              onClick: closeModal,
              children: (0, import_i18n.__)("Cancel")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              __next40pxDefaultSize: true,
              variant: "primary",
              onClick: onSave,
              children: (0, import_i18n.__)("Done")
            }
          )
        ] })
      ]
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  QuickEditModal
});
//# sourceMappingURL=quick-edit-modal.cjs.map
