// packages/core-commands/src/admin-navigation-commands.js
import { useCommandLoader, useCommands } from "@wordpress/commands";
import { __, sprintf } from "@wordpress/i18n";
import { external } from "@wordpress/icons";
import { useMemo } from "@wordpress/element";
import { store as coreStore } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
var getViewSiteCommand = () => function useViewSiteCommand() {
  const homeUrl = useSelect((select) => {
    return select(coreStore).getEntityRecord(
      "root",
      "__unstableBase"
    )?.home;
  }, []);
  const commands = useMemo(() => {
    if (!homeUrl) {
      return [];
    }
    return [
      {
        name: "core/view-site",
        label: __("View site"),
        icon: external,
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
  const commands = useMemo(() => {
    return (menuCommands ?? []).map((menuCommand) => {
      const label = sprintf(
        /* translators: %s: menu label */
        __("Go to: %s"),
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
  useCommands(commands);
  useCommandLoader({
    name: "core/view-site",
    hook: getViewSiteCommand()
  });
}
export {
  useAdminNavigationCommands
};
//# sourceMappingURL=admin-navigation-commands.mjs.map
