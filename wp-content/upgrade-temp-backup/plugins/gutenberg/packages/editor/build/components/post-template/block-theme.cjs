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

// packages/editor/src/components/post-template/block-theme.js
var block_theme_exports = {};
__export(block_theme_exports, {
  default: () => BlockThemeControl
});
module.exports = __toCommonJS(block_theme_exports);
var import_data = require("@wordpress/data");
var import_html_entities = require("@wordpress/html-entities");
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_core_data = require("@wordpress/core-data");
var import_icons = require("@wordpress/icons");
var import_notices = require("@wordpress/notices");
var import_preferences = require("@wordpress/preferences");
var import_post_panel_row = __toESM(require("../post-panel-row/index.cjs"));
var import_store = require("../../store/index.cjs");
var import_swap_template_button = __toESM(require("./swap-template-button.cjs"));
var import_reset_default_template = __toESM(require("./reset-default-template.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_create_new_template = __toESM(require("./create-new-template.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function BlockThemeControl({ id }) {
  const {
    isTemplateHidden,
    onNavigateToEntityRecord,
    getEditorSettings,
    hasGoBack,
    hasSpecificTemplate
  } = (0, import_data.useSelect)((select) => {
    const {
      getRenderingMode,
      getEditorSettings: _getEditorSettings,
      getCurrentPost
    } = (0, import_lock_unlock.unlock)(select(import_store.store));
    const editorSettings = _getEditorSettings();
    const currentPost = getCurrentPost();
    return {
      isTemplateHidden: getRenderingMode() === "post-only",
      onNavigateToEntityRecord: editorSettings.onNavigateToEntityRecord,
      getEditorSettings: _getEditorSettings,
      hasGoBack: editorSettings.hasOwnProperty(
        "onNavigateToPreviousEntityRecord"
      ),
      hasSpecificTemplate: !!currentPost.template
    };
  }, []);
  const { get: getPreference } = (0, import_data.useSelect)(import_preferences.store);
  const { editedRecord: template, hasResolved } = (0, import_core_data.useEntityRecord)(
    "postType",
    "wp_template",
    id
  );
  const { getEntityRecord } = (0, import_data.useSelect)(import_core_data.store);
  const { editEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
  const { createSuccessNotice } = (0, import_data.useDispatch)(import_notices.store);
  const { setRenderingMode, setDefaultRenderingMode } = (0, import_lock_unlock.unlock)(
    (0, import_data.useDispatch)(import_store.store)
  );
  const canCreateTemplate = (0, import_data.useSelect)(
    (select) => !!select(import_core_data.store).canUser("create", {
      kind: "postType",
      name: "wp_template"
    }),
    []
  );
  const [popoverAnchor, setPopoverAnchor] = (0, import_element.useState)(null);
  const popoverProps = (0, import_element.useMemo)(
    () => ({
      // Anchor the popover to the middle of the entire row so that it doesn't
      // move around when the label changes.
      anchor: popoverAnchor,
      className: "editor-post-template__dropdown",
      placement: "left-start",
      offset: 36,
      shift: true
    }),
    [popoverAnchor]
  );
  if (!hasResolved) {
    return null;
  }
  const notificationAction = hasGoBack ? [
    {
      label: (0, import_i18n.__)("Go back"),
      onClick: () => getEditorSettings().onNavigateToPreviousEntityRecord()
    }
  ] : void 0;
  const mayShowTemplateEditNotice = () => {
    if (!getPreference("core/edit-site", "welcomeGuideTemplate")) {
      createSuccessNotice(
        (0, import_i18n.__)(
          "Editing template. Changes made here affect all posts and pages that use the template."
        ),
        { type: "snackbar", actions: notificationAction }
      );
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_panel_row.default, { label: (0, import_i18n.__)("Template"), ref: setPopoverAnchor, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.DropdownMenu,
    {
      popoverProps,
      focusOnMount: true,
      toggleProps: {
        size: "compact",
        variant: "tertiary",
        tooltipPosition: "middle left"
      },
      label: (0, import_i18n.__)("Template options"),
      text: (0, import_html_entities.decodeEntities)(template.title),
      icon: null,
      children: ({ onClose }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.MenuGroup, { children: [
          canCreateTemplate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.MenuItem,
            {
              onClick: async () => {
                onNavigateToEntityRecord({
                  postId: template.id,
                  postType: "wp_template"
                });
                if (!hasSpecificTemplate && window?.__experimentalTemplateActivate) {
                  const activeTemplates = await getEntityRecord(
                    "root",
                    "site"
                  ).active_templates;
                  if (activeTemplates[template.slug] !== template.id) {
                    editEntityRecord(
                      "root",
                      "site",
                      void 0,
                      {
                        active_templates: {
                          ...activeTemplates,
                          [template.slug]: template.id
                        }
                      }
                    );
                  }
                }
                onClose();
                mayShowTemplateEditNotice();
              },
              children: (0, import_i18n.__)("Edit template")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_swap_template_button.default, { onClick: onClose }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_reset_default_template.default, { onClick: onClose }),
          canCreateTemplate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_create_new_template.default, {})
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.MenuGroup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.MenuItem,
          {
            icon: !isTemplateHidden ? import_icons.check : void 0,
            isSelected: !isTemplateHidden,
            role: "menuitemcheckbox",
            onClick: () => {
              const newRenderingMode = isTemplateHidden ? "template-locked" : "post-only";
              setRenderingMode(newRenderingMode);
              setDefaultRenderingMode(newRenderingMode);
            },
            children: (0, import_i18n.__)("Show template")
          }
        ) })
      ] })
    }
  ) });
}
//# sourceMappingURL=block-theme.cjs.map
