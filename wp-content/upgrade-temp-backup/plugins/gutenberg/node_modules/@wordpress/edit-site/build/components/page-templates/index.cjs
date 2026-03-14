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

// packages/edit-site/src/components/page-templates/index.js
var page_templates_exports = {};
__export(page_templates_exports, {
  default: () => PageTemplates
});
module.exports = __toCommonJS(page_templates_exports);
var import_admin_ui = require("@wordpress/admin-ui");
var import_i18n = require("@wordpress/i18n");
var import_html_entities = require("@wordpress/html-entities");
var import_element = require("@wordpress/element");
var import_core_data = require("@wordpress/core-data");
var import_dataviews = require("@wordpress/dataviews");
var import_router = require("@wordpress/router");
var import_editor = require("@wordpress/editor");
var import_url = require("@wordpress/url");
var import_data = require("@wordpress/data");
var import_compose = require("@wordpress/compose");
var import_views = require("@wordpress/views");
var import_components = require("@wordpress/components");
var import_notices = require("@wordpress/notices");
var import_add_new_template = __toESM(require("../add-new-template/index.cjs"));
var import_constants = require("../../utils/constants.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_dataviews_actions = require("../dataviews-actions/index.cjs");
var import_fields = require("./fields.cjs");
var import_view_utils = require("./view-utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { usePostActions, usePostFields, templateTitleField } = (0, import_lock_unlock.unlock)(import_editor.privateApis);
var { useHistory, useLocation } = (0, import_lock_unlock.unlock)(import_router.privateApis);
var { useEntityRecordsWithPermissions } = (0, import_lock_unlock.unlock)(import_core_data.privateApis);
function PageTemplates() {
  const { path, query } = useLocation();
  const { activeView = "active", postId } = query;
  const [selection, setSelection] = (0, import_element.useState)([postId]);
  const [selectedRegisteredTemplate, setSelectedRegisteredTemplate] = (0, import_element.useState)(false);
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
  const { activeTemplatesOption, activeTheme, defaultTemplateTypes } = (0, import_data.useSelect)((select) => {
    const { getEntityRecord, getCurrentTheme } = select(import_core_data.store);
    return {
      activeTemplatesOption: getEntityRecord("root", "site")?.active_templates,
      activeTheme: getCurrentTheme(),
      defaultTemplateTypes: select(import_core_data.store).getCurrentTheme()?.default_template_types
    };
  });
  const { records: userRecords, isResolving: isLoadingUserRecords } = useEntityRecordsWithPermissions("postType", import_constants.TEMPLATE_POST_TYPE, {
    per_page: -1,
    combinedTemplates: false
  });
  const { records: staticRecords, isResolving: isLoadingStaticData } = useEntityRecordsWithPermissions("root", "registeredTemplate", {
    // This should not be needed, the endpoint returns all registered
    // templates, but it's not possible right now to turn off pagination
    // for entity configs.
    per_page: -1
  });
  const activeTemplates = (0, import_element.useMemo)(() => {
    const _active = [...staticRecords];
    if (activeTemplatesOption) {
      for (const activeSlug in activeTemplatesOption) {
        const activeId = activeTemplatesOption[activeSlug];
        const template = userRecords.find(
          (userRecord) => userRecord.id === activeId && userRecord.theme === activeTheme.stylesheet
        );
        if (template) {
          const index = _active.findIndex(
            ({ slug }) => slug === template.slug
          );
          if (index !== -1) {
            _active[index] = template;
          } else {
            _active.push(template);
          }
        }
      }
    }
    return _active;
  }, [userRecords, staticRecords, activeTemplatesOption, activeTheme]);
  let isLoadingData;
  if (activeView === "active") {
    isLoadingData = isLoadingUserRecords || isLoadingStaticData;
  } else if (activeView === "user") {
    isLoadingData = isLoadingUserRecords;
  } else {
    isLoadingData = isLoadingStaticData;
  }
  const records = (0, import_element.useMemo)(() => {
    function isCustom(record) {
      return record.is_custom ?? // For user templates it's custom if the is_wp_suggestion meta
      // field is not set and the slug is not found in the default
      // template types.
      (!record.meta?.is_wp_suggestion && !defaultTemplateTypes.some(
        (type) => type.slug === record.slug
      ));
    }
    let _records;
    if (activeView === "active") {
      _records = activeTemplates.filter(
        (record) => !isCustom(record)
      );
    } else if (activeView === "user") {
      _records = userRecords;
    } else {
      _records = staticRecords;
    }
    return _records.map((record) => ({
      ...record,
      _isActive: activeTemplates.some(
        (template) => template.id === record.id
      ),
      _isCustom: isCustom(record)
    }));
  }, [
    activeTemplates,
    defaultTemplateTypes,
    userRecords,
    staticRecords,
    activeView
  ]);
  const users = (0, import_data.useSelect)(
    (select) => {
      const { getUser } = select(import_core_data.store);
      return records.reduce((acc, record) => {
        if (record.author_text) {
          if (!acc[record.author_text]) {
            acc[record.author_text] = record.author_text;
          }
        } else if (record.author) {
          if (!acc[record.author]) {
            acc[record.author] = getUser(record.author);
          }
        }
        return acc;
      }, {});
    },
    [records]
  );
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
  const postTypeFields = usePostFields({
    postType: import_constants.TEMPLATE_POST_TYPE
  });
  const dateField = postTypeFields.find((field) => field.id === "date");
  const themeField = (0, import_fields.useThemeField)();
  const fields = (0, import_element.useMemo)(() => {
    const _fields = [
      import_fields.previewField,
      templateTitleField,
      import_fields.descriptionField,
      import_fields.activeField,
      import_fields.slugField
    ];
    if (activeView === "user") {
      _fields.push(themeField);
      if (dateField) {
        _fields.push(dateField);
      }
    }
    const elements = [];
    for (const author in users) {
      elements.push({
        value: users[author]?.id ?? author,
        label: users[author]?.name ?? author
      });
    }
    _fields.push({
      ...import_fields.authorField,
      elements
    });
    return _fields;
  }, [users, activeView, themeField, dateField]);
  const { data, paginationInfo } = (0, import_element.useMemo)(() => {
    return (0, import_dataviews.filterSortAndPaginate)(records, view, fields);
  }, [records, view, fields]);
  const { createSuccessNotice } = (0, import_data.useDispatch)(import_notices.store);
  const onActionPerformed = (0, import_element.useCallback)(
    (actionId, items) => {
      switch (actionId) {
        case "duplicate-post":
          {
            const newItem = items[0];
            const _title = typeof newItem.title === "string" ? newItem.title : newItem.title?.rendered;
            history.navigate(`/template?activeView=user`);
            createSuccessNotice(
              (0, import_i18n.sprintf)(
                // translators: %s: Title of the created post or template, e.g: "Hello world".
                (0, import_i18n.__)('"%s" successfully created.'),
                (0, import_html_entities.decodeEntities)(_title) || (0, import_i18n.__)("(no title)")
              ),
              {
                type: "snackbar",
                id: "duplicate-post-action",
                actions: [
                  {
                    label: (0, import_i18n.__)("Edit"),
                    onClick: () => {
                      history.navigate(
                        `/${newItem.type}/${newItem.id}?canvas=edit`
                      );
                    }
                  }
                ]
              }
            );
          }
          break;
      }
    },
    [history, createSuccessNotice]
  );
  const postTypeActions = usePostActions({
    postType: import_constants.TEMPLATE_POST_TYPE,
    context: "list",
    onActionPerformed
  });
  const editAction = (0, import_dataviews_actions.useEditPostAction)();
  const setActiveTemplateAction = (0, import_dataviews_actions.useSetActiveTemplateAction)();
  const actions = (0, import_element.useMemo)(
    () => activeView === "user" ? [setActiveTemplateAction, editAction, ...postTypeActions] : [setActiveTemplateAction, ...postTypeActions],
    [postTypeActions, setActiveTemplateAction, editAction, activeView]
  );
  const onChangeView = (0, import_compose.useEvent)((newView) => {
    updateView(newView);
    if (newView.type !== view.type) {
      history.invalidate();
    }
  });
  const duplicateAction = actions.find(
    (action) => action.id === "duplicate-post"
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_admin_ui.Page,
    {
      className: "edit-site-page-templates",
      title: (0, import_i18n.__)("Templates"),
      actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_add_new_template.default, {}),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
            onClickItem: (item) => {
              if (typeof item.id === "string") {
                setSelectedRegisteredTemplate(item);
              } else {
                history.navigate(
                  `/${item.type}/${item.id}?canvas=edit`
                );
              }
            },
            selection,
            defaultLayouts: import_view_utils.defaultLayouts,
            onReset: isModified ? () => {
              resetToDefault();
              history.invalidate();
            } : false
          },
          activeView
        ),
        selectedRegisteredTemplate && duplicateAction && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Modal,
          {
            title: (0, import_i18n.__)("Duplicate"),
            onRequestClose: () => setSelectedRegisteredTemplate(),
            size: "small",
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              duplicateAction.RenderModal,
              {
                items: [selectedRegisteredTemplate],
                closeModal: () => setSelectedRegisteredTemplate()
              }
            )
          }
        )
      ]
    }
  );
}
//# sourceMappingURL=index.cjs.map
