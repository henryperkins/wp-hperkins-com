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

// packages/editor/src/components/unsaved-changes-warning/index.js
var unsaved_changes_warning_exports = {};
__export(unsaved_changes_warning_exports, {
  default: () => UnsavedChangesWarning
});
module.exports = __toCommonJS(unsaved_changes_warning_exports);
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
function UnsavedChangesWarning() {
  const { __experimentalGetDirtyEntityRecords } = (0, import_data.useSelect)(import_core_data.store);
  (0, import_element.useEffect)(() => {
    const warnIfUnsavedChanges = (event) => {
      const dirtyEntityRecords = __experimentalGetDirtyEntityRecords();
      if (dirtyEntityRecords.length > 0) {
        event.returnValue = (0, import_i18n.__)(
          "You have unsaved changes. If you proceed, they will be lost."
        );
        return event.returnValue;
      }
    };
    window.addEventListener("beforeunload", warnIfUnsavedChanges);
    return () => {
      window.removeEventListener("beforeunload", warnIfUnsavedChanges);
    };
  }, [__experimentalGetDirtyEntityRecords]);
  return null;
}
//# sourceMappingURL=index.cjs.map
