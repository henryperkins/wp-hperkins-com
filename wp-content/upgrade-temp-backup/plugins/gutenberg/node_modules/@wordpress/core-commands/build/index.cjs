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

// packages/core-commands/src/index.js
var index_exports = {};
__export(index_exports, {
  initializeCommandPalette: () => initializeCommandPalette,
  privateApis: () => import_private_apis.privateApis
});
module.exports = __toCommonJS(index_exports);
var import_element = require("@wordpress/element");
var import_router = require("@wordpress/router");
var import_commands = require("@wordpress/commands");
var import_admin_navigation_commands = require("./admin-navigation-commands.cjs");
var import_site_editor_navigation_commands = require("./site-editor-navigation-commands.cjs");
var import_lock_unlock = require("./lock-unlock.cjs");
var import_private_apis = require("./private-apis.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { RouterProvider } = (0, import_lock_unlock.unlock)(import_router.privateApis);
function CommandPalette({ settings }) {
  const { menu_commands: menuCommands, is_network_admin: isNetworkAdmin } = settings;
  (0, import_admin_navigation_commands.useAdminNavigationCommands)(menuCommands);
  (0, import_site_editor_navigation_commands.useSiteEditorNavigationCommands)(isNetworkAdmin);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouterProvider, { pathArg: "p", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_commands.CommandMenu, {}) });
}
function initializeCommandPalette(settings) {
  const root = document.createElement("div");
  document.body.appendChild(root);
  (0, import_element.createRoot)(root).render(
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_element.StrictMode, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandPalette, { settings }) })
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  initializeCommandPalette,
  privateApis
});
//# sourceMappingURL=index.cjs.map
