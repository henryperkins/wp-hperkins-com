// packages/global-styles-ui/src/shadows-panel.tsx
import {
  __experimentalHStack as HStack,
  __experimentalVStack as VStack,
  __experimentalItemGroup as ItemGroup,
  Button,
  FlexItem,
  privateApis as componentsPrivateApis
} from "@wordpress/components";
import { __, sprintf, isRTL } from "@wordpress/i18n";
import {
  plus,
  Icon,
  chevronLeft,
  chevronRight,
  moreVertical
} from "@wordpress/icons";
import { useState } from "@wordpress/element";
import { Subtitle } from "./subtitle.mjs";
import { NavigationButtonAsItem } from "./navigation-button.mjs";
import { ScreenHeader } from "./screen-header.mjs";
import { ScreenBody } from "./screen-body.mjs";
import { getNewIndexFromPresets } from "./utils.mjs";
import ConfirmResetShadowDialog from "./confirm-reset-shadow-dialog.mjs";
import { useSetting } from "./hooks.mjs";
import { unlock } from "./lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { Menu } = unlock(componentsPrivateApis);
var defaultShadow = "6px 6px 9px rgba(0, 0, 0, 0.2)";
function ShadowsPanel() {
  const [defaultShadows] = useSetting("shadow.presets.default");
  const [defaultShadowsEnabled] = useSetting("shadow.defaultPresets");
  const [themeShadows] = useSetting("shadow.presets.theme");
  const [customShadows, setCustomShadows] = useSetting(
    "shadow.presets.custom"
  );
  const onCreateShadow = (shadow) => {
    setCustomShadows([...customShadows || [], shadow]);
  };
  const handleResetShadows = () => {
    setCustomShadows([]);
  };
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const toggleResetDialog = () => setIsResetDialogOpen(!isResetDialogOpen);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    isResetDialogOpen && /* @__PURE__ */ jsx(
      ConfirmResetShadowDialog,
      {
        text: __(
          "Are you sure you want to remove all custom shadows?"
        ),
        confirmButtonText: __("Remove"),
        isOpen: isResetDialogOpen,
        toggleOpen: toggleResetDialog,
        onConfirm: handleResetShadows
      }
    ),
    /* @__PURE__ */ jsx(
      ScreenHeader,
      {
        title: __("Shadows"),
        description: __(
          "Manage and create shadow styles for use across the site."
        )
      }
    ),
    /* @__PURE__ */ jsx(ScreenBody, { children: /* @__PURE__ */ jsxs(
      VStack,
      {
        className: "global-styles-ui__shadows-panel",
        spacing: 7,
        children: [
          defaultShadowsEnabled && /* @__PURE__ */ jsx(
            ShadowList,
            {
              label: __("Default"),
              shadows: defaultShadows || [],
              category: "default"
            }
          ),
          themeShadows && themeShadows.length > 0 && /* @__PURE__ */ jsx(
            ShadowList,
            {
              label: __("Theme"),
              shadows: themeShadows || [],
              category: "theme"
            }
          ),
          /* @__PURE__ */ jsx(
            ShadowList,
            {
              label: __("Custom"),
              shadows: customShadows || [],
              category: "custom",
              canCreate: true,
              onCreate: onCreateShadow,
              onReset: toggleResetDialog
            }
          )
        ]
      }
    ) })
  ] });
}
function ShadowList({
  label,
  shadows,
  category,
  canCreate,
  onCreate,
  onReset
}) {
  const handleAddShadow = () => {
    const newIndex = getNewIndexFromPresets(shadows, "shadow-");
    onCreate?.({
      name: sprintf(
        /* translators: %d: is an index for a preset */
        __("Shadow %d"),
        newIndex
      ),
      shadow: defaultShadow,
      slug: `shadow-${newIndex}`
    });
  };
  return /* @__PURE__ */ jsxs(VStack, { spacing: 2, children: [
    /* @__PURE__ */ jsxs(HStack, { justify: "space-between", children: [
      /* @__PURE__ */ jsx(Subtitle, { level: 3, children: label }),
      /* @__PURE__ */ jsxs(FlexItem, { className: "global-styles-ui__shadows-panel__options-container", children: [
        canCreate && /* @__PURE__ */ jsx(
          Button,
          {
            size: "small",
            icon: plus,
            label: __("Add shadow"),
            onClick: () => {
              handleAddShadow();
            }
          }
        ),
        !!shadows?.length && category === "custom" && /* @__PURE__ */ jsxs(Menu, { children: [
          /* @__PURE__ */ jsx(
            Menu.TriggerButton,
            {
              render: /* @__PURE__ */ jsx(
                Button,
                {
                  size: "small",
                  icon: moreVertical,
                  label: __("Shadow options")
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(Menu.Popover, { children: /* @__PURE__ */ jsx(Menu.Item, { onClick: onReset, children: /* @__PURE__ */ jsx(Menu.ItemLabel, { children: __("Remove all custom shadows") }) }) })
        ] })
      ] })
    ] }),
    shadows.length > 0 && /* @__PURE__ */ jsx(ItemGroup, { isBordered: true, isSeparated: true, children: shadows.map((shadow) => /* @__PURE__ */ jsx(
      ShadowItem,
      {
        shadow,
        category
      },
      shadow.slug
    )) })
  ] });
}
function ShadowItem({ shadow, category }) {
  return /* @__PURE__ */ jsx(
    NavigationButtonAsItem,
    {
      path: `/shadows/edit/${category}/${shadow.slug}`,
      children: /* @__PURE__ */ jsxs(HStack, { children: [
        /* @__PURE__ */ jsx(FlexItem, { children: shadow.name }),
        /* @__PURE__ */ jsx(Icon, { icon: isRTL() ? chevronLeft : chevronRight })
      ] })
    }
  );
}
export {
  ShadowsPanel as default,
  defaultShadow
};
//# sourceMappingURL=shadows-panel.mjs.map
