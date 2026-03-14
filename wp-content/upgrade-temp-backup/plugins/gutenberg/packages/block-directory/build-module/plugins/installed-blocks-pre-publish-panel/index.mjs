// packages/block-directory/src/plugins/installed-blocks-pre-publish-panel/index.js
import { _n, sprintf } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { PluginPrePublishPanel } from "@wordpress/editor";
import CompactList from "../../components/compact-list/index.mjs";
import { store as blockDirectoryStore } from "../../store/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function InstalledBlocksPrePublishPanel() {
  const newBlockTypes = useSelect(
    (select) => select(blockDirectoryStore).getNewBlockTypes(),
    []
  );
  if (!newBlockTypes.length) {
    return null;
  }
  return /* @__PURE__ */ jsxs(
    PluginPrePublishPanel,
    {
      title: sprintf(
        // translators: %d: number of blocks (number).
        _n(
          "Added: %d block",
          "Added: %d blocks",
          newBlockTypes.length
        ),
        newBlockTypes.length
      ),
      initialOpen: true,
      children: [
        /* @__PURE__ */ jsx("p", { className: "installed-blocks-pre-publish-panel__copy", children: _n(
          "The following block has been added to your site.",
          "The following blocks have been added to your site.",
          newBlockTypes.length
        ) }),
        /* @__PURE__ */ jsx(CompactList, { items: newBlockTypes })
      ]
    }
  );
}
export {
  InstalledBlocksPrePublishPanel as default
};
//# sourceMappingURL=index.mjs.map
