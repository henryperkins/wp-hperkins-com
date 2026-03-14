"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/global-styles/menu.js
var menu_exports = {};
__export(menu_exports, {
  GlobalStylesActionMenu: () => GlobalStylesActionMenu
});
module.exports = __toCommonJS(menu_exports);
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_preferences = require("@wordpress/preferences");
var import_icons = require("@wordpress/icons");
var import_core_data = require("@wordpress/core-data");
var import_hooks = require("./hooks.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function GlobalStylesActionMenu({
  hideWelcomeGuide = false,
  onChangePath
}) {
  const { user, setUser } = (0, import_hooks.useGlobalStyles)();
  const canReset = !!user && (Object.keys(user?.styles ?? {}).length > 0 || Object.keys(user?.settings ?? {}).length > 0);
  const onReset = () => {
    setUser({ styles: {}, settings: {} });
  };
  const { toggle } = (0, import_data.useDispatch)(import_preferences.store);
  const { canEditCSS } = (0, import_data.useSelect)((select) => {
    const { getEntityRecord, __experimentalGetCurrentGlobalStylesId } = select(import_core_data.store);
    const globalStylesId = __experimentalGetCurrentGlobalStylesId();
    const globalStyles = globalStylesId ? getEntityRecord("root", "globalStyles", globalStylesId) : void 0;
    return {
      canEditCSS: !!globalStyles?._links?.["wp:action-edit-css"]
    };
  }, []);
  const loadCustomCSS = () => {
    onChangePath("/css");
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.DropdownMenu,
    {
      icon: import_icons.moreVertical,
      label: (0, import_i18n.__)("More"),
      toggleProps: { size: "compact" },
      children: ({ onClose }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.MenuGroup, { children: [
          canEditCSS && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.MenuItem, { onClick: loadCustomCSS, children: (0, import_i18n.__)("Additional CSS") }),
          !hideWelcomeGuide && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.MenuItem,
            {
              onClick: () => {
                toggle(
                  "core/edit-site",
                  "welcomeGuideStyles"
                );
                onClose();
              },
              children: (0, import_i18n.__)("Welcome Guide")
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.MenuGroup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.MenuItem,
          {
            onClick: () => {
              onReset();
              onClose();
            },
            disabled: !canReset,
            children: (0, import_i18n.__)("Reset styles")
          }
        ) })
      ] })
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GlobalStylesActionMenu
});
//# sourceMappingURL=menu.cjs.map
