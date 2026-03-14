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

// packages/edit-site/src/components/app/index.js
var app_exports = {};
__export(app_exports, {
  default: () => App
});
module.exports = __toCommonJS(app_exports);
var import_data = require("@wordpress/data");
var import_router = require("@wordpress/router");
var import_element = require("@wordpress/element");
var import_core_data = require("@wordpress/core-data");
var import_layout = __toESM(require("../layout/index.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_store = require("../../store/index.cjs");
var import_use_common_commands = require("../../hooks/commands/use-common-commands.cjs");
var import_use_set_command_context = __toESM(require("../../hooks/commands/use-set-command-context.cjs"));
var import_site_editor_routes = require("../site-editor-routes/index.cjs");
var import_is_previewing_theme = require("../../utils/is-previewing-theme.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { RouterProvider } = (0, import_lock_unlock.unlock)(import_router.privateApis);
function AppLayout() {
  (0, import_use_common_commands.useCommonCommands)();
  (0, import_use_set_command_context.default)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_layout.default, {});
}
function App() {
  (0, import_site_editor_routes.useRegisterSiteEditorRoutes)();
  const { routes, currentTheme, editorSettings } = (0, import_data.useSelect)((select) => {
    return {
      routes: (0, import_lock_unlock.unlock)(select(import_store.store)).getRoutes(),
      currentTheme: select(import_core_data.store).getCurrentTheme(),
      // This is a temp solution until the has_theme_json value is available for the current theme.
      editorSettings: select(import_store.store).getSettings()
    };
  }, []);
  const beforeNavigate = (0, import_element.useCallback)(({ path, query }) => {
    if (!(0, import_is_previewing_theme.isPreviewingTheme)()) {
      return { path, query };
    }
    return {
      path,
      query: {
        ...query,
        wp_theme_preview: "wp_theme_preview" in query ? query.wp_theme_preview : (0, import_is_previewing_theme.currentlyPreviewingTheme)()
      }
    };
  }, []);
  const matchResolverArgsValue = (0, import_element.useMemo)(
    () => ({
      siteData: { currentTheme, editorSettings }
    }),
    [currentTheme, editorSettings]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    RouterProvider,
    {
      routes,
      pathArg: "p",
      beforeNavigate,
      matchResolverArgs: matchResolverArgsValue,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppLayout, {})
    }
  );
}
//# sourceMappingURL=index.cjs.map
