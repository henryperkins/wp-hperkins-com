"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/edit-site/src/utils/use-activate-theme.js
var use_activate_theme_exports = {};
__export(use_activate_theme_exports, {
  useActivateTheme: () => useActivateTheme
});
module.exports = __toCommonJS(use_activate_theme_exports);
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_router = require("@wordpress/router");
var import_url = require("@wordpress/url");
var import_lock_unlock = require("../lock-unlock.cjs");
var import_is_previewing_theme = require("./is-previewing-theme.cjs");
var { useHistory, useLocation } = (0, import_lock_unlock.unlock)(import_router.privateApis);
function useActivateTheme() {
  const history = useHistory();
  const { path } = useLocation();
  const { startResolution, finishResolution } = (0, import_data.useDispatch)(import_core_data.store);
  return async () => {
    if ((0, import_is_previewing_theme.isPreviewingTheme)()) {
      const activationURL = "themes.php?action=activate&stylesheet=" + (0, import_is_previewing_theme.currentlyPreviewingTheme)() + "&_wpnonce=" + window.WP_BLOCK_THEME_ACTIVATE_NONCE;
      startResolution("activateTheme");
      await window.fetch(activationURL);
      finishResolution("activateTheme");
      history.navigate((0, import_url.addQueryArgs)(path, { wp_theme_preview: "" }));
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useActivateTheme
});
//# sourceMappingURL=use-activate-theme.cjs.map
