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

// packages/block-editor/src/components/writing-flow/use-select-all.js
var use_select_all_exports = {};
__export(use_select_all_exports, {
  default: () => useSelectAll
});
module.exports = __toCommonJS(use_select_all_exports);
var import_dom = require("@wordpress/dom");
var import_data = require("@wordpress/data");
var import_keyboard_shortcuts = require("@wordpress/keyboard-shortcuts");
var import_compose = require("@wordpress/compose");
var import_store = require("../../store/index.cjs");
var import_dom2 = require("../../utils/dom.cjs");
function useSelectAll() {
  const { getBlockOrder, getSelectedBlockClientIds, getBlockRootClientId } = (0, import_data.useSelect)(import_store.store);
  const { multiSelect, selectBlock } = (0, import_data.useDispatch)(import_store.store);
  const isMatch = (0, import_keyboard_shortcuts.__unstableUseShortcutEventMatch)();
  return (0, import_compose.useRefEffect)((node) => {
    function onKeyDown(event) {
      if (!isMatch("core/block-editor/select-all", event)) {
        return;
      }
      const selectedClientIds = getSelectedBlockClientIds();
      if (selectedClientIds.length < 2 && !(0, import_dom.isEntirelySelected)(event.target)) {
        return;
      }
      event.preventDefault();
      const { ownerDocument } = event.target;
      const [firstSelectedClientId] = selectedClientIds;
      const activeClientId = (0, import_dom2.getBlockClientId)(
        ownerDocument.activeElement
      );
      if (activeClientId && activeClientId !== firstSelectedClientId && !(0, import_dom2.isInsideRootBlock)(
        ownerDocument.getElementById(
          "block-" + firstSelectedClientId
        ),
        ownerDocument.activeElement
      )) {
        selectBlock(activeClientId);
        return;
      }
      const rootClientId = getBlockRootClientId(firstSelectedClientId);
      const blockClientIds = getBlockOrder(rootClientId);
      if (selectedClientIds.length === blockClientIds.length) {
        if (rootClientId) {
          node.ownerDocument.defaultView.getSelection().removeAllRanges();
          selectBlock(rootClientId);
        }
        return;
      }
      multiSelect(
        blockClientIds[0],
        blockClientIds[blockClientIds.length - 1]
      );
    }
    node.addEventListener("keydown", onKeyDown);
    return () => {
      node.removeEventListener("keydown", onKeyDown);
    };
  }, []);
}
//# sourceMappingURL=use-select-all.cjs.map
