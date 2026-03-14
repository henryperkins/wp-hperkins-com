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

// packages/editor/src/components/template-part-menu-items/convert-to-regular.js
var convert_to_regular_exports = {};
__export(convert_to_regular_exports, {
  default: () => ConvertToRegularBlocks
});
module.exports = __toCommonJS(convert_to_regular_exports);
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_jsx_runtime = require("react/jsx-runtime");
function ConvertToRegularBlocks({ clientId, onClose }) {
  const { getBlocks } = (0, import_data.useSelect)(import_block_editor.store);
  const { replaceBlocks } = (0, import_data.useDispatch)(import_block_editor.store);
  const canRemove = (0, import_data.useSelect)(
    (select) => select(import_block_editor.store).canRemoveBlock(clientId),
    [clientId]
  );
  if (!canRemove) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.MenuItem,
    {
      onClick: () => {
        replaceBlocks(clientId, getBlocks(clientId));
        onClose();
      },
      children: (0, import_i18n.__)("Detach")
    }
  );
}
//# sourceMappingURL=convert-to-regular.cjs.map
