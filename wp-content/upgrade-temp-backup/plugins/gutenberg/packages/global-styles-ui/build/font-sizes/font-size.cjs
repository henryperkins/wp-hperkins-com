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

// packages/global-styles-ui/src/font-sizes/font-size.tsx
var font_size_exports = {};
__export(font_size_exports, {
  default: () => font_size_default
});
module.exports = __toCommonJS(font_size_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_icons = require("@wordpress/icons");
var import_element = require("@wordpress/element");
var import_screen_header = require("../screen-header.cjs");
var import_font_size_preview = __toESM(require("./font-size-preview.cjs"));
var import_confirm_delete_font_size_dialog = __toESM(require("./confirm-delete-font-size-dialog.cjs"));
var import_rename_font_size_dialog = __toESM(require("./rename-font-size-dialog.cjs"));
var import_size_control = require("../size-control/index.cjs");
var import_hooks = require("../hooks.cjs");
var import_lock_unlock = require("../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { Menu } = (0, import_lock_unlock.unlock)(import_components.privateApis);
function FontSize() {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = (0, import_element.useState)(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = (0, import_element.useState)(false);
  const {
    params: { origin, slug },
    goBack
  } = (0, import_components.useNavigator)();
  const [fontSizes, setFontSizes] = (0, import_hooks.useSetting)("typography.fontSizes");
  const [globalFluid] = (0, import_hooks.useSetting)("typography.fluid");
  const sizes = fontSizes?.[origin] ?? [];
  const fontSize = sizes.find(
    (size) => size.slug === slug
  );
  (0, import_element.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_confirm_delete_font_size_dialog.default,
      {
        fontSize,
        isOpen: isDeleteConfirmOpen,
        toggleOpen: toggleDeleteConfirm,
        handleRemoveFontSize
      }
    ),
    isRenameDialogOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_rename_font_size_dialog.default,
      {
        fontSize,
        toggleOpen: toggleRenameDialog,
        handleRename: handleNameChange
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 4, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "space-between", alignment: "flex-start", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_screen_header.ScreenHeader,
          {
            title: fontSize.name,
            description: (0, import_i18n.sprintf)(
              /* translators: %s: font size preset name. */
              (0, import_i18n.__)("Manage the font size %s."),
              fontSize.name
            )
          }
        ),
        origin === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.__experimentalSpacer,
          {
            marginTop: 3,
            marginBottom: 0,
            paddingX: 4,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Menu, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Menu.TriggerButton,
                {
                  render: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    import_components.Button,
                    {
                      size: "small",
                      icon: import_icons.moreVertical,
                      label: (0, import_i18n.__)(
                        "Font size options"
                      )
                    }
                  )
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Menu.Popover, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Menu.Item,
                  {
                    onClick: toggleRenameDialog,
                    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu.ItemLabel, { children: (0, import_i18n.__)("Rename") })
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Menu.Item,
                  {
                    onClick: toggleDeleteConfirm,
                    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu.ItemLabel, { children: (0, import_i18n.__)("Delete") })
                  }
                )
              ] })
            ] })
          }
        ) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalView, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.__experimentalSpacer,
        {
          paddingX: 4,
          marginBottom: 0,
          paddingBottom: 6,
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 4, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_font_size_preview.default, { fontSize }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_size_control.SizeControl,
              {
                label: (0, import_i18n.__)("Size"),
                value: !isCustomFluid && fontSize.size ? String(fontSize.size) : "",
                onChange: handleFontSizeChange,
                disabled: isCustomFluid
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.ToggleControl,
              {
                label: (0, import_i18n.__)("Fluid typography"),
                help: (0, import_i18n.__)(
                  "Scale the font size dynamically to fit the screen or viewport."
                ),
                checked: isFluid,
                onChange: handleFluidChange
              }
            ),
            isFluid && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.ToggleControl,
              {
                label: (0, import_i18n.__)("Custom fluid values"),
                help: (0, import_i18n.__)(
                  "Set custom min and max values for the fluid font size."
                ),
                checked: isCustomFluid,
                onChange: handleCustomFluidValues
              }
            ),
            isCustomFluid && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_size_control.SizeControl,
                {
                  label: (0, import_i18n.__)("Minimum"),
                  value: typeof fontSize?.fluid === "object" ? fontSize.fluid?.min : void 0,
                  onChange: handleMinChange
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_size_control.SizeControl,
                {
                  label: (0, import_i18n.__)("Maximum"),
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
//# sourceMappingURL=font-size.cjs.map
