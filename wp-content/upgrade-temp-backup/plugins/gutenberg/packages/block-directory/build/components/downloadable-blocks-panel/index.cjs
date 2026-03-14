var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-directory/src/components/downloadable-blocks-panel/index.js
var downloadable_blocks_panel_exports = {};
__export(downloadable_blocks_panel_exports, {
  default: () => DownloadableBlocksPanel
});
module.exports = __toCommonJS(downloadable_blocks_panel_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_blocks = require("@wordpress/blocks");
var import_downloadable_blocks_list = __toESM(require("../downloadable-blocks-list/index.cjs"));
var import_inserter_panel = __toESM(require("./inserter-panel.cjs"));
var import_no_results = __toESM(require("./no-results.cjs"));
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var EMPTY_ARRAY = [];
var useDownloadableBlocks = (filterValue) => (0, import_data.useSelect)(
  (select) => {
    const {
      getDownloadableBlocks,
      isRequestingDownloadableBlocks,
      getInstalledBlockTypes
    } = select(import_store.store);
    const hasPermission = select(import_core_data.store).canUser(
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
          const isPreviouslyInstalled = (0, import_blocks.getBlockType)(name);
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
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      hasPermission && !hasLocalBlocks && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "block-directory-downloadable-blocks-panel__no-local", children: (0, import_i18n.__)(
          "No results available from your installed blocks."
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "block-editor-inserter__quick-inserter-separator" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "block-directory-downloadable-blocks-panel has-blocks-loading", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Spinner, {}) })
    ] });
  }
  if (false === hasPermission) {
    if (!hasLocalBlocks) {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_no_results.default, {});
    }
    return null;
  }
  if (downloadableBlocks.length === 0) {
    return hasLocalBlocks ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_no_results.default, {});
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_inserter_panel.default,
    {
      downloadableItems: downloadableBlocks,
      hasLocalBlocks,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_downloadable_blocks_list.default,
        {
          items: downloadableBlocks,
          onSelect,
          onHover
        }
      )
    }
  );
}
//# sourceMappingURL=index.cjs.map
