// packages/edit-site/src/components/page-templates/index-legacy.js
import { Page } from "@wordpress/admin-ui";
import { __ } from "@wordpress/i18n";
import { useState, useMemo, useCallback } from "@wordpress/element";
import { privateApis as corePrivateApis } from "@wordpress/core-data";
import { DataViews, filterSortAndPaginate } from "@wordpress/dataviews";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { privateApis as editorPrivateApis } from "@wordpress/editor";
import { addQueryArgs } from "@wordpress/url";
import { useEvent } from "@wordpress/compose";
import { useView } from "@wordpress/views";
import AddNewTemplate from "../add-new-template-legacy/index.mjs";
import { TEMPLATE_POST_TYPE } from "../../utils/constants.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { useEditPostAction } from "../dataviews-actions/index.mjs";
import { authorField, descriptionField, previewField } from "./fields.mjs";
import {
  defaultLayouts,
  DEFAULT_VIEW,
  getActiveViewOverridesForTab
} from "./view-utils.mjs";
import { jsx } from "react/jsx-runtime";
var { usePostActions, templateTitleField } = unlock(editorPrivateApis);
var { useHistory, useLocation } = unlock(routerPrivateApis);
var { useEntityRecordsWithPermissions } = unlock(corePrivateApis);
function PageTemplates() {
  const { path, query } = useLocation();
  const { activeView = "active", postId } = query;
  const [selection, setSelection] = useState([postId]);
  const defaultView = DEFAULT_VIEW;
  const activeViewOverrides = useMemo(
    () => getActiveViewOverridesForTab(activeView),
    [activeView]
  );
  const { view, updateView, isModified, resetToDefault } = useView({
    kind: "postType",
    name: TEMPLATE_POST_TYPE,
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
  const { records, isResolving: isLoadingData } = useEntityRecordsWithPermissions("postType", TEMPLATE_POST_TYPE, {
    per_page: -1
  });
  const history = useHistory();
  const onChangeSelection = useCallback(
    (items) => {
      setSelection(items);
      if (view?.type === "list") {
        history.navigate(
          addQueryArgs(path, {
            postId: items.length === 1 ? items[0] : void 0
          })
        );
      }
    },
    [history, path, view?.type]
  );
  const authors = useMemo(() => {
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
  const fields = useMemo(
    () => [
      previewField,
      templateTitleField,
      descriptionField,
      {
        ...authorField,
        elements: authors
      }
    ],
    [authors]
  );
  const { data, paginationInfo } = useMemo(() => {
    return filterSortAndPaginate(records, view, fields);
  }, [records, view, fields]);
  const postTypeActions = usePostActions({
    postType: TEMPLATE_POST_TYPE,
    context: "list"
  });
  const editAction = useEditPostAction();
  const actions = useMemo(
    () => [editAction, ...postTypeActions],
    [postTypeActions, editAction]
  );
  const onChangeView = useEvent((newView) => {
    updateView(newView);
    if (newView.type !== view.type) {
      history.invalidate();
    }
  });
  return /* @__PURE__ */ jsx(
    Page,
    {
      className: "edit-site-page-templates",
      title: __("Templates"),
      actions: /* @__PURE__ */ jsx(AddNewTemplate, {}),
      children: /* @__PURE__ */ jsx(
        DataViews,
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
          defaultLayouts,
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
export {
  PageTemplates as default
};
//# sourceMappingURL=index-legacy.mjs.map
