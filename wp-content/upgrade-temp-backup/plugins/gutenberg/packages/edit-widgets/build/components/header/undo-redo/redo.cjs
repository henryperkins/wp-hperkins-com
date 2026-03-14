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

// packages/edit-widgets/src/components/header/undo-redo/redo.js
var redo_exports = {};
__export(redo_exports, {
  default: () => redo_default
});
module.exports = __toCommonJS(redo_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_icons = require("@wordpress/icons");
var import_keycodes = require("@wordpress/keycodes");
var import_core_data = require("@wordpress/core-data");
var import_element = require("@wordpress/element");
var import_jsx_runtime = require("react/jsx-runtime");
function RedoButton(props, ref) {
  const shortcut = (0, import_keycodes.isAppleOS)() ? import_keycodes.displayShortcut.primaryShift("z") : import_keycodes.displayShortcut.primary("y");
  const hasRedo = (0, import_data.useSelect)(
    (select) => select(import_core_data.store).hasRedo(),
    []
  );
  const { redo } = (0, import_data.useDispatch)(import_core_data.store);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Button,
    {
      ...props,
      ref,
      icon: !(0, import_i18n.isRTL)() ? import_icons.redo : import_icons.undo,
      label: (0, import_i18n.__)("Redo"),
      shortcut,
      "aria-disabled": !hasRedo,
      onClick: hasRedo ? redo : void 0,
      size: "compact"
    }
  );
}
var redo_default = (0, import_element.forwardRef)(RedoButton);
//# sourceMappingURL=redo.cjs.map
