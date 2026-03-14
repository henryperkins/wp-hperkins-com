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

// packages/editor/src/components/more-menu/index.js
var more_menu_exports = {};
__export(more_menu_exports, {
  default: () => MoreMenu
});
module.exports = __toCommonJS(more_menu_exports);
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_keycodes = require("@wordpress/keycodes");
var import_icons = require("@wordpress/icons");
var import_components = require("@wordpress/components");
var import_preferences = require("@wordpress/preferences");
var import_interface = require("@wordpress/interface");
var import_copy_content_menu_item = __toESM(require("./copy-content-menu-item.cjs"));
var import_mode_switcher = __toESM(require("../mode-switcher/index.cjs"));
var import_tools_more_menu_group = __toESM(require("./tools-more-menu-group.cjs"));
var import_view_more_menu_group = __toESM(require("./view-more-menu-group.cjs"));
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function MoreMenu({ disabled = false }) {
  const { openModal } = (0, import_data.useDispatch)(import_interface.store);
  const { set: setPreference } = (0, import_data.useDispatch)(import_preferences.store);
  const { toggleDistractionFree } = (0, import_data.useDispatch)(import_store.store);
  const showIconLabels = (0, import_data.useSelect)(
    (select) => select(import_preferences.store).get("core", "showIconLabels"),
    []
  );
  const turnOffDistractionFree = () => {
    setPreference("core", "distractionFree", false);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.DropdownMenu,
    {
      icon: import_icons.moreVertical,
      label: (0, import_i18n.__)("Options"),
      popoverProps: {
        placement: "bottom-end",
        className: "more-menu-dropdown__content"
      },
      toggleProps: {
        showTooltip: !showIconLabels,
        ...showIconLabels && { variant: "tertiary" },
        tooltipPosition: "bottom",
        size: "compact",
        disabled
      },
      children: ({ onClose }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.MenuGroup, { label: (0, import_i18n._x)("View", "noun"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_preferences.PreferenceToggleMenuItem,
            {
              scope: "core",
              name: "fixedToolbar",
              onToggle: turnOffDistractionFree,
              label: (0, import_i18n.__)("Top toolbar"),
              info: (0, import_i18n.__)(
                "Access all block and document tools in a single place"
              ),
              messageActivated: (0, import_i18n.__)(
                "Top toolbar activated."
              ),
              messageDeactivated: (0, import_i18n.__)(
                "Top toolbar deactivated."
              )
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_preferences.PreferenceToggleMenuItem,
            {
              scope: "core",
              name: "distractionFree",
              label: (0, import_i18n.__)("Distraction free"),
              info: (0, import_i18n.__)("Write with calmness"),
              handleToggling: false,
              onToggle: () => toggleDistractionFree({
                createNotice: false
              }),
              messageActivated: (0, import_i18n.__)(
                "Distraction free mode activated."
              ),
              messageDeactivated: (0, import_i18n.__)(
                "Distraction free mode deactivated."
              ),
              shortcut: import_keycodes.displayShortcut.primaryShift(
                "\\"
              )
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_preferences.PreferenceToggleMenuItem,
            {
              scope: "core",
              name: "focusMode",
              label: (0, import_i18n.__)("Spotlight mode"),
              info: (0, import_i18n.__)("Focus on one block at a time"),
              messageActivated: (0, import_i18n.__)(
                "Spotlight mode activated."
              ),
              messageDeactivated: (0, import_i18n.__)(
                "Spotlight mode deactivated."
              )
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_view_more_menu_group.default.Slot, { fillProps: { onClose } })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_mode_switcher.default, {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_interface.ActionItem.Slot,
          {
            name: "core/plugin-more-menu",
            label: (0, import_i18n.__)("Panels"),
            fillProps: { onClick: onClose }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.MenuGroup, { label: (0, import_i18n.__)("Tools"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.MenuItem,
            {
              onClick: () => openModal("editor/keyboard-shortcut-help"),
              shortcut: import_keycodes.displayShortcut.access("h"),
              children: (0, import_i18n.__)("Keyboard shortcuts")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_copy_content_menu_item.default, {}),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            import_components.MenuItem,
            {
              icon: import_icons.external,
              href: (0, import_i18n.__)(
                "https://wordpress.org/documentation/article/wordpress-block-editor/"
              ),
              target: "_blank",
              rel: "noopener noreferrer",
              children: [
                (0, import_i18n.__)("Help"),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.VisuallyHidden, {
                  as: "span",
                  /* translators: accessibility text */
                  children: (0, import_i18n.__)("(opens in a new tab)")
                })
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_tools_more_menu_group.default.Slot,
            {
              fillProps: { onClose }
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.MenuGroup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.MenuItem,
          {
            onClick: () => openModal("editor/preferences"),
            children: (0, import_i18n.__)("Preferences")
          }
        ) })
      ] })
    }
  ) });
}
//# sourceMappingURL=index.cjs.map
