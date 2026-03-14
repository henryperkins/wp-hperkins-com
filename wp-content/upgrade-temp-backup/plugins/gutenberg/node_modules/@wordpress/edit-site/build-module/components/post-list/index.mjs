// packages/edit-site/src/components/post-list/index.js
import { Page } from "@wordpress/admin-ui";
import { Button } from "@wordpress/components";
import {
  store as coreStore,
  privateApis as coreDataPrivateApis
} from "@wordpress/core-data";
import { useState, useMemo, useCallback, useEffect } from "@wordpress/element";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { useSelect } from "@wordpress/data";
import { DataViews, filterSortAndPaginate } from "@wordpress/dataviews";
import { privateApis as editorPrivateApis } from "@wordpress/editor";
import { useEvent, usePrevious } from "@wordpress/compose";
import { addQueryArgs } from "@wordpress/url";
import { useView } from "@wordpress/views";
import {
  OPERATOR_IS_ANY,
  OPERATOR_IS_NONE,
  OPERATOR_BEFORE,
  OPERATOR_AFTER,
  LAYOUT_LIST
} from "../../utils/constants.mjs";
import AddNewPostModal from "../add-new-post/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import {
  useEditPostAction,
  useQuickEditPostAction
} from "../dataviews-actions/index.mjs";
import {
  defaultLayouts,
  DEFAULT_VIEW,
  getActiveViewOverridesForTab
} from "./view-utils.mjs";
import useNotesCount from "./use-notes-count.mjs";
import { QuickEditModal } from "./quick-edit-modal.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { usePostActions, usePostFields } = unlock(editorPrivateApis);
var { useLocation, useHistory } = unlock(routerPrivateApis);
var { useEntityRecordsWithPermissions } = unlock(coreDataPrivateApis);
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
  const defaultView = DEFAULT_VIEW;
  const activeViewOverrides = useMemo(
    () => getActiveViewOverridesForTab(activeView),
    [activeView]
  );
  const { view, updateView, isModified, resetToDefault } = useView({
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
        addQueryArgs(path, {
          ...query,
          pageNumber: newQueryParams.page,
          search: newQueryParams.search || void 0
        })
      );
    }
  });
  const onChangeView = useEvent((newView) => {
    updateView(newView);
    if (newView.type !== view.type) {
      history.invalidate();
    }
  });
  const [selection, setSelection] = useState(postId?.split(",") ?? []);
  const onChangeSelection = useCallback(
    (items) => {
      setSelection(items);
      history.navigate(
        addQueryArgs(path, {
          postId: items.join(",")
        })
      );
    },
    [path, history]
  );
  useEffect(() => {
    const newSelection = postId?.split(",") ?? [];
    setSelection(newSelection);
  }, [postId]);
  const fields = usePostFields({
    postType
  });
  const queryArgs = useMemo(() => {
    const filters = {};
    view.filters?.forEach((filter) => {
      if (filter.field === "status" && filter.operator === OPERATOR_IS_ANY) {
        filters.status = filter.value;
      }
      if (filter.field === "author" && filter.operator === OPERATOR_IS_ANY) {
        filters.author = filter.value;
      } else if (filter.field === "author" && filter.operator === OPERATOR_IS_NONE) {
        filters.author_exclude = filter.value;
      }
      if (filter.field === "date") {
        if (!filter.value) {
          return;
        }
        if (filter.operator === OPERATOR_BEFORE) {
          filters.before = filter.value;
        } else if (filter.operator === OPERATOR_AFTER) {
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
  const postIds = useMemo(
    () => records?.map((record) => record.id) ?? [],
    [records]
  );
  const { notesCount, isLoading: isLoadingNotesCount } = useNotesCount(postIds);
  const data = useMemo(() => {
    let processedRecords = records;
    if (view?.sort?.field === "author") {
      processedRecords = filterSortAndPaginate(
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
  const prevIds = usePrevious(ids) ?? [];
  const deletedIds = prevIds.filter((id) => !ids.includes(id));
  const postIdWasDeleted = deletedIds.includes(postId);
  useEffect(() => {
    if (postIdWasDeleted) {
      history.navigate(
        addQueryArgs(path, {
          postId: void 0
        })
      );
    }
  }, [history, postIdWasDeleted, path]);
  const paginationInfo = useMemo(
    () => ({
      totalItems,
      totalPages
    }),
    [totalItems, totalPages]
  );
  const { labels, canCreateRecord } = useSelect(
    (select) => {
      const { getPostType, canUser } = select(coreStore);
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
  const editAction = useEditPostAction();
  const quickEditAction = useQuickEditPostAction();
  const actions = useMemo(() => {
    if (view.type === LAYOUT_LIST) {
      const editActionPrimary = { ...editAction, isPrimary: true };
      return [editActionPrimary, ...postTypeActions];
    }
    return [editAction, quickEditAction, ...postTypeActions];
  }, [view.type, editAction, quickEditAction, postTypeActions]);
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const openModal = () => setShowAddPostModal(true);
  const closeModal = () => setShowAddPostModal(false);
  const handleNewPage = ({ type, id }) => {
    history.navigate(`/${type}/${id}?canvas=edit`);
    closeModal();
  };
  const closeQuickEditModal = () => {
    history.navigate(
      addQueryArgs(path, {
        ...query,
        quickEdit: void 0
      })
    );
  };
  return /* @__PURE__ */ jsxs(
    Page,
    {
      title: labels?.name,
      actions: /* @__PURE__ */ jsx(Fragment, { children: labels?.add_new_item && canCreateRecord && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "primary",
            onClick: openModal,
            __next40pxDefaultSize: true,
            children: labels.add_new_item
          }
        ),
        showAddPostModal && /* @__PURE__ */ jsx(
          AddNewPostModal,
          {
            postType,
            onSave: handleNewPage,
            onClose: closeModal
          }
        )
      ] }) }),
      children: [
        /* @__PURE__ */ jsx(
          DataViews,
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
            defaultLayouts,
            onReset: isModified ? () => {
              resetToDefault();
              history.invalidate();
            } : false
          },
          activeView
        ),
        quickEdit && !isLoadingData && selection.length > 0 && view.type !== LAYOUT_LIST && /* @__PURE__ */ jsx(
          QuickEditModal,
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
export {
  PostList as default
};
//# sourceMappingURL=index.mjs.map
