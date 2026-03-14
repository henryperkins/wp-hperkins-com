// packages/global-styles-ui/src/font-sizes/font-size.tsx
import { __, sprintf } from "@wordpress/i18n";
import {
  __experimentalSpacer as Spacer,
  useNavigator,
  __experimentalView as View,
  __experimentalHStack as HStack,
  __experimentalVStack as VStack,
  privateApis as componentsPrivateApis,
  Button,
  FlexItem,
  ToggleControl
} from "@wordpress/components";
import { moreVertical } from "@wordpress/icons";
import { useState, useEffect } from "@wordpress/element";
import { ScreenHeader } from "../screen-header.mjs";
import FontSizePreview from "./font-size-preview.mjs";
import ConfirmDeleteFontSizeDialog from "./confirm-delete-font-size-dialog.mjs";
import RenameFontSizeDialog from "./rename-font-size-dialog.mjs";
import { SizeControl } from "../size-control/index.mjs";
import { useSetting } from "../hooks.mjs";
import { unlock } from "../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { Menu } = unlock(componentsPrivateApis);
function FontSize() {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const {
    params: { origin, slug },
    goBack
  } = useNavigator();
  const [fontSizes, setFontSizes] = useSetting("typography.fontSizes");
  const [globalFluid] = useSetting("typography.fluid");
  const sizes = fontSizes?.[origin] ?? [];
  const fontSize = sizes.find(
    (size) => size.slug === slug
  );
  useEffect(() => {
    if (!!slug && !fontSize) {
      goBack();
    }
  }, [slug, fontSize, goBack]);
  if (!origin || !slug || !fontSize) {
    return null;
  }
  const isFluid = fontSize?.fluid !== void 0 ? !!fontSize.fluid : !!globalFluid;
  const isCustomFluid = typeof fontSize?.fluid === "object";
  const handleNameChange = (value) => {
    updateFontSize("name", value);
  };
  const handleFontSizeChange = (value) => {
    updateFontSize("size", value);
  };
  const handleFluidChange = (value) => {
    updateFontSize("fluid", value);
  };
  const handleCustomFluidValues = (value) => {
    if (value) {
      updateFontSize("fluid", {
        min: fontSize.size,
        max: fontSize.size
      });
    } else {
      updateFontSize("fluid", true);
    }
  };
  const handleMinChange = (value) => {
    const fluid = typeof fontSize.fluid === "object" ? fontSize.fluid : {};
    updateFontSize("fluid", { ...fluid, min: value });
  };
  const handleMaxChange = (value) => {
    const fluid = typeof fontSize.fluid === "object" ? fontSize.fluid : {};
    updateFontSize("fluid", { ...fluid, max: value });
  };
  const updateFontSize = (key, value) => {
    const newFontSizes = sizes.map((size) => {
      if (size.slug === slug) {
        return { ...size, [key]: value };
      }
      return size;
    });
    setFontSizes({
      ...fontSizes,
      [origin]: newFontSizes
    });
  };
  const handleRemoveFontSize = () => {
    const newFontSizes = sizes.filter((size) => size.slug !== slug);
    setFontSizes({
      ...fontSizes,
      [origin]: newFontSizes
    });
  };
  const toggleDeleteConfirm = () => {
    setIsDeleteConfirmOpen(!isDeleteConfirmOpen);
  };
  const toggleRenameDialog = () => {
    setIsRenameDialogOpen(!isRenameDialogOpen);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      ConfirmDeleteFontSizeDialog,
      {
        fontSize,
        isOpen: isDeleteConfirmOpen,
        toggleOpen: toggleDeleteConfirm,
        handleRemoveFontSize
      }
    ),
    isRenameDialogOpen && /* @__PURE__ */ jsx(
      RenameFontSizeDialog,
      {
        fontSize,
        toggleOpen: toggleRenameDialog,
        handleRename: handleNameChange
      }
    ),
    /* @__PURE__ */ jsxs(VStack, { spacing: 4, children: [
      /* @__PURE__ */ jsxs(HStack, { justify: "space-between", alignment: "flex-start", children: [
        /* @__PURE__ */ jsx(
          ScreenHeader,
          {
            title: fontSize.name,
            description: sprintf(
              /* translators: %s: font size preset name. */
              __("Manage the font size %s."),
              fontSize.name
            )
          }
        ),
        origin === "custom" && /* @__PURE__ */ jsx(FlexItem, { children: /* @__PURE__ */ jsx(
          Spacer,
          {
            marginTop: 3,
            marginBottom: 0,
            paddingX: 4,
            children: /* @__PURE__ */ jsxs(Menu, { children: [
              /* @__PURE__ */ jsx(
                Menu.TriggerButton,
                {
                  render: /* @__PURE__ */ jsx(
                    Button,
                    {
                      size: "small",
                      icon: moreVertical,
                      label: __(
                        "Font size options"
                      )
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxs(Menu.Popover, { children: [
                /* @__PURE__ */ jsx(
                  Menu.Item,
                  {
                    onClick: toggleRenameDialog,
                    children: /* @__PURE__ */ jsx(Menu.ItemLabel, { children: __("Rename") })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Menu.Item,
                  {
                    onClick: toggleDeleteConfirm,
                    children: /* @__PURE__ */ jsx(Menu.ItemLabel, { children: __("Delete") })
                  }
                )
              ] })
            ] })
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx(View, { children: /* @__PURE__ */ jsx(
        Spacer,
        {
          paddingX: 4,
          marginBottom: 0,
          paddingBottom: 6,
          children: /* @__PURE__ */ jsxs(VStack, { spacing: 4, children: [
            /* @__PURE__ */ jsx(FlexItem, { children: /* @__PURE__ */ jsx(FontSizePreview, { fontSize }) }),
            /* @__PURE__ */ jsx(
              SizeControl,
              {
                label: __("Size"),
                value: !isCustomFluid && fontSize.size ? String(fontSize.size) : "",
                onChange: handleFontSizeChange,
                disabled: isCustomFluid
              }
            ),
            /* @__PURE__ */ jsx(
              ToggleControl,
              {
                label: __("Fluid typography"),
                help: __(
                  "Scale the font size dynamically to fit the screen or viewport."
                ),
                checked: isFluid,
                onChange: handleFluidChange
              }
            ),
            isFluid && /* @__PURE__ */ jsx(
              ToggleControl,
              {
                label: __("Custom fluid values"),
                help: __(
                  "Set custom min and max values for the fluid font size."
                ),
                checked: isCustomFluid,
                onChange: handleCustomFluidValues
              }
            ),
            isCustomFluid && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(
                SizeControl,
                {
                  label: __("Minimum"),
                  value: typeof fontSize?.fluid === "object" ? fontSize.fluid?.min : void 0,
                  onChange: handleMinChange
                }
              ),
              /* @__PURE__ */ jsx(
                SizeControl,
                {
                  label: __("Maximum"),
                  value: typeof fontSize?.fluid === "object" ? fontSize.fluid?.max : void 0,
                  onChange: handleMaxChange
                }
              )
            ] })
          ] })
        }
      ) })
    ] })
  ] });
}
var font_size_default = FontSize;
export {
  font_size_default as default
};
//# sourceMappingURL=font-size.mjs.map
