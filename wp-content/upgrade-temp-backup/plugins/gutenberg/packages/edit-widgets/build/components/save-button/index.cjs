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

// packages/edit-widgets/src/components/save-button/index.js
var save_button_exports = {};
__export(save_button_exports, {
  default: () => save_button_default
});
module.exports = __toCommonJS(save_button_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function SaveButton() {
  const { hasEditedWidgetAreaIds, isSaving, isWidgetSaveLocked } = (0, import_data.useSelect)(
    (select) => {
      const {
        getEditedWidgetAreas,
        isSavingWidgetAreas,
        isWidgetSavingLocked
      } = select(import_store.store);
      return {
        hasEditedWidgetAreaIds: getEditedWidgetAreas()?.length > 0,
        isSaving: isSavingWidgetAreas(),
        isWidgetSaveLocked: isWidgetSavingLocked()
      };
    },
    []
  );
  const { saveEditedWidgetAreas } = (0, import_data.useDispatch)(import_store.store);
  const isDisabled = isWidgetSaveLocked || isSaving || !hasEditedWidgetAreaIds;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Button,
    {
      variant: "primary",
      isBusy: isSaving,
      "aria-disabled": isDisabled,
      onClick: isDisabled ? void 0 : saveEditedWidgetAreas,
      size: "compact",
      children: isSaving ? (0, import_i18n.__)("Saving\u2026") : (0, import_i18n.__)("Update")
    }
  );
}
var save_button_default = SaveButton;
//# sourceMappingURL=index.cjs.map
