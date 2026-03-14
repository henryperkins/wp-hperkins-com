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

// packages/block-editor/src/components/block-lock/use-block-lock.js
var use_block_lock_exports = {};
__export(use_block_lock_exports, {
  default: () => useBlockLock
});
module.exports = __toCommonJS(use_block_lock_exports);
var import_data = require("@wordpress/data");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
function useBlockLock(clientId) {
  return (0, import_data.useSelect)(
    (select) => {
      const {
        canLockBlockType,
        getBlockName,
        isEditLockedBlock,
        isMoveLockedBlock,
        isRemoveLockedBlock,
        isLockedBlock
      } = (0, import_lock_unlock.unlock)(select(import_store.store));
      return {
        isEditLocked: isEditLockedBlock(clientId),
        isMoveLocked: isMoveLockedBlock(clientId),
        isRemoveLocked: isRemoveLockedBlock(clientId),
        canLock: canLockBlockType(getBlockName(clientId)),
        isLocked: isLockedBlock(clientId)
      };
    },
    [clientId]
  );
}
//# sourceMappingURL=use-block-lock.cjs.map
