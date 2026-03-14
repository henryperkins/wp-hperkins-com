// packages/block-directory/src/plugins/index.js
import { registerPlugin } from "@wordpress/plugins";
import { addFilter } from "@wordpress/hooks";
import AutoBlockUninstaller from "../components/auto-block-uninstaller/index.mjs";
import InserterMenuDownloadableBlocksPanel from "./inserter-menu-downloadable-blocks-panel/index.mjs";
import InstalledBlocksPrePublishPanel from "./installed-blocks-pre-publish-panel/index.mjs";
import getInstallMissing from "./get-install-missing/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
registerPlugin("block-directory", {
  // The icon is explicitly set to undefined to prevent PluginPrePublishPanel
  // from rendering the fallback icon pluginIcon.
  icon: void 0,
  render() {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(AutoBlockUninstaller, {}),
      /* @__PURE__ */ jsx(InserterMenuDownloadableBlocksPanel, {}),
      /* @__PURE__ */ jsx(InstalledBlocksPrePublishPanel, {})
    ] });
  }
});
addFilter(
  "blocks.registerBlockType",
  "block-directory/fallback",
  (settings, name) => {
    if (name !== "core/missing") {
      return settings;
    }
    settings.edit = getInstallMissing(settings.edit);
    return settings;
  }
);
//# sourceMappingURL=index.mjs.map
