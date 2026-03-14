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

// packages/edit-site/src/components/page-patterns/index.js
var page_patterns_exports = {};
__export(page_patterns_exports, {
  default: () => DataviewsPatterns
});
module.exports = __toCommonJS(page_patterns_exports);
var import_admin_ui = require("@wordpress/admin-ui");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_block_editor = require("@wordpress/block-editor");
var import_dataviews = require("@wordpress/dataviews");
var import_core_data = require("@wordpress/core-data");
var import_editor = require("@wordpress/editor");
var import_router = require("@wordpress/router");
var import_views = require("@wordpress/views");
var import_data = require("@wordpress/data");
var import_url = require("@wordpress/url");
var import_constants = require("../../utils/constants.cjs");
var import_use_pattern_settings = __toESM(require("./use-pattern-settings.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_use_patterns = __toESM(require("./use-patterns.cjs"));
var import_actions = __toESM(require("./actions.cjs"));
var import_dataviews_actions = require("../dataviews-actions/index.cjs");
var import_fields = require("./fields.cjs");
var import_use_pattern_categories = __toESM(require("../sidebar-navigation-screen-patterns/use-pattern-categories.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var { ExperimentalBlockEditorProvider } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
var { usePostActions, patternTitleField } = (0, import_lock_unlock.unlock)(import_editor.privateApis);
var { useLocation, useHistory } = (0, import_lock_unlock.unlock)(import_router.privateApis);
var EMPTY_ARRAY = [];
var defaultLayouts = {
  [import_constants.LAYOUT_TABLE]: {
    layout: {
      styles: {
        author: {
          width: "1%"
        }
      }
    }
  },
  [import_constants.LAYOUT_GRID]: {
    layout: {
      badgeFields: ["sync-status"]
    }
  }
};
var DEFAULT_VIEW = {
  type: import_constants.LAYOUT_GRID,
  perPage: 20,
  titleField: "title",
  mediaField: "preview",
  fields: ["sync-status"],
  filters: [],
  ...defaultLayouts[import_constants.LAYOUT_GRID]
};
function usePagePatternsHeader(type, categoryId) {
  const { patternCategories } = (0, import_use_pattern_categories.default)();
  const templatePartAreas = (0, import_data.useSelect)(
    (select) => select(import_core_data.store).getCurrentTheme()?.default_template_part_areas || [],
    []
  );
  let title, description, patternCategory;
  if (type === import_constants.TEMPLATE_PART_POST_TYPE) {
    const templatePartArea = templatePartAreas.find(
      (area) => area.area === categoryId
    );
    title = templatePartArea?.label || (0, import_i18n.__)("All Template Parts");
    description = templatePartArea?.description || (0, import_i18n.__)("Includes every template part defined for any area.");
  } else if (type === import_constants.PATTERN_TYPES.user && !!categoryId) {
    patternCategory = patternCategories.find(
      (category) => category.name === categoryId
    );
    title = patternCategory?.label;
    description = patternCategory?.description;
  }
  return { title, description };
}
function DataviewsPatterns() {
  const { path, query } = useLocation();
  const { postType = "wp_block", categoryId: categoryIdFromURL } = query;
  const history = useHistory();
  const categoryId = categoryIdFromURL || import_constants.PATTERN_DEFAULT_CATEGORY;
  const { view, updateView, isModified, resetToDefault } = (0, import_views.useView)({
    kind: "postType",
    name: postType,
    slug: "default",
    defaultView: DEFAULT_VIEW,
    queryParams: {
      page: query.pageNumber,
      search: query.search
    },
    onChangeQueryParams: (params) => {
      history.navigate(
        (0, import_url.addQueryArgs)(path, {
          ...query,
          pageNumber: params.page,
          search: params.search
        })
      );
    }
  });
  const viewSyncStatus = view.filters?.find(
    ({ field }) => field === "sync-status"
  )?.value;
  const { patterns, isResolving } = (0, import_use_patterns.default)(postType, categoryId, {
    search: view.search,
    syncStatus: viewSyncStatus
  });
  const { records } = (0, import_core_data.useEntityRecords)("postType", import_constants.TEMPLATE_PART_POST_TYPE, {
    per_page: -1
  });
  const authors = (0, import_element.useMemo)(() => {
    if (!records) {
      return EMPTY_ARRAY;
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
  const fields = (0, import_element.useMemo)(() => {
    const _fields = [import_fields.previewField, patternTitleField];
    if (postType === import_constants.PATTERN_TYPES.user) {
      _fields.push(import_fields.patternStatusField);
    } else if (postType === import_constants.TEMPLATE_PART_POST_TYPE) {
      _fields.push({
        ...import_fields.templatePartAuthorField,
        elements: authors
      });
    }
    return _fields;
  }, [postType, authors]);
  const { data, paginationInfo } = (0, import_element.useMemo)(() => {
    const viewWithoutFilters = { ...view };
    delete viewWithoutFilters.search;
    if (postType !== import_constants.TEMPLATE_PART_POST_TYPE) {
      viewWithoutFilters.filters = [];
    }
    return (0, import_dataviews.filterSortAndPaginate)(patterns, viewWithoutFilters, fields);
  }, [patterns, view, fields, postType]);
  const dataWithPermissions = (0, import_use_patterns.useAugmentPatternsWithPermissions)(data);
  const templatePartActions = usePostActions({
    postType: import_constants.TEMPLATE_PART_POST_TYPE,
    context: "list"
  });
  const patternActions = usePostActions({
    postType: import_constants.PATTERN_TYPES.user,
    context: "list"
  });
  const editAction = (0, import_dataviews_actions.useEditPostAction)();
  const actions = (0, import_element.useMemo)(() => {
    if (postType === import_constants.TEMPLATE_PART_POST_TYPE) {
      return [editAction, ...templatePartActions].filter(Boolean);
    }
    return [editAction, ...patternActions].filter(Boolean);
  }, [editAction, postType, templatePartActions, patternActions]);
  const settings = (0, import_use_pattern_settings.default)();
  const { title, description } = usePagePatternsHeader(
    postType,
    categoryId
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExperimentalBlockEditorProvider, { settings, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_admin_ui.Page,
    {
      className: "edit-site-page-patterns-dataviews",
      title,
      subTitle: description,
      actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_actions.default,
        {
          categoryId,
          postType
        }
      ),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_dataviews.DataViews,
        {
          paginationInfo,
          fields,
          actions,
          data: dataWithPermissions || EMPTY_ARRAY,
          getItemId: (item) => item.name ?? item.id,
          isLoading: isResolving,
          isItemClickable: (item) => item.type !== import_constants.PATTERN_TYPES.theme,
          onClickItem: (item) => {
            history.navigate(
              `/${item.type}/${[
                import_constants.PATTERN_TYPES.user,
                import_constants.TEMPLATE_PART_POST_TYPE
              ].includes(item.type) ? item.id : item.name}?canvas=edit`
            );
          },
          view,
          onChangeView: updateView,
          defaultLayouts,
          onReset: isModified ? resetToDefault : false
        },
        categoryId + postType
      )
    }
  ) });
}
//# sourceMappingURL=index.cjs.map
