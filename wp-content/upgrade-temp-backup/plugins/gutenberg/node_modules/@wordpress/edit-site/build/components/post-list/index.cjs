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

// packages/edit-site/src/components/post-list/index.js
var post_list_exports = {};
__export(post_list_exports, {
  default: () => PostList
});
module.exports = __toCommonJS(post_list_exports);
var import_admin_ui = require("@wordpress/admin-ui");
var import_components = require("@wordpress/components");
var import_core_data = require("@wordpress/core-data");
var import_element = require("@wordpress/element");
var import_router = require("@wordpress/router");
var import_data = require("@wordpress/data");
var import_dataviews = require("@wordpress/dataviews");
var import_editor = require("@wordpress/editor");
var import_compose = require("@wordpress/compose");
var import_url = require("@wordpress/url");
var import_views = require("@wordpress/views");
var import_constants = require("../../utils/constants.cjs");
var import_add_new_post = __toESM(require("../add-new-post/index.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_dataviews_actions = require("../dataviews-actions/index.cjs");
var import_view_utils = require("./view-utils.cjs");
var import_use_notes_count = __toESM(require("./use-notes-count.cjs"));
var import_quick_edit_modal = require("./quick-edit-modal.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { usePostActions, usePostFields } = (0, import_lock_unlock.unlock)(import_editor.privateApis);
var { useLocation, useHistory } = (0, import_lock_unlock.unlock)(import_router.privateApis);
var { useEntityRecordsWithPermissions } = (0, import_lock_unlock.unlock)(import_core_data.privateApis);
var EMPTY_ARRAY = [];
var DEFAULT_STATUSES = "draft,future,pending,private,publish";
function getItemId(item) {
  return item.id.toString();
}
function getItemLevel(item) {
  return item.level;
}
function PostList({ postType }) {
  const { path, query } = useLocation();
  const { activeView = "all", postId, quickEdit = false } = query;
  const history = useHistory();
  const defaultView = import_view_utils.DEFAULT_VIEW;
  const activeViewOverrides = (0, import_element.useMemo)(
    () => (0, import_view_utils.getActiveViewOverridesForTab)(activeView),
    [activeView]
  );
  const { view, updateView, isModified, resetToDefault } = (0, import_views.useView)({
    kind: "postType",
    name: postType,
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
  const onChangeView = (0, import_compose.useEvent)((newView) => {
    updateView(newView);
    if (newView.type !== view.type) {
      history.invalidate();
    }
  });
  const [selection, setSelection] = (0, import_element.useState)(postId?.split(",") ?? []);
  const onChangeSelection = (0, import_element.useCallback)(
    (items) => {
      setSelection(items);
      history.navigate(
        (0, import_url.addQueryArgs)(path, {
          postId: items.join(",")
        })
      );
    },
    [path, history]
  );
  (0, import_element.useEffect)(() => {
    const newSelection = postId?.split(",") ?? [];
    setSelection(newSelection);
  }, [postId]);
  const fields = usePostFields({
    postType
  });
  const queryArgs = (0, import_element.useMemo)(() => {
    const filters = {};
    view.filters?.forEach((filter) => {
      if (filter.field === "status" && filter.operator === import_constants.OPERATOR_IS_ANY) {
        filters.status = filter.value;
      }
      if (filter.field === "author" && filter.operator === import_constants.OPERATOR_IS_ANY) {
        filters.author = filter.value;
      } else if (filter.field === "author" && filter.operator === import_constants.OPERATOR_IS_NONE) {
        filters.author_exclude = filter.value;
      }
      if (filter.field === "date") {
        if (!filter.value) {
          return;
        }
        if (filter.operator === import_constants.OPERATOR_BEFORE) {
          filters.before = filter.value;
        } else if (filter.operator === import_constants.OPERATOR_AFTER) {
          filters.after = filter.value;
        }
      }
    });
    if (!filters.status || filters.status === "") {
      filters.status = DEFAULT_STATUSES;
    }
    return {
      per_page: view.perPage,
      page: view.page,
      _embed: "author,wp:featuredmedia",
      order: view.sort?.direction,
      orderby: view.sort?.field,
      orderby_hierarchy: !!view.showLevels,
      search: view.search,
      ...filters
    };
  }, [view]);
  const {
    records,
    isResolving: isLoadingData,
    totalItems,
    totalPages,
    hasResolved
  } = useEntityRecordsWithPermissions("postType", postType, queryArgs);
  const postIds = (0, import_element.useMemo)(
    () => records?.map((record) => record.id) ?? [],
    [records]
  );
  const { notesCount, isLoading: isLoadingNotesCount } = (0, import_use_notes_count.default)(postIds);
  const data = (0, import_element.useMemo)(() => {
    let processedRecords = records;
    if (view?.sort?.field === "author") {
      processedRecords = (0, import_dataviews.filterSortAndPaginate)(
        records,
        { sort: { ...view.sort } },
        fields
      ).data;
    }
    if (processedRecords) {
      return processedRecords.map((record) => ({
        ...record,
        notesCount: notesCount[record.id] ?? 0
      }));
    }
    return processedRecords;
  }, [records, fields, view?.sort, notesCount]);
  const ids = data?.map((record) => getItemId(record)) ?? [];
  const prevIds = (0, import_compose.usePrevious)(ids) ?? [];
  const deletedIds = prevIds.filter((id) => !ids.includes(id));
  const postIdWasDeleted = deletedIds.includes(postId);
  (0, import_element.useEffect)(() => {
    if (postIdWasDeleted) {
      history.navigate(
        (0, import_url.addQueryArgs)(path, {
          postId: void 0
        })
      );
    }
  }, [history, postIdWasDeleted, path]);
  const paginationInfo = (0, import_element.useMemo)(
    () => ({
      totalItems,
      totalPages
    }),
    [totalItems, totalPages]
  );
  const { labels, canCreateRecord } = (0, import_data.useSelect)(
    (select) => {
      const { getPostType, canUser } = select(import_core_data.store);
      return {
        labels: getPostType(postType)?.labels,
        canCreateRecord: canUser("create", {
          kind: "postType",
          name: postType
        })
      };
    },
    [postType]
  );
  const postTypeActions = usePostActions({
    postType,
    context: "list"
  });
  const editAction = (0, import_dataviews_actions.useEditPostAction)();
  const quickEditAction = (0, import_dataviews_actions.useQuickEditPostAction)();
  const actions = (0, import_element.useMemo)(() => {
    if (view.type === import_constants.LAYOUT_LIST) {
      const editActionPrimary = { ...editAction, isPrimary: true };
      return [editActionPrimary, ...postTypeActions];
    }
    return [editAction, quickEditAction, ...postTypeActions];
  }, [view.type, editAction, quickEditAction, postTypeActions]);
  const [showAddPostModal, setShowAddPostModal] = (0, import_element.useState)(false);
  const openModal = () => setShowAddPostModal(true);
  const closeModal = () => setShowAddPostModal(false);
  const handleNewPage = ({ type, id }) => {
    history.navigate(`/${type}/${id}?canvas=edit`);
    closeModal();
  };
  const closeQuickEditModal = () => {
    history.navigate(
      (0, import_url.addQueryArgs)(path, {
        ...query,
        quickEdit: void 0
      })
    );
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_admin_ui.Page,
    {
      title: labels?.name,
      actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: labels?.add_new_item && canCreateRecord && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            variant: "primary",
            onClick: openModal,
            __next40pxDefaultSize: true,
            children: labels.add_new_item
          }
        ),
        showAddPostModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_add_new_post.default,
          {
            postType,
            onSave: handleNewPage,
            onClose: closeModal
          }
        )
      ] }) }),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_dataviews.DataViews,
          {
            paginationInfo,
            fields,
            actions,
            data: data || EMPTY_ARRAY,
            isLoading: isLoadingData || isLoadingNotesCount || !hasResolved,
            view,
            onChangeView,
            selection,
            onChangeSelection,
            isItemClickable: (item) => item.status !== "trash",
            onClickItem: ({ id }) => {
              history.navigate(`/${postType}/${id}?canvas=edit`);
            },
            getItemId,
            getItemLevel,
            defaultLayouts: import_view_utils.defaultLayouts,
            onReset: isModified ? () => {
              resetToDefault();
              history.invalidate();
            } : false
          },
          activeView
        ),
        quickEdit && !isLoadingData && selection.length > 0 && view.type !== import_constants.LAYOUT_LIST && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_quick_edit_modal.QuickEditModal,
          {
            postType,
            postId: selection,
            closeModal: closeQuickEditModal
          }
        )
      ]
    }
  );
}
//# sourceMappingURL=index.cjs.map
