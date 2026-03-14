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

// packages/editor/src/components/preview-dropdown/index.js
var preview_dropdown_exports = {};
__export(preview_dropdown_exports, {
  default: () => PreviewDropdown
});
module.exports = __toCommonJS(preview_dropdown_exports);
var import_clsx = __toESM(require("clsx"));
var import_compose = require("@wordpress/compose");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_preferences = require("@wordpress/preferences");
var import_interface = require("@wordpress/interface");
var import_block_editor = require("@wordpress/block-editor");
var import_store = require("../../store/index.cjs");
var import_post_preview_button = __toESM(require("../post-preview-button/index.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function PreviewDropdown({ forceIsAutosaveable, disabled }) {
  const {
    deviceType,
    homeUrl,
    isTemplate,
    isViewable,
    showIconLabels,
    isTemplateHidden,
    templateId
  } = (0, import_data.useSelect)((select) => {
    const {
      getDeviceType,
      getCurrentPostType,
      getCurrentTemplateId,
      getRenderingMode
    } = select(import_store.store);
    const { getEntityRecord, getPostType } = select(import_core_data.store);
    const { get } = select(import_preferences.store);
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
  const { setDeviceType, setRenderingMode, setDefaultRenderingMode } = (0, import_lock_unlock.unlock)(
    (0, import_data.useDispatch)(import_store.store)
  );
  const { resetZoomLevel } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_block_editor.store));
  const handleDevicePreviewChange = (newDeviceType) => {
    setDeviceType(newDeviceType);
    resetZoomLevel();
  };
  const isMobile = (0, import_compose.useViewportMatch)("medium", "<");
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
    "aria-label": (0, import_i18n.__)("View options")
  };
  const deviceIcons = {
    desktop: import_icons.desktop,
    mobile: import_icons.mobile,
    tablet: import_icons.tablet
  };
  const choices = [
    {
      value: "Desktop",
      label: (0, import_i18n.__)("Desktop"),
      icon: import_icons.desktop
    },
    {
      value: "Tablet",
      label: (0, import_i18n.__)("Tablet"),
      icon: import_icons.tablet
    },
    {
      value: "Mobile",
      label: (0, import_i18n.__)("Mobile"),
      icon: import_icons.mobile
    }
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.DropdownMenu,
    {
      className: (0, import_clsx.default)(
        "editor-preview-dropdown",
        `editor-preview-dropdown--${deviceType.toLowerCase()}`
      ),
      popoverProps,
      toggleProps,
      menuProps,
      icon: deviceIcons[deviceType.toLowerCase()],
      label: (0, import_i18n.__)("View"),
      disableOpenOnArrowDown: disabled,
      children: ({ onClose }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.MenuGroup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.MenuItemsChoice,
          {
            choices,
            value: deviceType,
            onSelect: handleDevicePreviewChange
          }
        ) }),
        isTemplate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.MenuGroup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          import_components.MenuItem,
          {
            href: homeUrl,
            target: "_blank",
            icon: import_icons.external,
            onClick: onClose,
            children: [
              (0, import_i18n.__)("View site"),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.VisuallyHidden, {
                as: "span",
                /* translators: accessibility text */
                children: (0, import_i18n.__)("(opens in a new tab)")
              })
            ]
          }
        ) }),
        !isTemplate && !!templateId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.MenuGroup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.MenuItem,
          {
            icon: !isTemplateHidden ? import_icons.check : void 0,
            isSelected: !isTemplateHidden,
            role: "menuitemcheckbox",
            onClick: () => {
              const newRenderingMode = isTemplateHidden ? "template-locked" : "post-only";
              setRenderingMode(newRenderingMode);
              setDefaultRenderingMode(newRenderingMode);
              resetZoomLevel();
            },
            children: (0, import_i18n.__)("Show template")
          }
        ) }),
        isViewable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.MenuGroup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_post_preview_button.default,
          {
            className: "editor-preview-dropdown__button-external",
            role: "menuitem",
            forceIsAutosaveable,
            "aria-label": (0, import_i18n.__)("Preview in new tab"),
            textContent: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
              (0, import_i18n.__)("Preview in new tab"),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Icon, { icon: import_icons.external })
            ] }),
            onPreview: onClose
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_interface.ActionItem.Slot,
          {
            name: "core/plugin-preview-menu",
            fillProps: { onClick: onClose }
          }
        )
      ] })
    }
  );
}
//# sourceMappingURL=index.cjs.map
