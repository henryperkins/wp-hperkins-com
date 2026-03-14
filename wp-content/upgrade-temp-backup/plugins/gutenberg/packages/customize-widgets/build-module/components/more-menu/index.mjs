// packages/customize-widgets/src/components/more-menu/index.js
import {
  MenuGroup,
  MenuItem,
  ToolbarDropdownMenu,
  VisuallyHidden
} from "@wordpress/components";
import { useState } from "@wordpress/element";
import { __, _x } from "@wordpress/i18n";
import { external, moreVertical } from "@wordpress/icons";
import { displayShortcut } from "@wordpress/keycodes";
import { useShortcut } from "@wordpress/keyboard-shortcuts";
import { PreferenceToggleMenuItem } from "@wordpress/preferences";
import KeyboardShortcutHelpModal from "../keyboard-shortcut-help-modal/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function MoreMenu() {
  const [
    isKeyboardShortcutsModalActive,
    setIsKeyboardShortcutsModalVisible
  ] = useState(false);
  const toggleKeyboardShortcutsModal = () => setIsKeyboardShortcutsModalVisible(!isKeyboardShortcutsModalActive);
  useShortcut(
    "core/customize-widgets/keyboard-shortcuts",
    toggleKeyboardShortcutsModal
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      ToolbarDropdownMenu,
      {
        icon: moreVertical,
        label: __("Options"),
        popoverProps: {
          placement: "bottom-end",
          className: "more-menu-dropdown__content"
        },
        toggleProps: {
          tooltipPosition: "bottom",
          size: "compact"
        },
        children: () => /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(MenuGroup, { label: _x("View", "noun"), children: /* @__PURE__ */ jsx(
            PreferenceToggleMenuItem,
            {
              scope: "core/customize-widgets",
              name: "fixedToolbar",
              label: __("Top toolbar"),
              info: __(
                "Access all block and document tools in a single place"
              ),
              messageActivated: __(
                "Top toolbar activated"
              ),
              messageDeactivated: __(
                "Top toolbar deactivated"
              )
            }
          ) }),
          /* @__PURE__ */ jsxs(MenuGroup, { label: __("Tools"), children: [
            /* @__PURE__ */ jsx(
              MenuItem,
              {
                onClick: () => {
                  setIsKeyboardShortcutsModalVisible(true);
                },
                shortcut: displayShortcut.access("h"),
                children: __("Keyboard shortcuts")
              }
            ),
            /* @__PURE__ */ jsx(
              PreferenceToggleMenuItem,
              {
                scope: "core/customize-widgets",
                name: "welcomeGuide",
                label: __("Welcome Guide")
              }
            ),
            /* @__PURE__ */ jsxs(
              MenuItem,
              {
                role: "menuitem",
                icon: external,
                href: __(
                  "https://wordpress.org/documentation/article/block-based-widgets-editor/"
                ),
                target: "_blank",
                rel: "noopener noreferrer",
                children: [
                  __("Help"),
                  /* @__PURE__ */ jsx(VisuallyHidden, {
                    as: "span",
                    /* translators: accessibility text */
                    children: __("(opens in a new tab)")
                  })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx(MenuGroup, { label: __("Preferences"), children: /* @__PURE__ */ jsx(
            PreferenceToggleMenuItem,
            {
              scope: "core/customize-widgets",
              name: "keepCaretInsideBlock",
              label: __(
                "Contain text cursor inside block"
              ),
              info: __(
                "Aids screen readers by stopping text caret from leaving blocks."
              ),
              messageActivated: __(
                "Contain text cursor inside block activated"
              ),
              messageDeactivated: __(
                "Contain text cursor inside block deactivated"
              )
            }
          ) })
        ] })
      }
    ),
    /* @__PURE__ */ jsx(
      KeyboardShortcutHelpModal,
      {
        isModalActive: isKeyboardShortcutsModalActive,
        toggleModal: toggleKeyboardShortcutsModal
      }
    )
  ] });
}
export {
  MoreMenu as default
};
//# sourceMappingURL=index.mjs.map
