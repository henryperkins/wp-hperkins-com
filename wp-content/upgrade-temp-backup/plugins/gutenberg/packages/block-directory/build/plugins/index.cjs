var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// packages/block-directory/src/plugins/index.js
var import_plugins = require("@wordpress/plugins");
var import_hooks = require("@wordpress/hooks");
var import_auto_block_uninstaller = __toESM(require("../components/auto-block-uninstaller/index.cjs"));
var import_inserter_menu_downloadable_blocks_panel = __toESM(require("./inserter-menu-downloadable-blocks-panel/index.cjs"));
var import_installed_blocks_pre_publish_panel = __toESM(require("./installed-blocks-pre-publish-panel/index.cjs"));
var import_get_install_missing = __toESM(require("./get-install-missing/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
(0, import_plugins.registerPlugin)("block-directory", {
  // The icon is explicitly set to undefined to prevent PluginPrePublishPanel
  // from rendering the fallback icon pluginIcon.
  icon: void 0,
  render() {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_auto_block_uninstaller.default, {}),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_inserter_menu_downloadable_blocks_panel.default, {}),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_installed_blocks_pre_publish_panel.default, {})
    ] });
  }
});
(0, import_hooks.addFilter)(
  "blocks.registerBlockType",
  "block-directory/fallback",
  (settings, name) => {
    if (name !== "core/missing") {
      return settings;
    }
    settings.edit = (0, import_get_install_missing.default)(settings.edit);
    return settings;
  }
);
//# sourceMappingURL=index.cjs.map
