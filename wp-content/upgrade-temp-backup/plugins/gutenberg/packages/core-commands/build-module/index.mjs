// packages/core-commands/src/index.js
import { createRoot, StrictMode } from "@wordpress/element";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { CommandMenu } from "@wordpress/commands";
import { useAdminNavigationCommands } from "./admin-navigation-commands.mjs";
import { useSiteEditorNavigationCommands } from "./site-editor-navigation-commands.mjs";
import { unlock } from "./lock-unlock.mjs";
import { privateApis } from "./private-apis.mjs";
import { jsx } from "react/jsx-runtime";
var { RouterProvider } = unlock(routerPrivateApis);
function CommandPalette({ settings }) {
  const { menu_commands: menuCommands, is_network_admin: isNetworkAdmin } = settings;
  useAdminNavigationCommands(menuCommands);
  useSiteEditorNavigationCommands(isNetworkAdmin);
  return /* @__PURE__ */ jsx(RouterProvider, { pathArg: "p", children: /* @__PURE__ */ jsx(CommandMenu, {}) });
}
function initializeCommandPalette(settings) {
  const root = document.createElement("div");
  document.body.appendChild(root);
  createRoot(root).render(
    /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(CommandPalette, { settings }) })
  );
}
export {
  initializeCommandPalette,
  privateApis
};
//# sourceMappingURL=index.mjs.map
