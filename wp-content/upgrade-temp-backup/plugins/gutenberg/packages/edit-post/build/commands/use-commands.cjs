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

// packages/edit-post/src/commands/use-commands.js
var use_commands_exports = {};
__export(use_commands_exports, {
  default: () => useCommands
});
module.exports = __toCommonJS(use_commands_exports);
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_commands = require("@wordpress/commands");
var import_preferences = require("@wordpress/preferences");
var import_notices = require("@wordpress/notices");
function useCommands() {
  const { isFullscreen } = (0, import_data.useSelect)((select) => {
    const { get } = select(import_preferences.store);
    return {
      isFullscreen: get("core/edit-post", "fullscreenMode")
    };
  }, []);
  const { toggle } = (0, import_data.useDispatch)(import_preferences.store);
  const { createInfoNotice } = (0, import_data.useDispatch)(import_notices.store);
  (0, import_commands.useCommand)({
    name: "core/toggle-fullscreen-mode",
    label: isFullscreen ? (0, import_i18n.__)("Exit fullscreen") : (0, import_i18n.__)("Enter fullscreen"),
    icon: import_icons.fullscreen,
    category: "command",
    callback: ({ close }) => {
      toggle("core/edit-post", "fullscreenMode");
      close();
      createInfoNotice(
        isFullscreen ? (0, import_i18n.__)("Fullscreen off.") : (0, import_i18n.__)("Fullscreen on."),
        {
          id: "core/edit-post/toggle-fullscreen-mode/notice",
          type: "snackbar",
          actions: [
            {
              label: (0, import_i18n.__)("Undo"),
              onClick: () => {
                toggle("core/edit-post", "fullscreenMode");
              }
            }
          ]
        }
      );
    }
  });
}
//# sourceMappingURL=use-commands.cjs.map
