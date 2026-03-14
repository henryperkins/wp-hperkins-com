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

// packages/global-styles-ui/src/font-sizes/font-sizes.tsx
var font_sizes_exports = {};
__export(font_sizes_exports, {
  default: () => font_sizes_default
});
module.exports = __toCommonJS(font_sizes_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_icons = require("@wordpress/icons");
var import_element = require("@wordpress/element");
var import_subtitle = require("../subtitle.cjs");
var import_navigation_button = require("../navigation-button.cjs");
var import_utils = require("../utils.cjs");
var import_screen_header = require("../screen-header.cjs");
var import_confirm_reset_font_sizes_dialog = __toESM(require("./confirm-reset-font-sizes-dialog.cjs"));
var import_hooks = require("../hooks.cjs");
var import_lock_unlock = require("../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { Menu } = (0, import_lock_unlock.unlock)(import_components.privateApis);
function FontSizeGroup({
  label,
  origin,
  sizes,
  handleAddFontSize,
  handleResetFontSizes
}) {
  const [isResetDialogOpen, setIsResetDialogOpen] = (0, import_element.useState)(false);
  const toggleResetDialog = () => setIsResetDialogOpen(!isResetDialogOpen);
  const resetDialogText = origin === "custom" ? (0, import_i18n.__)(
    "Are you sure you want to remove all custom font size presets?"
  ) : (0, import_i18n.__)(
    "Are you sure you want to reset all font size presets to their default values?"
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    handleResetFontSizes && isResetDialogOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_confirm_reset_font_sizes_dialog.default,
      {
        text: resetDialogText,
        confirmButtonText: origin === "custom" ? (0, import_i18n.__)("Remove") : (0, import_i18n.__)("Reset"),
        isOpen: isResetDialogOpen,
        toggleOpen: toggleResetDialog,
        onConfirm: handleResetFontSizes
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 4, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_subtitle.Subtitle, { level: 3, children: label }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.FlexItem, { className: "global-styles-ui__typography-panel__options-container", children: [
          origin === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              label: (0, import_i18n.__)("Add font size"),
              icon: import_icons.plus,
              size: "small",
              onClick: handleAddFontSize
            }
          ),
          !!handleResetFontSizes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Menu, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Menu.TriggerButton,
              {
                render: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_components.Button,
                  {
                    size: "small",
                    icon: import_icons.moreVertical,
                    label: (0, import_i18n.__)(
                      "Font size presets options"
                    )
                  }
                )
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu.Popover, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu.Item, { onClick: toggleResetDialog, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu.ItemLabel, { children: origin === "custom" ? (0, import_i18n.__)(
              "Remove font size presets"
            ) : (0, import_i18n.__)(
              "Reset font size presets"
            ) }) }) })
          ] })
        ] })
      ] }),
      !!sizes.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalItemGroup, { isBordered: true, isSeparated: true, children: sizes.map((size) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_navigation_button.NavigationButtonAsItem,
        {
          path: `/typography/font-sizes/${origin}/${size.slug}`,
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { className: "global-styles-ui-font-size__item", children: size.name }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { display: "flex", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_icons.Icon,
              {
                icon: (0, import_i18n.isRTL)() ? import_icons.chevronLeft : import_icons.chevronRight
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
  const [themeFontSizes, setThemeFontSizes] = (0, import_hooks.useSetting)(
    "typography.fontSizes.theme"
  );
  const [baseThemeFontSizes] = (0, import_hooks.useSetting)(
    "typography.fontSizes.theme",
    "base"
  );
  const [defaultFontSizes, setDefaultFontSizes] = (0, import_hooks.useSetting)(
    "typography.fontSizes.default"
  );
  const [baseDefaultFontSizes] = (0, import_hooks.useSetting)(
    "typography.fontSizes.default",
    "base"
  );
  const [customFontSizes = [], setCustomFontSizes] = (0, import_hooks.useSetting)(
    "typography.fontSizes.custom"
  );
  const [defaultFontSizesEnabled] = (0, import_hooks.useSetting)(
    "typography.defaultFontSizes"
  );
  const handleAddFontSize = () => {
    const index = (0, import_utils.getNewIndexFromPresets)(customFontSizes, "custom-");
    const newFontSize = {
      /* translators: %d: font size index */
      name: (0, import_i18n.sprintf)((0, import_i18n.__)("New Font Size %d"), index),
      size: "16px",
      slug: `custom-${index}`
    };
    setCustomFontSizes([...customFontSizes, newFontSize]);
  };
  const hasSameSizeValues = (arr1, arr2) => arr1.map((item) => item.size).join("") === arr2.map((item) => item.size).join("");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 2, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_screen_header.ScreenHeader,
      {
        title: (0, import_i18n.__)("Font size presets"),
        description: (0, import_i18n.__)(
          "Create and edit the presets used for font sizes across the site."
        )
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalView, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalSpacer, { paddingX: 4, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 8, children: [
      !!themeFontSizes?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        FontSizeGroup,
        {
          label: (0, import_i18n.__)("Theme"),
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
      defaultFontSizesEnabled && !!defaultFontSizes?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        FontSizeGroup,
        {
          label: (0, import_i18n.__)("Default"),
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
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        FontSizeGroup,
        {
          label: (0, import_i18n.__)("Custom"),
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
//# sourceMappingURL=font-sizes.cjs.map
