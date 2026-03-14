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

// packages/edit-widgets/src/components/more-menu/index.js
var more_menu_exports = {};
__export(more_menu_exports, {
  default: () => MoreMenu
});
module.exports = __toCommonJS(more_menu_exports);
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_preferences = require("@wordpress/preferences");
var import_keycodes = require("@wordpress/keycodes");
var import_keyboard_shortcuts = require("@wordpress/keyboard-shortcuts");
var import_compose = require("@wordpress/compose");
var import_keyboard_shortcut_help_modal = __toESM(require("../keyboard-shortcut-help-modal/index.cjs"));
var import_tools_more_menu_group = __toESM(require("./tools-more-menu-group.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function MoreMenu() {
  const [
    isKeyboardShortcutsModalActive,
    setIsKeyboardShortcutsModalVisible
  ] = (0, import_element.useState)(false);
  const toggleKeyboardShortcutsModal = () => setIsKeyboardShortcutsModalVisible(!isKeyboardShortcutsModalActive);
  (0, import_keyboard_shortcuts.useShortcut)(
    "core/edit-widgets/keyboard-shortcuts",
    toggleKeyboardShortcutsModal
  );
  const isLargeViewport = (0, import_compose.useViewportMatch)("medium");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.DropdownMenu,
      {
        icon: import_icons.moreVertical,
        label: (0, import_i18n.__)("Options"),
        popoverProps: {
          placement: "bottom-end",
          className: "more-menu-dropdown__content"
        },
        toggleProps: {
          tooltipPosition: "bottom",
          size: "compact"
        },
        children: (onClose) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          isLargeViewport && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.MenuGroup, { label: (0, import_i18n._x)("View", "noun"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_preferences.PreferenceToggleMenuItem,
            {
              scope: "core/edit-widgets",
              name: "fixedToolbar",
              label: (0, import_i18n.__)("Top toolbar"),
              info: (0, import_i18n.__)(
                "Access all block and document tools in a single place"
              ),
              messageActivated: (0, import_i18n.__)(
                "Top toolbar activated"
              ),
              messageDeactivated: (0, import_i18n.__)(
                "Top toolbar deactivated"
              )
            }
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.MenuGroup, { label: (0, import_i18n.__)("Tools"), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.MenuItem,
              {
                onClick: () => {
                  setIsKeyboardShortcutsModalVisible(true);
                },
                shortcut: import_keycodes.displayShortcut.access("h"),
                children: (0, import_i18n.__)("Keyboard shortcuts")
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_preferences.PreferenceToggleMenuItem,
              {
                scope: "core/edit-widgets",
                name: "welcomeGuide",
                label: (0, import_i18n.__)("Welcome Guide")
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              import_components.MenuItem,
              {
                role: "menuitem",
                icon: import_icons.external,
                href: (0, import_i18n.__)(
                  "https://wordpress.org/documentation/article/block-based-widgets-editor/"
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
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.MenuGroup, { label: (0, import_i18n.__)("Preferences"), children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_preferences.PreferenceToggleMenuItem,
              {
                scope: "core/edit-widgets",
                name: "keepCaretInsideBlock",
                label: (0, import_i18n.__)(
                  "Contain text cursor inside block"
                ),
                info: (0, import_i18n.__)(
                  "Aids screen readers by stopping text caret from leaving blocks."
                ),
                messageActivated: (0, import_i18n.__)(
                  "Contain text cursor inside block activated"
                ),
                messageDeactivated: (0, import_i18n.__)(
                  "Contain text cursor inside block deactivated"
                )
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_preferences.PreferenceToggleMenuItem,
              {
                scope: "core/edit-widgets",
                name: "themeStyles",
                info: (0, import_i18n.__)(
                  "Make the editor look like your theme."
                ),
                label: (0, import_i18n.__)("Use theme styles")
              }
            ),
            isLargeViewport && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_preferences.PreferenceToggleMenuItem,
              {
                scope: "core/edit-widgets",
                name: "showBlockBreadcrumbs",
                label: (0, import_i18n.__)("Display block breadcrumbs"),
                info: (0, import_i18n.__)(
                  "Shows block breadcrumbs at the bottom of the editor."
                ),
                messageActivated: (0, import_i18n.__)(
                  "Display block breadcrumbs activated"
                ),
                messageDeactivated: (0, import_i18n.__)(
                  "Display block breadcrumbs deactivated"
                )
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_keyboard_shortcut_help_modal.default,
      {
        isModalActive: isKeyboardShortcutsModalActive,
        toggleModal: toggleKeyboardShortcutsModal
      }
    )
  ] });
}
//# sourceMappingURL=index.cjs.map
