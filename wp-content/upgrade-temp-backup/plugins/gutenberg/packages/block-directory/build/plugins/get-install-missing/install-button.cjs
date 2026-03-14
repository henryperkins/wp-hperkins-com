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

// packages/block-directory/src/plugins/get-install-missing/install-button.js
var install_button_exports = {};
__export(install_button_exports, {
  default: () => InstallButton
});
module.exports = __toCommonJS(install_button_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_blocks = require("@wordpress/blocks");
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function InstallButton({ attributes, block, clientId }) {
  const isInstallingBlock = (0, import_data.useSelect)(
    (select) => select(import_store.store).isInstalling(block.id),
    [block.id]
  );
  const { installBlockType } = (0, import_data.useDispatch)(import_store.store);
  const { replaceBlock } = (0, import_data.useDispatch)(import_block_editor.store);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Button,
    {
      __next40pxDefaultSize: true,
      onClick: () => installBlockType(block).then((success) => {
        if (success) {
          const blockType = (0, import_blocks.getBlockType)(block.name);
          const [originalBlock] = (0, import_blocks.parse)(
            attributes.originalContent
          );
          if (originalBlock && blockType) {
            replaceBlock(
              clientId,
              (0, import_blocks.createBlock)(
                blockType.name,
                originalBlock.attributes,
                originalBlock.innerBlocks
              )
            );
          }
        }
      }),
      accessibleWhenDisabled: true,
      disabled: isInstallingBlock,
      isBusy: isInstallingBlock,
      variant: "primary",
      children: (0, import_i18n.sprintf)(
        /* translators: %s: block name */
        (0, import_i18n.__)("Install %s"),
        block.title
      )
    }
  );
}
//# sourceMappingURL=install-button.cjs.map
