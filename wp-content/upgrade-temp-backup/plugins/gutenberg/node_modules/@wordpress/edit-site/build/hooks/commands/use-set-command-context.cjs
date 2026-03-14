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

// packages/edit-site/src/hooks/commands/use-set-command-context.js
var use_set_command_context_exports = {};
__export(use_set_command_context_exports, {
  default: () => useSetCommandContext
});
module.exports = __toCommonJS(use_set_command_context_exports);
var import_data = require("@wordpress/data");
var import_commands = require("@wordpress/commands");
var import_block_editor = require("@wordpress/block-editor");
var import_router = require("@wordpress/router");
var import_lock_unlock = require("../../lock-unlock.cjs");
var { useCommandContext } = (0, import_lock_unlock.unlock)(import_commands.privateApis);
var { useLocation } = (0, import_lock_unlock.unlock)(import_router.privateApis);
function useSetCommandContext() {
  const { query = {} } = useLocation();
  const { canvas = "view" } = query;
  const hasBlockSelected = (0, import_data.useSelect)((select) => {
    return select(import_block_editor.store).getBlockSelectionStart();
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
//# sourceMappingURL=use-set-command-context.cjs.map
