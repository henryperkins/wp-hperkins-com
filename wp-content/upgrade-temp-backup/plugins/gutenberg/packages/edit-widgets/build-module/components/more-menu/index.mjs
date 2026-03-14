// packages/edit-widgets/src/components/more-menu/index.js
import {
  MenuGroup,
  MenuItem,
  VisuallyHidden,
  DropdownMenu
} from "@wordpress/components";
import { useState } from "@wordpress/element";
import { __, _x } from "@wordpress/i18n";
import { external, moreVertical } from "@wordpress/icons";
import { PreferenceToggleMenuItem } from "@wordpress/preferences";
import { displayShortcut } from "@wordpress/keycodes";
import { useShortcut } from "@wordpress/keyboard-shortcuts";
import { useViewportMatch } from "@wordpress/compose";
import KeyboardShortcutHelpModal from "../keyboard-shortcut-help-modal/index.mjs";
import ToolsMoreMenuGroup from "./tools-more-menu-group.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function MoreMenu() {
  const [
    isKeyboardShortcutsModalActive,
    setIsKeyboardShortcutsModalVisible
  ] = useState(false);
  const toggleKeyboardShortcutsModal = () => setIsKeyboardShortcutsModalVisible(!isKeyboardShortcutsModalActive);
  useShortcut(
    "core/edit-widgets/keyboard-shortcuts",
    toggleKeyboardShortcutsModal
  );
  const isLargeViewport = useViewportMatch("medium");
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      DropdownMenu,
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
        children: (onClose) => /* @__PURE__ */ jsxs(Fragment, { children: [
          isLargeViewport && /* @__PURE__ */ jsx(MenuGroup, { label: _x("View", "noun"), children: /* @__PURE__ */ jsx(
            PreferenceToggleMenuItem,
            {
              scope: "core/edit-widgets",
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
                scope: "core/edit-widgets",
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
            ),
            /* @__PURE__ */ jsx(
              ToolsMoreMenuGroup.Slot,
              {
                fillProps: { onClose }
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(MenuGroup, { label: __("Preferences"), children: [
            /* @__PURE__ */ jsx(
              PreferenceToggleMenuItem,
              {
                scope: "core/edit-widgets",
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
            ),
            /* @__PURE__ */ jsx(
              PreferenceToggleMenuItem,
              {
                scope: "core/edit-widgets",
                name: "themeStyles",
                info: __(
                  "Make the editor look like your theme."
                ),
                label: __("Use theme styles")
              }
            ),
            isLargeViewport && /* @__PURE__ */ jsx(
              PreferenceToggleMenuItem,
              {
                scope: "core/edit-widgets",
                name: "showBlockBreadcrumbs",
                label: __("Display block breadcrumbs"),
                info: __(
                  "Shows block breadcrumbs at the bottom of the editor."
                ),
                messageActivated: __(
                  "Display block breadcrumbs activated"
                ),
                messageDeactivated: __(
                  "Display block breadcrumbs deactivated"
                )
              }
            )
          ] })
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
