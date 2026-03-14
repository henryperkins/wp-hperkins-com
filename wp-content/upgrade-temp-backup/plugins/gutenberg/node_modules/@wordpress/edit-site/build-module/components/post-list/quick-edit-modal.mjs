// packages/edit-site/src/components/post-list/quick-edit-modal.js
import { __ } from "@wordpress/i18n";
import { useDispatch, useSelect } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";
import { DataForm } from "@wordpress/dataviews";
import {
  Button,
  Modal,
  __experimentalHStack as HStack
} from "@wordpress/components";
import { useEffect, useMemo, useState } from "@wordpress/element";
import { privateApis as editorPrivateApis } from "@wordpress/editor";
import { unlock } from "../../lock-unlock.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { usePostFields, PostCardPanel } = unlock(editorPrivateApis);
var fieldsWithBulkEditSupport = ["status", "date", "author", "discussion"];
function QuickEditModal({ postType, postId, closeModal }) {
  const isBulk = postId.length > 1;
  const [localEdits, setLocalEdits] = useState({});
  const { record, hasFinishedResolution, canSwitchTemplate } = useSelect(
    (select) => {
      const {
        getEditedEntityRecord,
        hasFinishedResolution: hasFinished
      } = select(coreDataStore);
      if (isBulk) {
        return {
          record: null,
          hasFinishedResolution: true
        };
      }
      const args = ["postType", postType, postId[0]];
      const { getHomePage, getPostsPageId } = unlock(
        select(coreDataStore)
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
  const { editEntityRecord, saveEditedEntityRecord } = useDispatch(coreDataStore);
  const _fields = usePostFields({ postType });
  const fields = useMemo(
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
  const form = useMemo(() => {
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
        label: __("Status"),
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
        label: __("Discussion"),
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
  useEffect(() => {
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
  return /* @__PURE__ */ jsxs(
    Modal,
    {
      overlayClassName: "dataviews-action-modal__quick-edit",
      __experimentalHideHeader: true,
      onRequestClose: closeModal,
      focusOnMount: "firstElement",
      children: [
        /* @__PURE__ */ jsx("div", { className: "dataviews-action-modal__quick-edit-header", children: /* @__PURE__ */ jsx(
          PostCardPanel,
          {
            postType,
            postId,
            onClose: closeModal,
            hideActions: true
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "dataviews-action-modal__quick-edit-content", children: hasFinishedResolution && /* @__PURE__ */ jsx(
          DataForm,
          {
            data: { ...record, ...localEdits },
            fields,
            form,
            onChange
          }
        ) }),
        /* @__PURE__ */ jsxs(HStack, { className: "dataviews-action-modal__quick-edit-footer", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              __next40pxDefaultSize: true,
              variant: "secondary",
              onClick: closeModal,
              children: __("Cancel")
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              __next40pxDefaultSize: true,
              variant: "primary",
              onClick: onSave,
              children: __("Done")
            }
          )
        ] })
      ]
    }
  );
}
export {
  QuickEditModal
};
//# sourceMappingURL=quick-edit-modal.mjs.map
