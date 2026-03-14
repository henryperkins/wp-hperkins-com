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

// packages/edit-widgets/src/components/header/undo-redo/undo.js
var undo_exports = {};
__export(undo_exports, {
  default: () => undo_default
});
module.exports = __toCommonJS(undo_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_icons = require("@wordpress/icons");
var import_keycodes = require("@wordpress/keycodes");
var import_core_data = require("@wordpress/core-data");
var import_element = require("@wordpress/element");
var import_jsx_runtime = require("react/jsx-runtime");
function UndoButton(props, ref) {
  const hasUndo = (0, import_data.useSelect)(
    (select) => select(import_core_data.store).hasUndo(),
    []
  );
  const { undo } = (0, import_data.useDispatch)(import_core_data.store);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Button,
    {
      ...props,
      ref,
      icon: !(0, import_i18n.isRTL)() ? import_icons.undo : import_icons.redo,
      label: (0, import_i18n.__)("Undo"),
      shortcut: import_keycodes.displayShortcut.primary("z"),
      "aria-disabled": !hasUndo,
      onClick: hasUndo ? undo : void 0,
      size: "compact"
    }
  );
}
var undo_default = (0, import_element.forwardRef)(UndoButton);
//# sourceMappingURL=undo.cjs.map
