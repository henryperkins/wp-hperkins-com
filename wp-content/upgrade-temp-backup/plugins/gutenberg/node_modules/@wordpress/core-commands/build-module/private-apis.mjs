// packages/core-commands/src/private-apis.js
import { useAdminNavigationCommands } from "./admin-navigation-commands.mjs";
import { useSiteEditorNavigationCommands } from "./site-editor-navigation-commands.mjs";
import { lock } from "./lock-unlock.mjs";
function useCommands() {
  useAdminNavigationCommands();
  useSiteEditorNavigationCommands();
}
var privateApis = {};
lock(privateApis, {
  useCommands
});
export {
  privateApis
};
//# sourceMappingURL=private-apis.mjs.map
