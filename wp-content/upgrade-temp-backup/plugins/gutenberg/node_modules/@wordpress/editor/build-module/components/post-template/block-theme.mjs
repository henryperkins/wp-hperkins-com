// packages/editor/src/components/post-template/block-theme.js
import { useSelect, useDispatch } from "@wordpress/data";
import { decodeEntities } from "@wordpress/html-entities";
import { DropdownMenu, MenuGroup, MenuItem } from "@wordpress/components";
import { useState, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { useEntityRecord, store as coreStore } from "@wordpress/core-data";
import { check } from "@wordpress/icons";
import { store as noticesStore } from "@wordpress/notices";
import { store as preferencesStore } from "@wordpress/preferences";
import PostPanelRow from "../post-panel-row/index.mjs";
import { store as editorStore } from "../../store/index.mjs";
import SwapTemplateButton from "./swap-template-button.mjs";
import ResetDefaultTemplate from "./reset-default-template.mjs";
import { unlock } from "../../lock-unlock.mjs";
import CreateNewTemplate from "./create-new-template.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function BlockThemeControl({ id }) {
  const {
    isTemplateHidden,
    onNavigateToEntityRecord,
    getEditorSettings,
    hasGoBack,
    hasSpecificTemplate
  } = useSelect((select) => {
    const {
      getRenderingMode,
      getEditorSettings: _getEditorSettings,
      getCurrentPost
    } = unlock(select(editorStore));
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
  const { get: getPreference } = useSelect(preferencesStore);
  const { editedRecord: template, hasResolved } = useEntityRecord(
    "postType",
    "wp_template",
    id
  );
  const { getEntityRecord } = useSelect(coreStore);
  const { editEntityRecord } = useDispatch(coreStore);
  const { createSuccessNotice } = useDispatch(noticesStore);
  const { setRenderingMode, setDefaultRenderingMode } = unlock(
    useDispatch(editorStore)
  );
  const canCreateTemplate = useSelect(
    (select) => !!select(coreStore).canUser("create", {
      kind: "postType",
      name: "wp_template"
    }),
    []
  );
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
  if (!hasResolved) {
    return null;
  }
  const notificationAction = hasGoBack ? [
    {
      label: __("Go back"),
      onClick: () => getEditorSettings().onNavigateToPreviousEntityRecord()
    }
  ] : void 0;
  const mayShowTemplateEditNotice = () => {
    if (!getPreference("core/edit-site", "welcomeGuideTemplate")) {
      createSuccessNotice(
        __(
          "Editing template. Changes made here affect all posts and pages that use the template."
        ),
        { type: "snackbar", actions: notificationAction }
      );
    }
  };
  return /* @__PURE__ */ jsx(PostPanelRow, { label: __("Template"), ref: setPopoverAnchor, children: /* @__PURE__ */ jsx(
    DropdownMenu,
    {
      popoverProps,
      focusOnMount: true,
      toggleProps: {
        size: "compact",
        variant: "tertiary",
        tooltipPosition: "middle left"
      },
      label: __("Template options"),
      text: decodeEntities(template.title),
      icon: null,
      children: ({ onClose }) => /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs(MenuGroup, { children: [
          canCreateTemplate && /* @__PURE__ */ jsx(
            MenuItem,
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
              children: __("Edit template")
            }
          ),
          /* @__PURE__ */ jsx(SwapTemplateButton, { onClick: onClose }),
          /* @__PURE__ */ jsx(ResetDefaultTemplate, { onClick: onClose }),
          canCreateTemplate && /* @__PURE__ */ jsx(CreateNewTemplate, {})
        ] }),
        /* @__PURE__ */ jsx(MenuGroup, { children: /* @__PURE__ */ jsx(
          MenuItem,
          {
            icon: !isTemplateHidden ? check : void 0,
            isSelected: !isTemplateHidden,
            role: "menuitemcheckbox",
            onClick: () => {
              const newRenderingMode = isTemplateHidden ? "template-locked" : "post-only";
              setRenderingMode(newRenderingMode);
              setDefaultRenderingMode(newRenderingMode);
            },
            children: __("Show template")
          }
        ) })
      ] })
    }
  ) });
}
export {
  BlockThemeControl as default
};
//# sourceMappingURL=block-theme.mjs.map
