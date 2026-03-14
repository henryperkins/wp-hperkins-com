"use strict";
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

// packages/global-styles-ui/src/screen-background.tsx
var screen_background_exports = {};
__export(screen_background_exports, {
  default: () => screen_background_default
});
module.exports = __toCommonJS(screen_background_exports);
var import_i18n = require("@wordpress/i18n");
var import_block_editor = require("@wordpress/block-editor");
var import_components = require("@wordpress/components");
var import_background_panel = __toESM(require("./background-panel.cjs"));
var import_screen_header = require("./screen-header.cjs");
var import_hooks = require("./hooks.cjs");
var import_lock_unlock = require("./lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useHasBackgroundPanel } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
function ScreenBackground() {
  const [settings] = (0, import_hooks.useSetting)("");
  const hasBackgroundPanel = useHasBackgroundPanel(settings);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_screen_header.ScreenHeader,
      {
        title: (0, import_i18n.__)("Background"),
        description: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { children: (0, import_i18n.__)("Set styles for the site's background.") })
      }
    ),
    hasBackgroundPanel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_background_panel.default, {})
  ] });
}
var screen_background_default = ScreenBackground;
//# sourceMappingURL=screen-background.cjs.map
