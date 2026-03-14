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

// packages/editor/src/components/post-template/classic-theme.js
var classic_theme_exports = {};
__export(classic_theme_exports, {
  default: () => classic_theme_default
});
module.exports = __toCommonJS(classic_theme_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_block_editor = require("@wordpress/block-editor");
var import_element = require("@wordpress/element");
var import_icons = require("@wordpress/icons");
var import_notices = require("@wordpress/notices");
var import_store = require("../../store/index.cjs");
var import_create_new_template_modal = __toESM(require("./create-new-template-modal.cjs"));
var import_hooks = require("./hooks.cjs");
var import_post_panel_row = __toESM(require("../post-panel-row/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function PostTemplateToggle({ isOpen, onClick }) {
  const templateTitle = (0, import_data.useSelect)((select) => {
    const templateSlug = select(import_store.store).getEditedPostAttribute("template");
    const { supportsTemplateMode, availableTemplates } = select(import_store.store).getEditorSettings();
    if (!supportsTemplateMode && availableTemplates[templateSlug]) {
      return availableTemplates[templateSlug];
    }
    const template = select(import_core_data.store).canUser("create", {
      kind: "postType",
      name: "wp_template"
    }) && select(import_store.store).getCurrentTemplateId();
    return template?.title || template?.slug || availableTemplates?.[templateSlug];
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Button,
    {
      __next40pxDefaultSize: true,
      variant: "tertiary",
      "aria-expanded": isOpen,
      "aria-label": (0, import_i18n.__)("Template options"),
      onClick,
      children: templateTitle ?? (0, import_i18n.__)("Default template")
    }
  );
}
function PostTemplateDropdownContent({ onClose }) {
  const allowSwitchingTemplate = (0, import_hooks.useAllowSwitchingTemplates)();
  const {
    availableTemplates,
    fetchedTemplates,
    selectedTemplateSlug,
    canCreate,
    canEdit,
    currentTemplateId,
    onNavigateToEntityRecord,
    getEditorSettings
  } = (0, import_data.useSelect)(
    (select) => {
      const { canUser, getEntityRecords } = select(import_core_data.store);
      const editorSettings = select(import_store.store).getEditorSettings();
      const canCreateTemplates = canUser("create", {
        kind: "postType",
        name: "wp_template"
      });
      const _currentTemplateId = select(import_store.store).getCurrentTemplateId();
      return {
        availableTemplates: editorSettings.availableTemplates,
        fetchedTemplates: canCreateTemplates ? getEntityRecords("postType", "wp_template", {
          post_type: select(import_store.store).getCurrentPostType(),
          per_page: -1
        }) : void 0,
        selectedTemplateSlug: select(import_store.store).getEditedPostAttribute("template"),
        canCreate: allowSwitchingTemplate && canCreateTemplates && editorSettings.supportsTemplateMode,
        canEdit: allowSwitchingTemplate && canCreateTemplates && editorSettings.supportsTemplateMode && !!_currentTemplateId,
        currentTemplateId: _currentTemplateId,
        onNavigateToEntityRecord: editorSettings.onNavigateToEntityRecord,
        getEditorSettings: select(import_store.store).getEditorSettings
      };
    },
    [allowSwitchingTemplate]
  );
  const options = (0, import_element.useMemo)(
    () => Object.entries({
      ...availableTemplates,
      ...Object.fromEntries(
        (fetchedTemplates ?? []).map(({ slug, title }) => [
          slug,
          title.rendered
        ])
      )
    }).map(([slug, title]) => ({ value: slug, label: title })),
    [availableTemplates, fetchedTemplates]
  );
  const selectedOption = options.find((option) => option.value === selectedTemplateSlug) ?? options.find((option) => !option.value);
  const { editPost } = (0, import_data.useDispatch)(import_store.store);
  const { createSuccessNotice } = (0, import_data.useDispatch)(import_notices.store);
  const [isCreateModalOpen, setIsCreateModalOpen] = (0, import_element.useState)(false);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "editor-post-template__classic-theme-dropdown", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_editor.__experimentalInspectorPopoverHeader,
      {
        title: (0, import_i18n.__)("Template"),
        help: (0, import_i18n.__)(
          "Templates define the way content is displayed when viewing your site."
        ),
        actions: canCreate ? [
          {
            icon: import_icons.addTemplate,
            label: (0, import_i18n.__)("Add template"),
            onClick: () => setIsCreateModalOpen(true)
          }
        ] : [],
        onClose
      }
    ),
    !allowSwitchingTemplate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Notice, { status: "warning", isDismissible: false, children: (0, import_i18n.__)("The posts page template cannot be changed.") }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.SelectControl,
      {
        __next40pxDefaultSize: true,
        hideLabelFromVision: true,
        label: (0, import_i18n.__)("Template"),
        value: selectedOption?.value ?? "",
        options,
        onChange: (slug) => editPost({ template: slug || "" })
      }
    ),
    canEdit && onNavigateToEntityRecord && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Button,
      {
        __next40pxDefaultSize: true,
        variant: "link",
        onClick: () => {
          onNavigateToEntityRecord({
            postId: currentTemplateId,
            postType: "wp_template"
          });
          onClose();
          createSuccessNotice(
            (0, import_i18n.__)(
              "Editing template. Changes made here affect all posts and pages that use the template."
            ),
            {
              type: "snackbar",
              actions: [
                {
                  label: (0, import_i18n.__)("Go back"),
                  onClick: () => getEditorSettings().onNavigateToPreviousEntityRecord()
                }
              ]
            }
          );
        },
        children: (0, import_i18n.__)("Edit template")
      }
    ) }),
    isCreateModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_create_new_template_modal.default,
      {
        onClose: () => setIsCreateModalOpen(false)
      }
    )
  ] });
}
function ClassicThemeControl() {
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_panel_row.default, { label: (0, import_i18n.__)("Template"), ref: setPopoverAnchor, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Dropdown,
    {
      popoverProps,
      focusOnMount: true,
      renderToggle: ({ isOpen, onToggle }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        PostTemplateToggle,
        {
          isOpen,
          onClick: onToggle
        }
      ),
      renderContent: ({ onClose }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostTemplateDropdownContent, { onClose })
    }
  ) });
}
var classic_theme_default = ClassicThemeControl;
//# sourceMappingURL=classic-theme.cjs.map
