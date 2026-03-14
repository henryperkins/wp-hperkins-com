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

// packages/edit-site/src/components/page-templates/index-legacy.js
var index_legacy_exports = {};
__export(index_legacy_exports, {
  default: () => PageTemplates
});
module.exports = __toCommonJS(index_legacy_exports);
var import_admin_ui = require("@wordpress/admin-ui");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_core_data = require("@wordpress/core-data");
var import_dataviews = require("@wordpress/dataviews");
var import_router = require("@wordpress/router");
var import_editor = require("@wordpress/editor");
var import_url = require("@wordpress/url");
var import_compose = require("@wordpress/compose");
var import_views = require("@wordpress/views");
var import_add_new_template_legacy = __toESM(require("../add-new-template-legacy/index.cjs"));
var import_constants = require("../../utils/constants.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_dataviews_actions = require("../dataviews-actions/index.cjs");
var import_fields = require("./fields.cjs");
var import_view_utils = require("./view-utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { usePostActions, templateTitleField } = (0, import_lock_unlock.unlock)(import_editor.privateApis);
var { useHistory, useLocation } = (0, import_lock_unlock.unlock)(import_router.privateApis);
var { useEntityRecordsWithPermissions } = (0, import_lock_unlock.unlock)(import_core_data.privateApis);
function PageTemplates() {
  const { path, query } = useLocation();
  const { activeView = "active", postId } = query;
  const [selection, setSelection] = (0, import_element.useState)([postId]);
  const defaultView = import_view_utils.DEFAULT_VIEW;
  const activeViewOverrides = (0, import_element.useMemo)(
    () => (0, import_view_utils.getActiveViewOverridesForTab)(activeView),
    [activeView]
  );
  const { view, updateView, isModified, resetToDefault } = (0, import_views.useView)({
    kind: "postType",
    name: import_constants.TEMPLATE_POST_TYPE,
    slug: "default",
    defaultView,
    activeViewOverrides,
    queryParams: {
      page: query.pageNumber,
      search: query.search
    },
    onChangeQueryParams: (newQueryParams) => {
      history.navigate(
        (0, import_url.addQueryArgs)(path, {
          ...query,
          pageNumber: newQueryParams.page,
          search: newQueryParams.search || void 0
        })
      );
    }
  });
  const { records, isResolving: isLoadingData } = useEntityRecordsWithPermissions("postType", import_constants.TEMPLATE_POST_TYPE, {
    per_page: -1
  });
  const history = useHistory();
  const onChangeSelection = (0, import_element.useCallback)(
    (items) => {
      setSelection(items);
      if (view?.type === "list") {
        history.navigate(
          (0, import_url.addQueryArgs)(path, {
            postId: items.length === 1 ? items[0] : void 0
          })
        );
      }
    },
    [history, path, view?.type]
  );
  const authors = (0, import_element.useMemo)(() => {
    if (!records) {
      return [];
    }
    const authorsSet = /* @__PURE__ */ new Set();
    records.forEach((template) => {
      authorsSet.add(template.author_text);
    });
    return Array.from(authorsSet).map((author) => ({
      value: author,
      label: author
    }));
  }, [records]);
  const fields = (0, import_element.useMemo)(
    () => [
      import_fields.previewField,
      templateTitleField,
      import_fields.descriptionField,
      {
        ...import_fields.authorField,
        elements: authors
      }
    ],
    [authors]
  );
  const { data, paginationInfo } = (0, import_element.useMemo)(() => {
    return (0, import_dataviews.filterSortAndPaginate)(records, view, fields);
  }, [records, view, fields]);
  const postTypeActions = usePostActions({
    postType: import_constants.TEMPLATE_POST_TYPE,
    context: "list"
  });
  const editAction = (0, import_dataviews_actions.useEditPostAction)();
  const actions = (0, import_element.useMemo)(
    () => [editAction, ...postTypeActions],
    [postTypeActions, editAction]
  );
  const onChangeView = (0, import_compose.useEvent)((newView) => {
    updateView(newView);
    if (newView.type !== view.type) {
      history.invalidate();
    }
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_admin_ui.Page,
    {
      className: "edit-site-page-templates",
      title: (0, import_i18n.__)("Templates"),
      actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_add_new_template_legacy.default, {}),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_dataviews.DataViews,
        {
          paginationInfo,
          fields,
          actions,
          data,
          isLoading: isLoadingData,
          view,
          onChangeView,
          onChangeSelection,
          isItemClickable: () => true,
          onClickItem: ({ id }) => {
            history.navigate(`/wp_template/${id}?canvas=edit`);
          },
          selection,
          defaultLayouts: import_view_utils.defaultLayouts,
          onReset: isModified ? () => {
            resetToDefault();
            history.invalidate();
          } : false
        },
        activeView
      )
    }
  );
}
//# sourceMappingURL=index-legacy.cjs.map
