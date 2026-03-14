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

// packages/block-directory/src/plugins/installed-blocks-pre-publish-panel/index.js
var installed_blocks_pre_publish_panel_exports = {};
__export(installed_blocks_pre_publish_panel_exports, {
  default: () => InstalledBlocksPrePublishPanel
});
module.exports = __toCommonJS(installed_blocks_pre_publish_panel_exports);
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_editor = require("@wordpress/editor");
var import_compact_list = __toESM(require("../../components/compact-list/index.cjs"));
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function InstalledBlocksPrePublishPanel() {
  const newBlockTypes = (0, import_data.useSelect)(
    (select) => select(import_store.store).getNewBlockTypes(),
    []
  );
  if (!newBlockTypes.length) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_editor.PluginPrePublishPanel,
    {
      title: (0, import_i18n.sprintf)(
        // translators: %d: number of blocks (number).
        (0, import_i18n._n)(
          "Added: %d block",
          "Added: %d blocks",
          newBlockTypes.length
        ),
        newBlockTypes.length
      ),
      initialOpen: true,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "installed-blocks-pre-publish-panel__copy", children: (0, import_i18n._n)(
          "The following block has been added to your site.",
          "The following blocks have been added to your site.",
          newBlockTypes.length
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_compact_list.default, { items: newBlockTypes })
      ]
    }
  );
}
//# sourceMappingURL=index.cjs.map
