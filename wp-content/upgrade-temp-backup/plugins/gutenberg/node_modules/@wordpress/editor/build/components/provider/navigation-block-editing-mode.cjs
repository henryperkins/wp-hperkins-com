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

// packages/editor/src/components/provider/navigation-block-editing-mode.js
var navigation_block_editing_mode_exports = {};
__export(navigation_block_editing_mode_exports, {
  default: () => NavigationBlockEditingMode
});
module.exports = __toCommonJS(navigation_block_editing_mode_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
function NavigationBlockEditingMode() {
  const blockClientId = (0, import_data.useSelect)(
    (select) => select(import_block_editor.store).getBlockOrder()?.[0],
    []
  );
  const { setBlockEditingMode, unsetBlockEditingMode } = (0, import_data.useDispatch)(import_block_editor.store);
  (0, import_element.useEffect)(() => {
    if (!blockClientId) {
      return;
    }
    setBlockEditingMode(blockClientId, "contentOnly");
    return () => {
      unsetBlockEditingMode(blockClientId);
    };
  }, [blockClientId, unsetBlockEditingMode, setBlockEditingMode]);
}
//# sourceMappingURL=navigation-block-editing-mode.cjs.map
