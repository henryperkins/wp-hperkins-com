// packages/edit-site/src/hooks/commands/use-set-command-context.js
import { useSelect } from "@wordpress/data";
import { privateApis as commandsPrivateApis } from "@wordpress/commands";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { unlock } from "../../lock-unlock.mjs";
var { useCommandContext } = unlock(commandsPrivateApis);
var { useLocation } = unlock(routerPrivateApis);
function useSetCommandContext() {
  const { query = {} } = useLocation();
  const { canvas = "view" } = query;
  const hasBlockSelected = useSelect((select) => {
    return select(blockEditorStore).getBlockSelectionStart();
  }, []);
  let commandContext = "site-editor";
  if (canvas === "edit") {
    commandContext = "entity-edit";
  }
  if (hasBlockSelected) {
    commandContext = "block-selection-edit";
  }
  useCommandContext(commandContext);
}
export {
  useSetCommandContext as default
};
//# sourceMappingURL=use-set-command-context.mjs.map
