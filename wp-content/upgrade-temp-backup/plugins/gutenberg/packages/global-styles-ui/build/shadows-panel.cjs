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

// packages/global-styles-ui/src/shadows-panel.tsx
var shadows_panel_exports = {};
__export(shadows_panel_exports, {
  default: () => ShadowsPanel,
  defaultShadow: () => defaultShadow
});
module.exports = __toCommonJS(shadows_panel_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_element = require("@wordpress/element");
var import_subtitle = require("./subtitle.cjs");
var import_navigation_button = require("./navigation-button.cjs");
var import_screen_header = require("./screen-header.cjs");
var import_screen_body = require("./screen-body.cjs");
var import_utils = require("./utils.cjs");
var import_confirm_reset_shadow_dialog = __toESM(require("./confirm-reset-shadow-dialog.cjs"));
var import_hooks = require("./hooks.cjs");
var import_lock_unlock = require("./lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { Menu } = (0, import_lock_unlock.unlock)(import_components.privateApis);
var defaultShadow = "6px 6px 9px rgba(0, 0, 0, 0.2)";
function ShadowsPanel() {
  const [defaultShadows] = (0, import_hooks.useSetting)("shadow.presets.default");
  const [defaultShadowsEnabled] = (0, import_hooks.useSetting)("shadow.defaultPresets");
  const [themeShadows] = (0, import_hooks.useSetting)("shadow.presets.theme");
  const [customShadows, setCustomShadows] = (0, import_hooks.useSetting)(
    "shadow.presets.custom"
  );
  const onCreateShadow = (shadow) => {
    setCustomShadows([...customShadows || [], shadow]);
  };
  const handleResetShadows = () => {
    setCustomShadows([]);
  };
  const [isResetDialogOpen, setIsResetDialogOpen] = (0, import_element.useState)(false);
  const toggleResetDialog = () => setIsResetDialogOpen(!isResetDialogOpen);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    isResetDialogOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_confirm_reset_shadow_dialog.default,
      {
        text: (0, import_i18n.__)(
          "Are you sure you want to remove all custom shadows?"
        ),
        confirmButtonText: (0, import_i18n.__)("Remove"),
        isOpen: isResetDialogOpen,
        toggleOpen: toggleResetDialog,
        onConfirm: handleResetShadows
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_screen_header.ScreenHeader,
      {
        title: (0, import_i18n.__)("Shadows"),
        description: (0, import_i18n.__)(
          "Manage and create shadow styles for use across the site."
        )
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_screen_body.ScreenBody, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      import_components.__experimentalVStack,
      {
        className: "global-styles-ui__shadows-panel",
        spacing: 7,
        children: [
          defaultShadowsEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            ShadowList,
            {
              label: (0, import_i18n.__)("Default"),
              shadows: defaultShadows || [],
              category: "default"
            }
          ),
          themeShadows && themeShadows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            ShadowList,
            {
              label: (0, import_i18n.__)("Theme"),
              shadows: themeShadows || [],
              category: "theme"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            ShadowList,
            {
              label: (0, import_i18n.__)("Custom"),
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
    const newIndex = (0, import_utils.getNewIndexFromPresets)(shadows, "shadow-");
    onCreate?.({
      name: (0, import_i18n.sprintf)(
        /* translators: %d: is an index for a preset */
        (0, import_i18n.__)("Shadow %d"),
        newIndex
      ),
      shadow: defaultShadow,
      slug: `shadow-${newIndex}`
    });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 2, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "space-between", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_subtitle.Subtitle, { level: 3, children: label }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.FlexItem, { className: "global-styles-ui__shadows-panel__options-container", children: [
        canCreate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            size: "small",
            icon: import_icons.plus,
            label: (0, import_i18n.__)("Add shadow"),
            onClick: () => {
              handleAddShadow();
            }
          }
        ),
        !!shadows?.length && category === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Menu, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Menu.TriggerButton,
            {
              render: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.Button,
                {
                  size: "small",
                  icon: import_icons.moreVertical,
                  label: (0, import_i18n.__)("Shadow options")
                }
              )
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu.Popover, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu.Item, { onClick: onReset, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu.ItemLabel, { children: (0, import_i18n.__)("Remove all custom shadows") }) }) })
        ] })
      ] })
    ] }),
    shadows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalItemGroup, { isBordered: true, isSeparated: true, children: shadows.map((shadow) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_navigation_button.NavigationButtonAsItem,
    {
      path: `/shadows/edit/${category}/${shadow.slug}`,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children: shadow.name }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icons.Icon, { icon: (0, import_i18n.isRTL)() ? import_icons.chevronLeft : import_icons.chevronRight })
      ] })
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  defaultShadow
});
//# sourceMappingURL=shadows-panel.cjs.map
