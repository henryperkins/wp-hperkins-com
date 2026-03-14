// packages/block-directory/src/components/downloadable-blocks-list/index.js
import { __ } from "@wordpress/i18n";
import { Composite } from "@wordpress/components";
import { getBlockType } from "@wordpress/blocks";
import { useDispatch } from "@wordpress/data";
import DownloadableBlockListItem from "../downloadable-block-list-item/index.mjs";
import { store as blockDirectoryStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
var noop = () => {
};
function DownloadableBlocksList({ items, onHover = noop, onSelect }) {
  const { installBlockType } = useDispatch(blockDirectoryStore);
  if (!items.length) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    Composite,
    {
      role: "listbox",
      className: "block-directory-downloadable-blocks-list",
      "aria-label": __("Blocks available for install"),
      children: items.map((item) => {
        return /* @__PURE__ */ jsx(
          DownloadableBlockListItem,
          {
            onClick: () => {
              if (getBlockType(item.name)) {
                onSelect(item);
              } else {
                installBlockType(item).then((success) => {
                  if (success) {
                    onSelect(item);
                  }
                });
              }
              onHover(null);
            },
            onHover,
            item
          },
          item.id
        );
      })
    }
  );
}
var downloadable_blocks_list_default = DownloadableBlocksList;
export {
  downloadable_blocks_list_default as default
};
//# sourceMappingURL=index.mjs.map
