// packages/editor/src/components/more-menu/index.js
import { __, _x } from "@wordpress/i18n";
import { useSelect, useDispatch } from "@wordpress/data";
import { displayShortcut } from "@wordpress/keycodes";
import { external, moreVertical } from "@wordpress/icons";
import {
  MenuGroup,
  MenuItem,
  VisuallyHidden,
  DropdownMenu
} from "@wordpress/components";
import {
  PreferenceToggleMenuItem,
  store as preferencesStore
} from "@wordpress/preferences";
import { store as interfaceStore, ActionItem } from "@wordpress/interface";
import CopyContentMenuItem from "./copy-content-menu-item.mjs";
import ModeSwitcher from "../mode-switcher/index.mjs";
import ToolsMoreMenuGroup from "./tools-more-menu-group.mjs";
import ViewMoreMenuGroup from "./view-more-menu-group.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function MoreMenu({ disabled = false }) {
  const { openModal } = useDispatch(interfaceStore);
  const { set: setPreference } = useDispatch(preferencesStore);
  const { toggleDistractionFree } = useDispatch(editorStore);
  const showIconLabels = useSelect(
    (select) => select(preferencesStore).get("core", "showIconLabels"),
    []
  );
  const turnOffDistractionFree = () => {
    setPreference("core", "distractionFree", false);
  };
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
    DropdownMenu,
    {
      icon: moreVertical,
      label: __("Options"),
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
      children: ({ onClose }) => /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs(MenuGroup, { label: _x("View", "noun"), children: [
          /* @__PURE__ */ jsx(
            PreferenceToggleMenuItem,
            {
              scope: "core",
              name: "fixedToolbar",
              onToggle: turnOffDistractionFree,
              label: __("Top toolbar"),
              info: __(
                "Access all block and document tools in a single place"
              ),
              messageActivated: __(
                "Top toolbar activated."
              ),
              messageDeactivated: __(
                "Top toolbar deactivated."
              )
            }
          ),
          /* @__PURE__ */ jsx(
            PreferenceToggleMenuItem,
            {
              scope: "core",
              name: "distractionFree",
              label: __("Distraction free"),
              info: __("Write with calmness"),
              handleToggling: false,
              onToggle: () => toggleDistractionFree({
                createNotice: false
              }),
              messageActivated: __(
                "Distraction free mode activated."
              ),
              messageDeactivated: __(
                "Distraction free mode deactivated."
              ),
              shortcut: displayShortcut.primaryShift(
                "\\"
              )
            }
          ),
          /* @__PURE__ */ jsx(
            PreferenceToggleMenuItem,
            {
              scope: "core",
              name: "focusMode",
              label: __("Spotlight mode"),
              info: __("Focus on one block at a time"),
              messageActivated: __(
                "Spotlight mode activated."
              ),
              messageDeactivated: __(
                "Spotlight mode deactivated."
              )
            }
          ),
          /* @__PURE__ */ jsx(ViewMoreMenuGroup.Slot, { fillProps: { onClose } })
        ] }),
        /* @__PURE__ */ jsx(ModeSwitcher, {}),
        /* @__PURE__ */ jsx(
          ActionItem.Slot,
          {
            name: "core/plugin-more-menu",
            label: __("Panels"),
            fillProps: { onClick: onClose }
          }
        ),
        /* @__PURE__ */ jsxs(MenuGroup, { label: __("Tools"), children: [
          /* @__PURE__ */ jsx(
            MenuItem,
            {
              onClick: () => openModal("editor/keyboard-shortcut-help"),
              shortcut: displayShortcut.access("h"),
              children: __("Keyboard shortcuts")
            }
          ),
          /* @__PURE__ */ jsx(CopyContentMenuItem, {}),
          /* @__PURE__ */ jsxs(
            MenuItem,
            {
              icon: external,
              href: __(
                "https://wordpress.org/documentation/article/wordpress-block-editor/"
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
        /* @__PURE__ */ jsx(MenuGroup, { children: /* @__PURE__ */ jsx(
          MenuItem,
          {
            onClick: () => openModal("editor/preferences"),
            children: __("Preferences")
          }
        ) })
      ] })
    }
  ) });
}
export {
  MoreMenu as default
};
//# sourceMappingURL=index.mjs.map
