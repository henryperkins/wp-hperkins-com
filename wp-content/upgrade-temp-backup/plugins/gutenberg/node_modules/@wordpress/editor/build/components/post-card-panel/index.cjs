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

// packages/editor/src/components/post-card-panel/index.js
var post_card_panel_exports = {};
__export(post_card_panel_exports, {
  default: () => PostCardPanel
});
module.exports = __toCommonJS(post_card_panel_exports);
var import_components = require("@wordpress/components");
var import_icons = require("@wordpress/icons");
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_dom = require("@wordpress/dom");
var import_store = require("../../store/index.cjs");
var import_constants = require("../../store/constants.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_post_actions = __toESM(require("../post-actions/index.cjs"));
var import_pageTypeBadge = __toESM(require("../../utils/pageTypeBadge.cjs"));
var import_get_template_info = require("../../utils/get-template-info.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { Badge } = (0, import_lock_unlock.unlock)(import_components.privateApis);
function PostCardPanel({
  postType,
  postId,
  hideActions = false,
  onActionPerformed,
  onClose
}) {
  const postIds = (0, import_element.useMemo)(
    () => Array.isArray(postId) ? postId : [postId],
    [postId]
  );
  const { postTitle, icon, labels, isRevision } = (0, import_data.useSelect)(
    (select) => {
      const { getEditedEntityRecord, getCurrentTheme, getPostType } = select(import_core_data.store);
      const {
        getPostIcon,
        getCurrentPostType,
        isRevisionsMode,
        getCurrentRevision
      } = (0, import_lock_unlock.unlock)(select(import_store.store));
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
          import_constants.TEMPLATE_POST_TYPE,
          import_constants.TEMPLATE_PART_POST_TYPE
        ].includes(postType) ? (0, import_get_template_info.getTemplateInfo)({
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
  const pageTypeBadge = (0, import_pageTypeBadge.default)(postId);
  let title = (0, import_i18n.__)("No title");
  if (labels?.name && postIds.length > 1) {
    title = (0, import_i18n.sprintf)(
      // translators: %1$d number of selected items %2$s: Name of the plural post type e.g: "Posts".
      (0, import_i18n.__)("%1$d %2$s"),
      postIds.length,
      labels?.name
    );
  } else if (postTitle) {
    title = (0, import_dom.__unstableStripHTML)(postTitle);
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 1, className: "editor-post-card-panel", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      import_components.__experimentalHStack,
      {
        spacing: 2,
        className: "editor-post-card-panel__header",
        alignment: "flex-start",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Icon, { className: "editor-post-card-panel__icon", icon }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            import_components.__experimentalText,
            {
              numberOfLines: 2,
              truncate: true,
              className: "editor-post-card-panel__title",
              as: "h2",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "editor-post-card-panel__title-name", children: title }),
                pageTypeBadge && postIds.length === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: pageTypeBadge })
              ]
            }
          ),
          !hideActions && postIds.length === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: isRevision ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              size: "small",
              icon: import_icons.moreVertical,
              label: (0, import_i18n.__)("Actions"),
              disabled: true,
              accessibleWhenDisabled: true,
              className: "editor-all-actions-button"
            }
          ) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_post_actions.default,
            {
              postType,
              postId: postIds[0],
              onActionPerformed
            }
          ) }),
          onClose && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              size: "small",
              icon: import_icons.close,
              label: (0, import_i18n.__)("Close"),
              onClick: onClose
            }
          )
        ]
      }
    ),
    postIds.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { className: "editor-post-card-panel__description", children: (0, import_i18n.sprintf)(
      // translators: %s: Name of the plural post type e.g: "Posts".
      (0, import_i18n.__)("Changes will be applied to all selected %s."),
      labels?.name.toLowerCase()
    ) })
  ] });
}
//# sourceMappingURL=index.cjs.map
