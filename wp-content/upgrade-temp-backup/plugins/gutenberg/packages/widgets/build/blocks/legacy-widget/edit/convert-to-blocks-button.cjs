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

// packages/widgets/src/blocks/legacy-widget/edit/convert-to-blocks-button.js
var convert_to_blocks_button_exports = {};
__export(convert_to_blocks_button_exports, {
  default: () => ConvertToBlocksButton
});
module.exports = __toCommonJS(convert_to_blocks_button_exports);
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_components = require("@wordpress/components");
var import_blocks = require("@wordpress/blocks");
var import_i18n = require("@wordpress/i18n");
var import_jsx_runtime = require("react/jsx-runtime");
function ConvertToBlocksButton({ clientId, rawInstance }) {
  const { replaceBlocks } = (0, import_data.useDispatch)(import_block_editor.store);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.ToolbarButton,
    {
      onClick: () => {
        if (rawInstance.title) {
          replaceBlocks(clientId, [
            (0, import_blocks.createBlock)("core/heading", {
              content: rawInstance.title
            }),
            ...(0, import_blocks.rawHandler)({ HTML: rawInstance.text })
          ]);
        } else {
          replaceBlocks(
            clientId,
            (0, import_blocks.rawHandler)({ HTML: rawInstance.text })
          );
        }
      },
      children: (0, import_i18n.__)("Convert to blocks")
    }
  );
}
//# sourceMappingURL=convert-to-blocks-button.cjs.map
