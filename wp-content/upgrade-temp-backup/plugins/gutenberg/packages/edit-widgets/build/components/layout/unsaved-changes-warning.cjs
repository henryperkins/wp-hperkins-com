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

// packages/edit-widgets/src/components/layout/unsaved-changes-warning.js
var unsaved_changes_warning_exports = {};
__export(unsaved_changes_warning_exports, {
  default: () => UnsavedChangesWarning
});
module.exports = __toCommonJS(unsaved_changes_warning_exports);
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_store = require("../../store/index.cjs");
function UnsavedChangesWarning() {
  const isDirty = (0, import_data.useSelect)((select) => {
    const { getEditedWidgetAreas } = select(import_store.store);
    const editedWidgetAreas = getEditedWidgetAreas();
    return editedWidgetAreas?.length > 0;
  }, []);
  (0, import_element.useEffect)(() => {
    const warnIfUnsavedChanges = (event) => {
      if (isDirty) {
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
  }, [isDirty]);
  return null;
}
//# sourceMappingURL=unsaved-changes-warning.cjs.map
