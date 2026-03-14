// packages/editor/src/components/sidebar/dataform-post-summary.js
import { __ } from "@wordpress/i18n";
import { useDispatch, useSelect } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";
import { DataForm } from "@wordpress/dataviews";
import { __experimentalVStack as VStack } from "@wordpress/components";
import { useMemo } from "@wordpress/element";
import PostCardPanel from "../post-card-panel/index.mjs";
import PostPanelSection from "../post-panel-section/index.mjs";
import { store as editorStore } from "../../store/index.mjs";
import PostTrash from "../post-trash/index.mjs";
import usePostFields from "../post-fields/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var form = {
  layout: {
    type: "panel"
  },
  fields: [
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
  ]
};
function DataFormPostSummary({ onActionPerformed }) {
  const { postType, postId } = useSelect((select) => {
    const { getCurrentPostType, getCurrentPostId } = unlock(
      select(editorStore)
    );
    return {
      postType: getCurrentPostType(),
      postId: getCurrentPostId()
    };
  }, []);
  const record = useSelect(
    (select) => {
      if (!postType || !postId) {
        return null;
      }
      return select(coreDataStore).getEditedEntityRecord(
        "postType",
        postType,
        postId
      );
    },
    [postType, postId]
  );
  const { editEntityRecord } = useDispatch(coreDataStore);
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
      return field;
    }),
    [_fields]
  );
  const onChange = (edits) => {
    if (edits.status && edits.status !== "future" && record?.status === "future" && new Date(record.date) > /* @__PURE__ */ new Date()) {
      edits.date = null;
    }
    if (edits.status && edits.status === "private" && record?.password) {
      edits.password = "";
    }
    editEntityRecord("postType", postType, postId, edits);
  };
  return /* @__PURE__ */ jsx(PostPanelSection, { className: "editor-post-summary", children: /* @__PURE__ */ jsxs(VStack, { spacing: 4, children: [
    /* @__PURE__ */ jsx(
      PostCardPanel,
      {
        postType,
        postId,
        onActionPerformed
      }
    ),
    /* @__PURE__ */ jsx(
      DataForm,
      {
        data: record,
        fields,
        form,
        onChange
      }
    ),
    /* @__PURE__ */ jsx(PostTrash, { onActionPerformed })
  ] }) });
}
export {
  DataFormPostSummary as default
};
//# sourceMappingURL=dataform-post-summary.mjs.map
