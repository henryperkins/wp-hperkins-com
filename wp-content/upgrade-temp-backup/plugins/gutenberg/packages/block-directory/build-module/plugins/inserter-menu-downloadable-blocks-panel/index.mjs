// packages/block-directory/src/plugins/inserter-menu-downloadable-blocks-panel/index.js
import { __unstableInserterMenuExtension } from "@wordpress/block-editor";
import { debounce } from "@wordpress/compose";
import { useState } from "@wordpress/element";
import DownloadableBlocksPanel from "../../components/downloadable-blocks-panel/index.mjs";
import { jsx } from "react/jsx-runtime";
function InserterMenuDownloadableBlocksPanel() {
  const [debouncedFilterValue, setFilterValue] = useState("");
  const debouncedSetFilterValue = debounce(setFilterValue, 400);
  return /* @__PURE__ */ jsx(__unstableInserterMenuExtension, { children: ({ onSelect, onHover, filterValue, hasItems }) => {
    if (debouncedFilterValue !== filterValue) {
      debouncedSetFilterValue(filterValue);
    }
    if (!debouncedFilterValue) {
      return null;
    }
    return /* @__PURE__ */ jsx(
      DownloadableBlocksPanel,
      {
        onSelect,
        onHover,
        filterValue: debouncedFilterValue,
        hasLocalBlocks: hasItems,
        isTyping: filterValue !== debouncedFilterValue
      }
    );
  } });
}
var inserter_menu_downloadable_blocks_panel_default = InserterMenuDownloadableBlocksPanel;
export {
  inserter_menu_downloadable_blocks_panel_default as default
};
//# sourceMappingURL=index.mjs.map
