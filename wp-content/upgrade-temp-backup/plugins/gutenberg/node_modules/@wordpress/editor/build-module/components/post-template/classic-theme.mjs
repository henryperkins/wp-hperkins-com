// packages/editor/src/components/post-template/classic-theme.js
import { __ } from "@wordpress/i18n";
import { SelectControl, Dropdown, Button, Notice } from "@wordpress/components";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from "@wordpress/block-editor";
import { useState, useMemo } from "@wordpress/element";
import { addTemplate } from "@wordpress/icons";
import { store as noticesStore } from "@wordpress/notices";
import { store as editorStore } from "../../store/index.mjs";
import CreateNewTemplateModal from "./create-new-template-modal.mjs";
import { useAllowSwitchingTemplates } from "./hooks.mjs";
import PostPanelRow from "../post-panel-row/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function PostTemplateToggle({ isOpen, onClick }) {
  const templateTitle = useSelect((select) => {
    const templateSlug = select(editorStore).getEditedPostAttribute("template");
    const { supportsTemplateMode, availableTemplates } = select(editorStore).getEditorSettings();
    if (!supportsTemplateMode && availableTemplates[templateSlug]) {
      return availableTemplates[templateSlug];
    }
    const template = select(coreStore).canUser("create", {
      kind: "postType",
      name: "wp_template"
    }) && select(editorStore).getCurrentTemplateId();
    return template?.title || template?.slug || availableTemplates?.[templateSlug];
  }, []);
  return /* @__PURE__ */ jsx(
    Button,
    {
      __next40pxDefaultSize: true,
      variant: "tertiary",
      "aria-expanded": isOpen,
      "aria-label": __("Template options"),
      onClick,
      children: templateTitle ?? __("Default template")
    }
  );
}
function PostTemplateDropdownContent({ onClose }) {
  const allowSwitchingTemplate = useAllowSwitchingTemplates();
  const {
    availableTemplates,
    fetchedTemplates,
    selectedTemplateSlug,
    canCreate,
    canEdit,
    currentTemplateId,
    onNavigateToEntityRecord,
    getEditorSettings
  } = useSelect(
    (select) => {
      const { canUser, getEntityRecords } = select(coreStore);
      const editorSettings = select(editorStore).getEditorSettings();
      const canCreateTemplates = canUser("create", {
        kind: "postType",
        name: "wp_template"
      });
      const _currentTemplateId = select(editorStore).getCurrentTemplateId();
      return {
        availableTemplates: editorSettings.availableTemplates,
        fetchedTemplates: canCreateTemplates ? getEntityRecords("postType", "wp_template", {
          post_type: select(editorStore).getCurrentPostType(),
          per_page: -1
        }) : void 0,
        selectedTemplateSlug: select(editorStore).getEditedPostAttribute("template"),
        canCreate: allowSwitchingTemplate && canCreateTemplates && editorSettings.supportsTemplateMode,
        canEdit: allowSwitchingTemplate && canCreateTemplates && editorSettings.supportsTemplateMode && !!_currentTemplateId,
        currentTemplateId: _currentTemplateId,
        onNavigateToEntityRecord: editorSettings.onNavigateToEntityRecord,
        getEditorSettings: select(editorStore).getEditorSettings
      };
    },
    [allowSwitchingTemplate]
  );
  const options = useMemo(
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
  const { editPost } = useDispatch(editorStore);
  const { createSuccessNotice } = useDispatch(noticesStore);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "editor-post-template__classic-theme-dropdown", children: [
    /* @__PURE__ */ jsx(
      InspectorPopoverHeader,
      {
        title: __("Template"),
        help: __(
          "Templates define the way content is displayed when viewing your site."
        ),
        actions: canCreate ? [
          {
            icon: addTemplate,
            label: __("Add template"),
            onClick: () => setIsCreateModalOpen(true)
          }
        ] : [],
        onClose
      }
    ),
    !allowSwitchingTemplate ? /* @__PURE__ */ jsx(Notice, { status: "warning", isDismissible: false, children: __("The posts page template cannot be changed.") }) : /* @__PURE__ */ jsx(
      SelectControl,
      {
        __next40pxDefaultSize: true,
        hideLabelFromVision: true,
        label: __("Template"),
        value: selectedOption?.value ?? "",
        options,
        onChange: (slug) => editPost({ template: slug || "" })
      }
    ),
    canEdit && onNavigateToEntityRecord && /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(
      Button,
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
            __(
              "Editing template. Changes made here affect all posts and pages that use the template."
            ),
            {
              type: "snackbar",
              actions: [
                {
                  label: __("Go back"),
                  onClick: () => getEditorSettings().onNavigateToPreviousEntityRecord()
                }
              ]
            }
          );
        },
        children: __("Edit template")
      }
    ) }),
    isCreateModalOpen && /* @__PURE__ */ jsx(
      CreateNewTemplateModal,
      {
        onClose: () => setIsCreateModalOpen(false)
      }
    )
  ] });
}
function ClassicThemeControl() {
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const popoverProps = useMemo(
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
  return /* @__PURE__ */ jsx(PostPanelRow, { label: __("Template"), ref: setPopoverAnchor, children: /* @__PURE__ */ jsx(
    Dropdown,
    {
      popoverProps,
      focusOnMount: true,
      renderToggle: ({ isOpen, onToggle }) => /* @__PURE__ */ jsx(
        PostTemplateToggle,
        {
          isOpen,
          onClick: onToggle
        }
      ),
      renderContent: ({ onClose }) => /* @__PURE__ */ jsx(PostTemplateDropdownContent, { onClose })
    }
  ) });
}
var classic_theme_default = ClassicThemeControl;
export {
  classic_theme_default as default
};
//# sourceMappingURL=classic-theme.mjs.map
