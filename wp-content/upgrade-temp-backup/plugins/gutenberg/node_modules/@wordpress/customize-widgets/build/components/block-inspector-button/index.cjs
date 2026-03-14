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

// packages/customize-widgets/src/components/block-inspector-button/index.js
var block_inspector_button_exports = {};
__export(block_inspector_button_exports, {
  default: () => block_inspector_button_default
});
module.exports = __toCommonJS(block_inspector_button_exports);
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_jsx_runtime = require("react/jsx-runtime");
function BlockInspectorButton({ inspector, closeMenu, ...props }) {
  const selectedBlockClientId = (0, import_data.useSelect)(
    (select) => select(import_block_editor.store).getSelectedBlockClientId(),
    []
  );
  const selectedBlock = (0, import_element.useMemo)(
    () => document.getElementById(`block-${selectedBlockClientId}`),
    [selectedBlockClientId]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.MenuItem,
    {
      onClick: () => {
        inspector.open({
          returnFocusWhenClose: selectedBlock
        });
        closeMenu();
      },
      ...props,
      children: (0, import_i18n.__)("Show more settings")
    }
  );
}
var block_inspector_button_default = BlockInspectorButton;
//# sourceMappingURL=index.cjs.map
