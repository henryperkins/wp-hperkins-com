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

// packages/core-commands/src/admin-navigation-commands.js
var admin_navigation_commands_exports = {};
__export(admin_navigation_commands_exports, {
  useAdminNavigationCommands: () => useAdminNavigationCommands
});
module.exports = __toCommonJS(admin_navigation_commands_exports);
var import_commands = require("@wordpress/commands");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_element = require("@wordpress/element");
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var getViewSiteCommand = () => function useViewSiteCommand() {
  const homeUrl = (0, import_data.useSelect)((select) => {
    return select(import_core_data.store).getEntityRecord(
      "root",
      "__unstableBase"
    )?.home;
  }, []);
  const commands = (0, import_element.useMemo)(() => {
    if (!homeUrl) {
      return [];
    }
    return [
      {
        name: "core/view-site",
        label: (0, import_i18n.__)("View site"),
        icon: import_icons.external,
        category: "view",
        callback: ({ close }) => {
          close();
          window.open(homeUrl, "_blank");
        }
      }
    ];
  }, [homeUrl]);
  return {
    isLoading: false,
    commands
  };
};
function useAdminNavigationCommands(menuCommands) {
  const commands = (0, import_element.useMemo)(() => {
    return (menuCommands ?? []).map((menuCommand) => {
      const label = (0, import_i18n.sprintf)(
        /* translators: %s: menu label */
        (0, import_i18n.__)("Go to: %s"),
        menuCommand.label
      );
      return {
        name: menuCommand.name,
        label,
        searchLabel: label,
        category: "view",
        callback: ({ close }) => {
          document.location = menuCommand.url;
          close();
        }
      };
    });
  }, [menuCommands]);
  (0, import_commands.useCommands)(commands);
  (0, import_commands.useCommandLoader)({
    name: "core/view-site",
    hook: getViewSiteCommand()
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useAdminNavigationCommands
});
//# sourceMappingURL=admin-navigation-commands.cjs.map
