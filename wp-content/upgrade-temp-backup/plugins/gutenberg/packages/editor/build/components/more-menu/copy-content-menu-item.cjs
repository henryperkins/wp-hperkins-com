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

// packages/editor/src/components/more-menu/copy-content-menu-item.js
var copy_content_menu_item_exports = {};
__export(copy_content_menu_item_exports, {
  default: () => CopyContentMenuItem
});
module.exports = __toCommonJS(copy_content_menu_item_exports);
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_compose = require("@wordpress/compose");
var import_notices = require("@wordpress/notices");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function CopyContentMenuItem() {
  const { createNotice } = (0, import_data.useDispatch)(import_notices.store);
  const { getEditedPostContent } = (0, import_data.useSelect)(import_store.store);
  function getText() {
    return getEditedPostContent();
  }
  function onSuccess() {
    createNotice("info", (0, import_i18n.__)("All content copied."), {
      isDismissible: true,
      type: "snackbar"
    });
  }
  const ref = (0, import_compose.useCopyToClipboard)(getText, onSuccess);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.MenuItem, { ref, children: (0, import_i18n.__)("Copy all blocks") });
}
//# sourceMappingURL=copy-content-menu-item.cjs.map
