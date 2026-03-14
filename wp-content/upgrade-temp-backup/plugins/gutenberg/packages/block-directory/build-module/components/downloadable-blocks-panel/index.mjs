// packages/block-directory/src/components/downloadable-blocks-panel/index.js
import { __ } from "@wordpress/i18n";
import { Spinner } from "@wordpress/components";
import { store as coreStore } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
import { getBlockType } from "@wordpress/blocks";
import DownloadableBlocksList from "../downloadable-blocks-list/index.mjs";
import DownloadableBlocksInserterPanel from "./inserter-panel.mjs";
import DownloadableBlocksNoResults from "./no-results.mjs";
import { store as blockDirectoryStore } from "../../store/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var EMPTY_ARRAY = [];
var useDownloadableBlocks = (filterValue) => useSelect(
  (select) => {
    const {
      getDownloadableBlocks,
      isRequestingDownloadableBlocks,
      getInstalledBlockTypes
    } = select(blockDirectoryStore);
    const hasPermission = select(coreStore).canUser(
      "read",
      "block-directory/search"
    );
    let downloadableBlocks = EMPTY_ARRAY;
    if (hasPermission) {
      downloadableBlocks = getDownloadableBlocks(filterValue);
      const installedBlockTypes = getInstalledBlockTypes();
      const installableBlocks = downloadableBlocks.filter(
        ({ name }) => {
          const isJustInstalled = installedBlockTypes.some(
            (blockType) => blockType.name === name
          );
          const isPreviouslyInstalled = getBlockType(name);
          return isJustInstalled || !isPreviouslyInstalled;
        }
      );
      if (installableBlocks.length !== downloadableBlocks.length) {
        downloadableBlocks = installableBlocks;
      }
      if (downloadableBlocks.length === 0) {
        downloadableBlocks = EMPTY_ARRAY;
      }
    }
    return {
      hasPermission,
      downloadableBlocks,
      isLoading: isRequestingDownloadableBlocks(filterValue)
    };
  },
  [filterValue]
);
function DownloadableBlocksPanel({
  onSelect,
  onHover,
  hasLocalBlocks,
  isTyping,
  filterValue
}) {
  const { hasPermission, downloadableBlocks, isLoading } = useDownloadableBlocks(filterValue);
  if (hasPermission === void 0 || isLoading || isTyping) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      hasPermission && !hasLocalBlocks && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("p", { className: "block-directory-downloadable-blocks-panel__no-local", children: __(
          "No results available from your installed blocks."
        ) }),
        /* @__PURE__ */ jsx("div", { className: "block-editor-inserter__quick-inserter-separator" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "block-directory-downloadable-blocks-panel has-blocks-loading", children: /* @__PURE__ */ jsx(Spinner, {}) })
    ] });
  }
  if (false === hasPermission) {
    if (!hasLocalBlocks) {
      return /* @__PURE__ */ jsx(DownloadableBlocksNoResults, {});
    }
    return null;
  }
  if (downloadableBlocks.length === 0) {
    return hasLocalBlocks ? null : /* @__PURE__ */ jsx(DownloadableBlocksNoResults, {});
  }
  return /* @__PURE__ */ jsx(
    DownloadableBlocksInserterPanel,
    {
      downloadableItems: downloadableBlocks,
      hasLocalBlocks,
      children: /* @__PURE__ */ jsx(
        DownloadableBlocksList,
        {
          items: downloadableBlocks,
          onSelect,
          onHover
        }
      )
    }
  );
}
export {
  DownloadableBlocksPanel as default
};
//# sourceMappingURL=index.mjs.map
