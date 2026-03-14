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

// packages/edit-post/src/components/preferences-modal/enable-panel.js
var enable_panel_exports = {};
__export(enable_panel_exports, {
  default: () => EnablePanelOption
});
module.exports = __toCommonJS(enable_panel_exports);
var import_data = require("@wordpress/data");
var import_editor = require("@wordpress/editor");
var import_preferences = require("@wordpress/preferences");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { PreferenceBaseOption } = (0, import_lock_unlock.unlock)(import_preferences.privateApis);
function EnablePanelOption(props) {
  const { toggleEditorPanelEnabled } = (0, import_data.useDispatch)(import_editor.store);
  const { isChecked, isRemoved } = (0, import_data.useSelect)(
    (select) => {
      const { isEditorPanelEnabled, isEditorPanelRemoved } = select(import_editor.store);
      return {
        isChecked: isEditorPanelEnabled(props.panelName),
        isRemoved: isEditorPanelRemoved(props.panelName)
      };
    },
    [props.panelName]
  );
  if (isRemoved) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    PreferenceBaseOption,
    {
      isChecked,
      onChange: () => toggleEditorPanelEnabled(props.panelName),
      ...props
    }
  );
}
//# sourceMappingURL=enable-panel.cjs.map
