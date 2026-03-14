// packages/editor/src/components/post-card-panel/index.js
import {
  Icon,
  Button,
  __experimentalHStack as HStack,
  __experimentalVStack as VStack,
  __experimentalText as Text,
  privateApis as componentsPrivateApis
} from "@wordpress/components";
import { moreVertical, close } from "@wordpress/icons";
import { store as coreStore } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { __unstableStripHTML as stripHTML } from "@wordpress/dom";
import { store as editorStore } from "../../store/index.mjs";
import {
  TEMPLATE_POST_TYPE,
  TEMPLATE_PART_POST_TYPE
} from "../../store/constants.mjs";
import { unlock } from "../../lock-unlock.mjs";
import PostActions from "../post-actions/index.mjs";
import usePageTypeBadge from "../../utils/pageTypeBadge.mjs";
import { getTemplateInfo } from "../../utils/get-template-info.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { Badge } = unlock(componentsPrivateApis);
function PostCardPanel({
  postType,
  postId,
  hideActions = false,
  onActionPerformed,
  onClose
}) {
  const postIds = useMemo(
    () => Array.isArray(postId) ? postId : [postId],
    [postId]
  );
  const { postTitle, icon, labels, isRevision } = useSelect(
    (select) => {
      const { getEditedEntityRecord, getCurrentTheme, getPostType } = select(coreStore);
      const {
        getPostIcon,
        getCurrentPostType,
        isRevisionsMode,
        getCurrentRevision
      } = unlock(select(editorStore));
      let _title = "";
      if (isRevisionsMode()) {
        const parentPostType = getCurrentPostType();
        const _record2 = getCurrentRevision();
        _title = _record2?.title?.rendered || _record2?.title?.raw || "";
        return {
          postTitle: _title,
          icon: getPostIcon(parentPostType, {
            area: _record2?.area
          }),
          labels: getPostType(parentPostType)?.labels,
          isRevision: true
        };
      }
      const _record = getEditedEntityRecord(
        "postType",
        postType,
        postIds[0]
      );
      if (postIds.length === 1) {
        const { default_template_types: templateTypes = [] } = getCurrentTheme() ?? {};
        const _templateInfo = [
          TEMPLATE_POST_TYPE,
          TEMPLATE_PART_POST_TYPE
        ].includes(postType) ? getTemplateInfo({
          template: _record,
          templateTypes
        }) : {};
        _title = _templateInfo?.title || _record?.title;
      }
      return {
        postTitle: _title,
        icon: getPostIcon(postType, {
          area: _record?.area
        }),
        labels: getPostType(postType)?.labels
      };
    },
    [postIds, postType]
  );
  const pageTypeBadge = usePageTypeBadge(postId);
  let title = __("No title");
  if (labels?.name && postIds.length > 1) {
    title = sprintf(
      // translators: %1$d number of selected items %2$s: Name of the plural post type e.g: "Posts".
      __("%1$d %2$s"),
      postIds.length,
      labels?.name
    );
  } else if (postTitle) {
    title = stripHTML(postTitle);
  }
  return /* @__PURE__ */ jsxs(VStack, { spacing: 1, className: "editor-post-card-panel", children: [
    /* @__PURE__ */ jsxs(
      HStack,
      {
        spacing: 2,
        className: "editor-post-card-panel__header",
        alignment: "flex-start",
        children: [
          /* @__PURE__ */ jsx(Icon, { className: "editor-post-card-panel__icon", icon }),
          /* @__PURE__ */ jsxs(
            Text,
            {
              numberOfLines: 2,
              truncate: true,
              className: "editor-post-card-panel__title",
              as: "h2",
              children: [
                /* @__PURE__ */ jsx("span", { className: "editor-post-card-panel__title-name", children: title }),
                pageTypeBadge && postIds.length === 1 && /* @__PURE__ */ jsx(Badge, { children: pageTypeBadge })
              ]
            }
          ),
          !hideActions && postIds.length === 1 && /* @__PURE__ */ jsx(Fragment, { children: isRevision ? /* @__PURE__ */ jsx(
            Button,
            {
              size: "small",
              icon: moreVertical,
              label: __("Actions"),
              disabled: true,
              accessibleWhenDisabled: true,
              className: "editor-all-actions-button"
            }
          ) : /* @__PURE__ */ jsx(
            PostActions,
            {
              postType,
              postId: postIds[0],
              onActionPerformed
            }
          ) }),
          onClose && /* @__PURE__ */ jsx(
            Button,
            {
              size: "small",
              icon: close,
              label: __("Close"),
              onClick: onClose
            }
          )
        ]
      }
    ),
    postIds.length > 1 && /* @__PURE__ */ jsx(Text, { className: "editor-post-card-panel__description", children: sprintf(
      // translators: %s: Name of the plural post type e.g: "Posts".
      __("Changes will be applied to all selected %s."),
      labels?.name.toLowerCase()
    ) })
  ] });
}
export {
  PostCardPanel as default
};
//# sourceMappingURL=index.mjs.map
