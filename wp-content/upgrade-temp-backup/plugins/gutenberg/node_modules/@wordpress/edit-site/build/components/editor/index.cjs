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

// packages/edit-site/src/components/editor/index.js
var editor_exports = {};
__export(editor_exports, {
  default: () => EditSiteEditor
});
module.exports = __toCommonJS(editor_exports);
var import_clsx = __toESM(require("clsx"));
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_compose = require("@wordpress/compose");
var import_editor = require("@wordpress/editor");
var import_i18n = require("@wordpress/i18n");
var import_core_data = require("@wordpress/core-data");
var import_block_library = require("@wordpress/block-library");
var import_element = require("@wordpress/element");
var import_notices = require("@wordpress/notices");
var import_router = require("@wordpress/router");
var import_html_entities = require("@wordpress/html-entities");
var import_icons = require("@wordpress/icons");
var import_block_editor = require("@wordpress/block-editor");
var import_url = require("@wordpress/url");
var import_welcome_guide = __toESM(require("../welcome-guide/index.cjs"));
var import_canvas_loader = __toESM(require("../canvas-loader/index.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_use_site_editor_settings = require("../block-editor/use-site-editor-settings.cjs");
var import_plugin_template_setting_panel = __toESM(require("../plugin-template-setting-panel/index.cjs"));
var import_is_previewing_theme = require("../../utils/is-previewing-theme.cjs");
var import_save_button = __toESM(require("../save-button/index.cjs"));
var import_save_panel = __toESM(require("../save-panel/index.cjs"));
var import_more_menu = __toESM(require("../more-menu/index.cjs"));
var import_site_icon = __toESM(require("../site-icon/index.cjs"));
var import_use_editor_iframe_props = __toESM(require("../block-editor/use-editor-iframe-props.cjs"));
var import_use_viewport_sync = require("../block-editor/use-viewport-sync.cjs");
var import_use_editor_title = __toESM(require("./use-editor-title.cjs"));
var import_hooks = require("../layout/hooks.cjs");
var import_use_adapt_editor_to_canvas = require("./use-adapt-editor-to-canvas.cjs");
var import_use_resolve_edited_entity = require("./use-resolve-edited-entity.cjs");
var import_site_preview = __toESM(require("./site-preview.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var { Editor, BackButton } = (0, import_lock_unlock.unlock)(import_editor.privateApis);
var { useHistory, useLocation } = (0, import_lock_unlock.unlock)(import_router.privateApis);
var { BlockKeyboardShortcuts } = (0, import_lock_unlock.unlock)(import_block_library.privateApis);
var toggleHomeIconVariants = {
  edit: {
    opacity: 0,
    scale: 0.2
  },
  hover: {
    opacity: 1,
    scale: 1,
    clipPath: "inset( 22% round 2px )"
  }
};
var siteIconVariants = {
  edit: {
    clipPath: "inset(0% round 0px)"
  },
  hover: {
    clipPath: "inset( 22% round 2px )"
  },
  tap: {
    clipPath: "inset(0% round 0px)"
  }
};
function getListPathForPostType(postType) {
  switch (postType) {
    case "navigation":
      return "/navigation";
    case "wp_block":
      return "/pattern?postType=wp_block";
    case "wp_template_part":
      return "/pattern?postType=wp_template_part";
    case "wp_template":
      return "/template";
    case "page":
      return "/page";
    case "post":
      return "/";
  }
  throw "Unknown post type";
}
function getNavigationPath(location, postType) {
  const { path, name } = location;
  if ([
    "pattern-item",
    "template-part-item",
    "page-item",
    "template-item",
    "static-template-item",
    "post-item"
  ].includes(name)) {
    return getListPathForPostType(postType);
  }
  return (0, import_url.addQueryArgs)(path, { canvas: void 0 });
}
function EditSiteEditor({ isHomeRoute = false }) {
  const disableMotion = (0, import_compose.useReducedMotion)();
  const location = useLocation();
  const history = useHistory();
  const { canvas = "view" } = location.query;
  const isLoading = (0, import_hooks.useIsSiteEditorLoading)();
  (0, import_use_adapt_editor_to_canvas.useAdaptEditorToCanvas)(canvas);
  const entity = (0, import_use_resolve_edited_entity.useResolveEditedEntity)();
  (0, import_use_resolve_edited_entity.useSyncDeprecatedEntityIntoState)(entity);
  const { postType, postId, context } = entity;
  const { isBlockBasedTheme, hasSiteIcon } = (0, import_data.useSelect)((select) => {
    const { getCurrentTheme, getEntityRecord } = select(import_core_data.store);
    const siteData = getEntityRecord("root", "__unstableBase", void 0);
    return {
      isBlockBasedTheme: getCurrentTheme()?.is_block_theme,
      hasSiteIcon: !!siteData?.site_icon_url
    };
  }, []);
  const postWithTemplate = !!context?.postId;
  (0, import_use_editor_title.default)(
    postWithTemplate ? context.postType : postType,
    postWithTemplate ? context.postId : postId
  );
  const _isPreviewingTheme = (0, import_is_previewing_theme.isPreviewingTheme)();
  const iframeProps = (0, import_use_editor_iframe_props.default)();
  const isEditMode = canvas === "edit";
  const loadingProgressId = (0, import_compose.useInstanceId)(
    import_canvas_loader.default,
    "edit-site-editor__loading-progress"
  );
  const editorSettings = (0, import_use_site_editor_settings.useSpecificEditorSettings)();
  const { resetZoomLevel } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_block_editor.store));
  const { setCurrentRevisionId } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_editor.store));
  const { createSuccessNotice } = (0, import_data.useDispatch)(import_notices.store);
  const onActionPerformed = (0, import_element.useCallback)(
    (actionId, items) => {
      switch (actionId) {
        case "move-to-trash":
        case "delete-post":
          {
            history.navigate(
              getListPathForPostType(
                postWithTemplate ? context.postType : postType
              )
            );
          }
          break;
        case "duplicate-post":
          {
            const newItem = items[0];
            const _title = typeof newItem.title === "string" ? newItem.title : newItem.title?.rendered;
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
    [
      postType,
      context?.postType,
      postWithTemplate,
      history,
      createSuccessNotice
    ]
  );
  const isReady = !isLoading;
  const transition = {
    duration: disableMotion ? 0 : 0.2
  };
  return !isBlockBasedTheme && isHomeRoute ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_site_preview.default, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.EditorKeyboardShortcutsRegister, {}),
    isEditMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockKeyboardShortcuts, {}),
    !isReady ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_canvas_loader.default, { id: loadingProgressId }) : null,
    isEditMode && isReady && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_welcome_guide.default,
      {
        postType: postWithTemplate ? context.postType : postType
      }
    ),
    isReady && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      Editor,
      {
        postType: postWithTemplate ? context.postType : postType,
        postId: postWithTemplate ? context.postId : postId,
        templateId: postWithTemplate ? postId : void 0,
        settings: editorSettings,
        className: "edit-site-editor__editor-interface",
        customSaveButton: _isPreviewingTheme && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_save_button.default, { size: "compact" }),
        customSavePanel: _isPreviewingTheme && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_save_panel.default, {}),
        iframeProps,
        onActionPerformed,
        extraSidebarPanels: !postWithTemplate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_plugin_template_setting_panel.default.Slot, {}),
        children: [
          isEditMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_use_viewport_sync.ViewportSync, {}),
          isEditMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackButton, { children: ({ length }) => length <= 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            import_components.__unstableMotion.div,
            {
              className: "edit-site-editor__view-mode-toggle",
              transition,
              animate: "edit",
              initial: "edit",
              whileHover: "hover",
              whileTap: "tap",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_components.Button,
                  {
                    __next40pxDefaultSize: true,
                    label: (0, import_i18n.__)("Open Navigation"),
                    showTooltip: true,
                    tooltipPosition: "middle right",
                    onClick: () => {
                      resetZoomLevel();
                      setCurrentRevisionId(null);
                      history.navigate(
                        getNavigationPath(
                          location,
                          postWithTemplate ? context.postType : postType
                        ),
                        {
                          transition: "canvas-mode-view-transition"
                        }
                      );
                    },
                    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_components.__unstableMotion.div,
                      {
                        variants: siteIconVariants,
                        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_site_icon.default, { className: "edit-site-editor__view-mode-toggle-icon" })
                      }
                    )
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_components.__unstableMotion.div,
                  {
                    className: (0, import_clsx.default)(
                      "edit-site-editor__back-icon",
                      {
                        "has-site-icon": hasSiteIcon
                      }
                    ),
                    variants: toggleHomeIconVariants,
                    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icons.Icon, { icon: import_icons.arrowUpLeft })
                  }
                )
              ]
            }
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_more_menu.default, {})
        ]
      }
    )
  ] });
}
//# sourceMappingURL=index.cjs.map
