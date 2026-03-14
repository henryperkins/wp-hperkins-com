// packages/global-styles-ui/src/font-sizes/font-sizes.tsx
import { __, sprintf, isRTL } from "@wordpress/i18n";
import {
  privateApis as componentsPrivateApis,
  __experimentalSpacer as Spacer,
  __experimentalView as View,
  __experimentalItemGroup as ItemGroup,
  __experimentalVStack as VStack,
  __experimentalHStack as HStack,
  FlexItem,
  Button
} from "@wordpress/components";
import {
  Icon,
  plus,
  moreVertical,
  chevronLeft,
  chevronRight
} from "@wordpress/icons";
import { useState } from "@wordpress/element";
import { Subtitle } from "../subtitle.mjs";
import { NavigationButtonAsItem } from "../navigation-button.mjs";
import { getNewIndexFromPresets } from "../utils.mjs";
import { ScreenHeader } from "../screen-header.mjs";
import ConfirmResetFontSizesDialog from "./confirm-reset-font-sizes-dialog.mjs";
import { useSetting } from "../hooks.mjs";
import { unlock } from "../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { Menu } = unlock(componentsPrivateApis);
function FontSizeGroup({
  label,
  origin,
  sizes,
  handleAddFontSize,
  handleResetFontSizes
}) {
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const toggleResetDialog = () => setIsResetDialogOpen(!isResetDialogOpen);
  const resetDialogText = origin === "custom" ? __(
    "Are you sure you want to remove all custom font size presets?"
  ) : __(
    "Are you sure you want to reset all font size presets to their default values?"
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    handleResetFontSizes && isResetDialogOpen && /* @__PURE__ */ jsx(
      ConfirmResetFontSizesDialog,
      {
        text: resetDialogText,
        confirmButtonText: origin === "custom" ? __("Remove") : __("Reset"),
        isOpen: isResetDialogOpen,
        toggleOpen: toggleResetDialog,
        onConfirm: handleResetFontSizes
      }
    ),
    /* @__PURE__ */ jsxs(VStack, { spacing: 4, children: [
      /* @__PURE__ */ jsxs(HStack, { children: [
        /* @__PURE__ */ jsx(Subtitle, { level: 3, children: label }),
        /* @__PURE__ */ jsxs(FlexItem, { className: "global-styles-ui__typography-panel__options-container", children: [
          origin === "custom" && /* @__PURE__ */ jsx(
            Button,
            {
              label: __("Add font size"),
              icon: plus,
              size: "small",
              onClick: handleAddFontSize
            }
          ),
          !!handleResetFontSizes && /* @__PURE__ */ jsxs(Menu, { children: [
            /* @__PURE__ */ jsx(
              Menu.TriggerButton,
              {
                render: /* @__PURE__ */ jsx(
                  Button,
                  {
                    size: "small",
                    icon: moreVertical,
                    label: __(
                      "Font size presets options"
                    )
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx(Menu.Popover, { children: /* @__PURE__ */ jsx(Menu.Item, { onClick: toggleResetDialog, children: /* @__PURE__ */ jsx(Menu.ItemLabel, { children: origin === "custom" ? __(
              "Remove font size presets"
            ) : __(
              "Reset font size presets"
            ) }) }) })
          ] })
        ] })
      ] }),
      !!sizes.length && /* @__PURE__ */ jsx(ItemGroup, { isBordered: true, isSeparated: true, children: sizes.map((size) => /* @__PURE__ */ jsx(
        NavigationButtonAsItem,
        {
          path: `/typography/font-sizes/${origin}/${size.slug}`,
          children: /* @__PURE__ */ jsxs(HStack, { children: [
            /* @__PURE__ */ jsx(FlexItem, { className: "global-styles-ui-font-size__item", children: size.name }),
            /* @__PURE__ */ jsx(FlexItem, { display: "flex", children: /* @__PURE__ */ jsx(
              Icon,
              {
                icon: isRTL() ? chevronLeft : chevronRight
              }
            ) })
          ] })
        },
        size.slug
      )) })
    ] })
  ] });
}
function FontSizes() {
  const [themeFontSizes, setThemeFontSizes] = useSetting(
    "typography.fontSizes.theme"
  );
  const [baseThemeFontSizes] = useSetting(
    "typography.fontSizes.theme",
    "base"
  );
  const [defaultFontSizes, setDefaultFontSizes] = useSetting(
    "typography.fontSizes.default"
  );
  const [baseDefaultFontSizes] = useSetting(
    "typography.fontSizes.default",
    "base"
  );
  const [customFontSizes = [], setCustomFontSizes] = useSetting(
    "typography.fontSizes.custom"
  );
  const [defaultFontSizesEnabled] = useSetting(
    "typography.defaultFontSizes"
  );
  const handleAddFontSize = () => {
    const index = getNewIndexFromPresets(customFontSizes, "custom-");
    const newFontSize = {
      /* translators: %d: font size index */
      name: sprintf(__("New Font Size %d"), index),
      size: "16px",
      slug: `custom-${index}`
    };
    setCustomFontSizes([...customFontSizes, newFontSize]);
  };
  const hasSameSizeValues = (arr1, arr2) => arr1.map((item) => item.size).join("") === arr2.map((item) => item.size).join("");
  return /* @__PURE__ */ jsxs(VStack, { spacing: 2, children: [
    /* @__PURE__ */ jsx(
      ScreenHeader,
      {
        title: __("Font size presets"),
        description: __(
          "Create and edit the presets used for font sizes across the site."
        )
      }
    ),
    /* @__PURE__ */ jsx(View, { children: /* @__PURE__ */ jsx(Spacer, { paddingX: 4, children: /* @__PURE__ */ jsxs(VStack, { spacing: 8, children: [
      !!themeFontSizes?.length && /* @__PURE__ */ jsx(
        FontSizeGroup,
        {
          label: __("Theme"),
          origin: "theme",
          sizes: themeFontSizes,
          handleAddFontSize,
          handleResetFontSizes: hasSameSizeValues(
            themeFontSizes,
            baseThemeFontSizes
          ) ? void 0 : () => setThemeFontSizes(
            baseThemeFontSizes
          )
        }
      ),
      defaultFontSizesEnabled && !!defaultFontSizes?.length && /* @__PURE__ */ jsx(
        FontSizeGroup,
        {
          label: __("Default"),
          origin: "default",
          sizes: defaultFontSizes,
          handleAddFontSize,
          handleResetFontSizes: hasSameSizeValues(
            defaultFontSizes,
            baseDefaultFontSizes
          ) ? void 0 : () => setDefaultFontSizes(
            baseDefaultFontSizes
          )
        }
      ),
      /* @__PURE__ */ jsx(
        FontSizeGroup,
        {
          label: __("Custom"),
          origin: "custom",
          sizes: customFontSizes,
          handleAddFontSize,
          handleResetFontSizes: customFontSizes.length > 0 ? () => setCustomFontSizes([]) : void 0
        }
      )
    ] }) }) })
  ] });
}
var font_sizes_default = FontSizes;
export {
  font_sizes_default as default
};
//# sourceMappingURL=font-sizes.mjs.map
