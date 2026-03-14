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

// packages/block-directory/src/components/auto-block-uninstaller/index.js
var auto_block_uninstaller_exports = {};
__export(auto_block_uninstaller_exports, {
  default: () => AutoBlockUninstaller
});
module.exports = __toCommonJS(auto_block_uninstaller_exports);
var import_blocks = require("@wordpress/blocks");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_editor = require("@wordpress/editor");
var import_store = require("../../store/index.cjs");
function AutoBlockUninstaller() {
  const { uninstallBlockType } = (0, import_data.useDispatch)(import_store.store);
  const shouldRemoveBlockTypes = (0, import_data.useSelect)((select) => {
    const { isAutosavingPost, isSavingPost } = select(import_editor.store);
    return isSavingPost() && !isAutosavingPost();
  }, []);
  const unusedBlockTypes = (0, import_data.useSelect)(
    (select) => select(import_store.store).getUnusedBlockTypes(),
    []
  );
  (0, import_element.useEffect)(() => {
    if (shouldRemoveBlockTypes && unusedBlockTypes.length) {
      unusedBlockTypes.forEach((blockType) => {
        uninstallBlockType(blockType);
        (0, import_blocks.unregisterBlockType)(blockType.name);
      });
    }
  }, [shouldRemoveBlockTypes]);
  return null;
}
//# sourceMappingURL=index.cjs.map
