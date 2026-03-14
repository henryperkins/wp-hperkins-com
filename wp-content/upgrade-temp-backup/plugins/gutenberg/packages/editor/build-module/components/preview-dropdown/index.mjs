// packages/editor/src/components/preview-dropdown/index.js
import clsx from "clsx";
import { useViewportMatch } from "@wordpress/compose";
import {
  DropdownMenu,
  MenuGroup,
  MenuItem,
  MenuItemsChoice,
  VisuallyHidden,
  Icon
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { desktop, mobile, tablet, external, check } from "@wordpress/icons";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { store as preferencesStore } from "@wordpress/preferences";
import { ActionItem } from "@wordpress/interface";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { store as editorStore } from "../../store/index.mjs";
import PostPreviewButton from "../post-preview-button/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function PreviewDropdown({ forceIsAutosaveable, disabled }) {
  const {
    deviceType,
    homeUrl,
    isTemplate,
    isViewable,
    showIconLabels,
    isTemplateHidden,
    templateId
  } = useSelect((select) => {
    const {
      getDeviceType,
      getCurrentPostType,
      getCurrentTemplateId,
      getRenderingMode
    } = select(editorStore);
    const { getEntityRecord, getPostType } = select(coreStore);
    const { get } = select(preferencesStore);
    const _currentPostType = getCurrentPostType();
    return {
      deviceType: getDeviceType(),
      homeUrl: getEntityRecord("root", "__unstableBase")?.home,
      isTemplate: _currentPostType === "wp_template",
      isViewable: getPostType(_currentPostType)?.viewable ?? false,
      showIconLabels: get("core", "showIconLabels"),
      isTemplateHidden: getRenderingMode() === "post-only",
      templateId: getCurrentTemplateId()
    };
  }, []);
  const { setDeviceType, setRenderingMode, setDefaultRenderingMode } = unlock(
    useDispatch(editorStore)
  );
  const { resetZoomLevel } = unlock(useDispatch(blockEditorStore));
  const handleDevicePreviewChange = (newDeviceType) => {
    setDeviceType(newDeviceType);
    resetZoomLevel();
  };
  const isMobile = useViewportMatch("medium", "<");
  if (isMobile) {
    return null;
  }
  const popoverProps = {
    placement: "bottom-end"
  };
  const toggleProps = {
    className: "editor-preview-dropdown__toggle",
    iconPosition: "right",
    size: "compact",
    showTooltip: !showIconLabels,
    disabled,
    accessibleWhenDisabled: disabled
  };
  const menuProps = {
    "aria-label": __("View options")
  };
  const deviceIcons = {
    desktop,
    mobile,
    tablet
  };
  const choices = [
    {
      value: "Desktop",
      label: __("Desktop"),
      icon: desktop
    },
    {
      value: "Tablet",
      label: __("Tablet"),
      icon: tablet
    },
    {
      value: "Mobile",
      label: __("Mobile"),
      icon: mobile
    }
  ];
  return /* @__PURE__ */ jsx(
    DropdownMenu,
    {
      className: clsx(
        "editor-preview-dropdown",
        `editor-preview-dropdown--${deviceType.toLowerCase()}`
      ),
      popoverProps,
      toggleProps,
      menuProps,
      icon: deviceIcons[deviceType.toLowerCase()],
      label: __("View"),
      disableOpenOnArrowDown: disabled,
      children: ({ onClose }) => /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(MenuGroup, { children: /* @__PURE__ */ jsx(
          MenuItemsChoice,
          {
            choices,
            value: deviceType,
            onSelect: handleDevicePreviewChange
          }
        ) }),
        isTemplate && /* @__PURE__ */ jsx(MenuGroup, { children: /* @__PURE__ */ jsxs(
          MenuItem,
          {
            href: homeUrl,
            target: "_blank",
            icon: external,
            onClick: onClose,
            children: [
              __("View site"),
              /* @__PURE__ */ jsx(VisuallyHidden, {
                as: "span",
                /* translators: accessibility text */
                children: __("(opens in a new tab)")
              })
            ]
          }
        ) }),
        !isTemplate && !!templateId && /* @__PURE__ */ jsx(MenuGroup, { children: /* @__PURE__ */ jsx(
          MenuItem,
          {
            icon: !isTemplateHidden ? check : void 0,
            isSelected: !isTemplateHidden,
            role: "menuitemcheckbox",
            onClick: () => {
              const newRenderingMode = isTemplateHidden ? "template-locked" : "post-only";
              setRenderingMode(newRenderingMode);
              setDefaultRenderingMode(newRenderingMode);
              resetZoomLevel();
            },
            children: __("Show template")
          }
        ) }),
        isViewable && /* @__PURE__ */ jsx(MenuGroup, { children: /* @__PURE__ */ jsx(
          PostPreviewButton,
          {
            className: "editor-preview-dropdown__button-external",
            role: "menuitem",
            forceIsAutosaveable,
            "aria-label": __("Preview in new tab"),
            textContent: /* @__PURE__ */ jsxs(Fragment, { children: [
              __("Preview in new tab"),
              /* @__PURE__ */ jsx(Icon, { icon: external })
            ] }),
            onPreview: onClose
          }
        ) }),
        /* @__PURE__ */ jsx(
          ActionItem.Slot,
          {
            name: "core/plugin-preview-menu",
            fillProps: { onClick: onClose }
          }
        )
      ] })
    }
  );
}
export {
  PreviewDropdown as default
};
//# sourceMappingURL=index.mjs.map
