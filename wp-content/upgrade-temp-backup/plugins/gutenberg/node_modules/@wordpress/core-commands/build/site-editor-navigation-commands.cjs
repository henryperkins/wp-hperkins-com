var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/core-commands/src/site-editor-navigation-commands.js
var site_editor_navigation_commands_exports = {};
__export(site_editor_navigation_commands_exports, {
  useSiteEditorNavigationCommands: () => useSiteEditorNavigationCommands
});
module.exports = __toCommonJS(site_editor_navigation_commands_exports);
var import_commands = require("@wordpress/commands");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_icons = require("@wordpress/icons");
var import_router = require("@wordpress/router");
var import_url = require("@wordpress/url");
var import_compose = require("@wordpress/compose");
var import_html_entities = require("@wordpress/html-entities");
var import_lock_unlock = require("./lock-unlock.cjs");
var import_order_entity_records_by_search = require("./utils/order-entity-records-by-search.cjs");
var { useHistory } = (0, import_lock_unlock.unlock)(import_router.privateApis);
var icons = {
  post: import_icons.post,
  page: import_icons.page,
  wp_template: import_icons.layout,
  wp_template_part: import_icons.symbolFilled
};
function useDebouncedValue(value) {
  const [debouncedValue, setDebouncedValue] = (0, import_element.useState)("");
  const debounced = (0, import_compose.useDebounce)(setDebouncedValue, 250);
  (0, import_element.useEffect)(() => {
    debounced(value);
    return () => debounced.cancel();
  }, [debounced, value]);
  return debouncedValue;
}
var ROUTE_MAPPING = {
  "/template": "/templates",
  "/pattern": "/patterns"
};
function getSiteEditorPage() {
  return window.__experimentalExtensibleSiteEditor ? "admin.php?page=site-editor-v2" : "site-editor.php";
}
function mapRoute(path) {
  if (!window.__experimentalExtensibleSiteEditor) {
    return path;
  }
  for (const [oldPath, newPath] of Object.entries(ROUTE_MAPPING)) {
    if (path === oldPath || path.startsWith(oldPath + "?")) {
      if (path.includes("postType=wp_template_part")) {
        return "/template-parts";
      }
      return path.replace(oldPath, newPath);
    }
  }
  return path;
}
function isInSiteEditor() {
  const path = (0, import_url.getPath)(window.location.href);
  return path?.includes("site-editor.php") || path?.includes("page=site-editor-v2");
}
var getNavigationCommandLoaderPerPostType = (postType) => function useNavigationCommandLoader({ search }) {
  const history = useHistory();
  const { isBlockBasedTheme, canCreateTemplate } = (0, import_data.useSelect)(
    (select) => {
      return {
        isBlockBasedTheme: select(import_core_data.store).getCurrentTheme()?.is_block_theme,
        canCreateTemplate: select(import_core_data.store).canUser("create", {
          kind: "postType",
          name: "wp_template"
        })
      };
    },
    []
  );
  const delayedSearch = useDebouncedValue(search);
  const { records, isLoading } = (0, import_data.useSelect)(
    (select) => {
      if (!delayedSearch) {
        return {
          isLoading: false
        };
      }
      const query = {
        search: delayedSearch,
        per_page: 10,
        orderby: "relevance",
        status: [
          "publish",
          "future",
          "draft",
          "pending",
          "private"
        ]
      };
      return {
        records: select(import_core_data.store).getEntityRecords(
          "postType",
          postType,
          query
        ),
        isLoading: !select(import_core_data.store).hasFinishedResolution(
          "getEntityRecords",
          ["postType", postType, query]
        )
      };
    },
    [delayedSearch]
  );
  const commands = (0, import_element.useMemo)(() => {
    return (records ?? []).map((record) => {
      const command = {
        name: postType + "-" + record.id,
        searchLabel: record.title?.rendered + " " + record.id,
        label: record.title?.rendered ? (0, import_html_entities.decodeEntities)(record.title?.rendered) : (0, import_i18n.__)("(no title)"),
        icon: icons[postType],
        category: "edit"
      };
      if (!canCreateTemplate || postType === "post" || postType === "page" && !isBlockBasedTheme) {
        return {
          ...command,
          callback: ({ close }) => {
            const args = {
              post: record.id,
              action: "edit"
            };
            const targetUrl = (0, import_url.addQueryArgs)("post.php", args);
            document.location = targetUrl;
            close();
          }
        };
      }
      const isSiteEditor = isInSiteEditor();
      return {
        ...command,
        callback: ({ close }) => {
          if (isSiteEditor) {
            history.navigate(
              `/${postType}/${record.id}?canvas=edit`
            );
          } else {
            document.location = (0, import_url.addQueryArgs)(
              getSiteEditorPage(),
              {
                p: `/${postType}/${record.id}`,
                canvas: "edit"
              }
            );
          }
          close();
        }
      };
    });
  }, [canCreateTemplate, records, isBlockBasedTheme, history]);
  return {
    commands,
    isLoading
  };
};
var getNavigationCommandLoaderPerTemplate = (templateType) => function useNavigationCommandLoader({ search }) {
  const history = useHistory();
  const { isBlockBasedTheme, canCreateTemplate } = (0, import_data.useSelect)(
    (select) => {
      return {
        isBlockBasedTheme: select(import_core_data.store).getCurrentTheme()?.is_block_theme,
        canCreateTemplate: select(import_core_data.store).canUser("create", {
          kind: "postType",
          name: templateType
        })
      };
    },
    []
  );
  const { records, isLoading } = (0, import_data.useSelect)((select) => {
    const { getEntityRecords } = select(import_core_data.store);
    const query = { per_page: -1 };
    return {
      records: getEntityRecords("postType", templateType, query),
      isLoading: !select(import_core_data.store).hasFinishedResolution(
        "getEntityRecords",
        ["postType", templateType, query]
      )
    };
  }, []);
  const orderedRecords = (0, import_element.useMemo)(() => {
    return (0, import_order_entity_records_by_search.orderEntityRecordsBySearch)(records, search).slice(0, 10);
  }, [records, search]);
  const commands = (0, import_element.useMemo)(() => {
    if (!canCreateTemplate || !isBlockBasedTheme && !templateType === "wp_template_part") {
      return [];
    }
    const isSiteEditor = (0, import_url.getPath)(window.location.href)?.includes(
      "site-editor.php"
    );
    const result = [];
    result.push(
      ...orderedRecords.map((record) => {
        return {
          name: templateType + "-" + record.id,
          searchLabel: record.title?.rendered + " " + record.id,
          label: record.title?.rendered ? record.title?.rendered : (0, import_i18n.__)("(no title)"),
          icon: icons[templateType],
          category: "edit",
          callback: ({ close }) => {
            if (isSiteEditor) {
              history.navigate(
                `/${templateType}/${record.id}?canvas=edit`
              );
            } else {
              document.location = (0, import_url.addQueryArgs)(
                getSiteEditorPage(),
                {
                  p: `/${templateType}/${record.id}`,
                  canvas: "edit"
                }
              );
            }
            close();
          }
        };
      })
    );
    if (orderedRecords?.length > 0 && templateType === "wp_template_part") {
      result.push({
        name: "core/edit-site/open-template-parts",
        label: (0, import_i18n.__)("Go to: Template parts"),
        icon: import_icons.symbolFilled,
        category: "view",
        callback: ({ close }) => {
          if (isSiteEditor) {
            history.navigate(
              mapRoute(
                "/pattern?postType=wp_template_part&categoryId=all-parts"
              )
            );
          } else {
            document.location = (0, import_url.addQueryArgs)(
              getSiteEditorPage(),
              {
                p: mapRoute("/pattern"),
                postType: "wp_template_part",
                categoryId: "all-parts"
              }
            );
          }
          close();
        }
      });
    }
    return result;
  }, [canCreateTemplate, isBlockBasedTheme, orderedRecords, history]);
  return {
    commands,
    isLoading
  };
};
var getSiteEditorBasicNavigationCommands = () => function useSiteEditorBasicNavigationCommands() {
  const history = useHistory();
  const isSiteEditor = isInSiteEditor();
  const { isBlockBasedTheme, canCreateTemplate, canCreatePatterns } = (0, import_data.useSelect)((select) => {
    return {
      isBlockBasedTheme: select(import_core_data.store).getCurrentTheme()?.is_block_theme,
      canCreateTemplate: select(import_core_data.store).canUser("create", {
        kind: "postType",
        name: "wp_template"
      }),
      canCreatePatterns: select(import_core_data.store).canUser("create", {
        kind: "postType",
        name: "wp_block"
      })
    };
  }, []);
  const commands = (0, import_element.useMemo)(() => {
    const result = [];
    if (canCreateTemplate && isBlockBasedTheme) {
      result.push({
        name: "core/edit-site/open-styles",
        label: (0, import_i18n.__)("Go to: Styles"),
        icon: import_icons.styles,
        category: "view",
        callback: ({ close }) => {
          if (isSiteEditor) {
            history.navigate("/styles");
          } else {
            document.location = (0, import_url.addQueryArgs)(
              getSiteEditorPage(),
              {
                p: "/styles"
              }
            );
          }
          close();
        }
      });
      result.push({
        name: "core/edit-site/open-navigation",
        label: (0, import_i18n.__)("Go to: Navigation"),
        icon: import_icons.navigation,
        category: "view",
        callback: ({ close }) => {
          if (isSiteEditor) {
            history.navigate("/navigation");
          } else {
            document.location = (0, import_url.addQueryArgs)(
              getSiteEditorPage(),
              {
                p: "/navigation"
              }
            );
          }
          close();
        }
      });
      result.push({
        name: "core/edit-site/open-templates",
        label: (0, import_i18n.__)("Go to: Templates"),
        icon: import_icons.layout,
        category: "view",
        callback: ({ close }) => {
          if (isSiteEditor) {
            history.navigate(mapRoute("/template"));
          } else {
            document.location = (0, import_url.addQueryArgs)(
              getSiteEditorPage(),
              {
                p: mapRoute("/template")
              }
            );
          }
          close();
        }
      });
    }
    if (canCreatePatterns) {
      result.push({
        name: "core/edit-site/open-patterns",
        label: (0, import_i18n.__)("Go to: Patterns"),
        icon: import_icons.symbol,
        category: "view",
        callback: ({ close }) => {
          if (canCreateTemplate) {
            if (isSiteEditor) {
              history.navigate(mapRoute("/pattern"));
            } else {
              document.location = (0, import_url.addQueryArgs)(
                getSiteEditorPage(),
                {
                  p: mapRoute("/pattern")
                }
              );
            }
            close();
          } else {
            document.location.href = "edit.php?post_type=wp_block";
          }
        }
      });
    }
    return result;
  }, [
    history,
    isSiteEditor,
    canCreateTemplate,
    canCreatePatterns,
    isBlockBasedTheme
  ]);
  return {
    commands,
    isLoading: false
  };
};
var getGlobalStylesOpenCssCommands = () => function useGlobalStylesOpenCssCommands() {
  const history = useHistory();
  const isSiteEditor = isInSiteEditor();
  const { canEditCSS } = (0, import_data.useSelect)((select) => {
    const { getEntityRecord, __experimentalGetCurrentGlobalStylesId } = select(import_core_data.store);
    const globalStylesId = __experimentalGetCurrentGlobalStylesId();
    const globalStyles = globalStylesId ? getEntityRecord("root", "globalStyles", globalStylesId) : void 0;
    return {
      canEditCSS: !!globalStyles?._links?.["wp:action-edit-css"]
    };
  }, []);
  const commands = (0, import_element.useMemo)(() => {
    if (!canEditCSS) {
      return [];
    }
    return [
      {
        name: "core/open-styles-css",
        label: (0, import_i18n.__)("Open custom CSS"),
        icon: import_icons.brush,
        category: "view",
        callback: ({ close }) => {
          close();
          if (isSiteEditor) {
            history.navigate("/styles?section=/css");
          } else {
            document.location = (0, import_url.addQueryArgs)(
              getSiteEditorPage(),
              {
                p: "/styles",
                section: "/css"
              }
            );
          }
        }
      }
    ];
  }, [history, canEditCSS, isSiteEditor]);
  return {
    isLoading: false,
    commands
  };
};
function useSiteEditorNavigationCommands(isNetworkAdmin) {
  (0, import_commands.useCommandLoader)({
    name: "core/edit-site/navigate-pages",
    hook: getNavigationCommandLoaderPerPostType("page"),
    disabled: isNetworkAdmin
  });
  (0, import_commands.useCommandLoader)({
    name: "core/edit-site/navigate-posts",
    hook: getNavigationCommandLoaderPerPostType("post"),
    disabled: isNetworkAdmin
  });
  (0, import_commands.useCommandLoader)({
    name: "core/edit-site/navigate-templates",
    hook: getNavigationCommandLoaderPerTemplate("wp_template"),
    disabled: isNetworkAdmin
  });
  (0, import_commands.useCommandLoader)({
    name: "core/edit-site/navigate-template-parts",
    hook: getNavigationCommandLoaderPerTemplate("wp_template_part"),
    disabled: isNetworkAdmin
  });
  (0, import_commands.useCommandLoader)({
    name: "core/edit-site/basic-navigation",
    hook: getSiteEditorBasicNavigationCommands(),
    context: "site-editor",
    disabled: isNetworkAdmin
  });
  (0, import_commands.useCommandLoader)({
    name: "core/edit-site/global-styles-css",
    hook: getGlobalStylesOpenCssCommands(),
    disabled: isNetworkAdmin
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useSiteEditorNavigationCommands
});
//# sourceMappingURL=site-editor-navigation-commands.cjs.map
