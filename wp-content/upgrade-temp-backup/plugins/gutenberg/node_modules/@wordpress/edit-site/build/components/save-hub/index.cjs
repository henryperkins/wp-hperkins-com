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

// packages/edit-site/src/components/save-hub/index.js
var save_hub_exports = {};
__export(save_hub_exports, {
  default: () => SaveHub
});
module.exports = __toCommonJS(save_hub_exports);
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_core_data = require("@wordpress/core-data");
var import_icons = require("@wordpress/icons");
var import_save_button = __toESM(require("../save-button/index.cjs"));
var import_is_previewing_theme = require("../../utils/is-previewing-theme.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function SaveHub() {
  const { isDisabled, isSaving } = (0, import_data.useSelect)((select) => {
    const { __experimentalGetDirtyEntityRecords, isSavingEntityRecord } = select(import_core_data.store);
    const dirtyEntityRecords = __experimentalGetDirtyEntityRecords();
    const _isSaving = dirtyEntityRecords.some(
      (record) => isSavingEntityRecord(record.kind, record.name, record.key)
    );
    return {
      isSaving: _isSaving,
      isDisabled: _isSaving || !dirtyEntityRecords.length && !(0, import_is_previewing_theme.isPreviewingTheme)()
    };
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalHStack, { className: "edit-site-save-hub", alignment: "right", spacing: 4, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_save_button.default,
    {
      className: "edit-site-save-hub__button",
      variant: isDisabled ? null : "primary",
      showTooltip: false,
      icon: isDisabled && !isSaving ? import_icons.check : null,
      showReviewMessage: true,
      __next40pxDefaultSize: true
    }
  ) });
}
//# sourceMappingURL=index.cjs.map
