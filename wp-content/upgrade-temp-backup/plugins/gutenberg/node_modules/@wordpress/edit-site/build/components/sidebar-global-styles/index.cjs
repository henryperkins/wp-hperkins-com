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

// packages/edit-site/src/components/sidebar-global-styles/index.js
var sidebar_global_styles_exports = {};
__export(sidebar_global_styles_exports, {
  default: () => SidebarGlobalStyles,
  useSection: () => useSection
});
module.exports = __toCommonJS(sidebar_global_styles_exports);
var import_admin_ui = require("@wordpress/admin-ui");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_router = require("@wordpress/router");
var import_editor = require("@wordpress/editor");
var import_compose = require("@wordpress/compose");
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_url = require("@wordpress/url");
var import_icons = require("@wordpress/icons");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { GlobalStylesUIWrapper, GlobalStylesActionMenu } = (0, import_lock_unlock.unlock)(import_editor.privateApis);
var { useLocation, useHistory } = (0, import_lock_unlock.unlock)(import_router.privateApis);
var GlobalStylesPageActions = ({
  isStyleBookOpened,
  setIsStyleBookOpened,
  path,
  onChangeSection
}) => {
  const history = useHistory();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Button,
      {
        isPressed: isStyleBookOpened,
        icon: import_icons.seen,
        label: (0, import_i18n.__)("Style Book"),
        onClick: () => {
          setIsStyleBookOpened(!isStyleBookOpened);
          const updatedPath = !isStyleBookOpened ? (0, import_url.addQueryArgs)(path, { preview: "stylebook" }) : (0, import_url.removeQueryArgs)(path, "preview");
          history.navigate(updatedPath);
        },
        size: "compact"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      GlobalStylesActionMenu,
      {
        hideWelcomeGuide: true,
        onChangePath: onChangeSection
      }
    )
  ] });
};
var useSection = () => {
  const { path, query } = useLocation();
  const history = useHistory();
  return (0, import_element.useMemo)(() => {
    return [
      query.section ?? "/",
      (updatedSection) => {
        history.navigate(
          (0, import_url.addQueryArgs)(path, {
            section: updatedSection
          })
        );
      }
    ];
  }, [path, query.section, history]);
};
function SidebarGlobalStyles() {
  const { path } = useLocation();
  const [isStyleBookOpened, setIsStyleBookOpened] = (0, import_element.useState)(
    path.includes("preview=stylebook")
  );
  const isMobileViewport = (0, import_compose.useViewportMatch)("medium", "<");
  const [section, onChangeSection] = useSection();
  const settings = (0, import_data.useSelect)(
    (select) => select(import_store.store).getSettings(),
    []
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_admin_ui.Page,
    {
      actions: !isMobileViewport ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        GlobalStylesPageActions,
        {
          isStyleBookOpened,
          setIsStyleBookOpened,
          path,
          onChangeSection
        }
      ) : null,
      className: "edit-site-styles",
      title: (0, import_i18n.__)("Styles"),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        GlobalStylesUIWrapper,
        {
          path: section,
          onPathChange: onChangeSection,
          settings
        }
      )
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useSection
});
//# sourceMappingURL=index.cjs.map
