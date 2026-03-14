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

// packages/block-library/src/navigation-link/shared/use-enable-link-status-validation.js
var use_enable_link_status_validation_exports = {};
__export(use_enable_link_status_validation_exports, {
  useEnableLinkStatusValidation: () => useEnableLinkStatusValidation
});
module.exports = __toCommonJS(use_enable_link_status_validation_exports);
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
function useEnableLinkStatusValidation(clientId) {
  return (0, import_data.useSelect)(
    (select) => {
      const {
        getSelectedBlockClientId,
        hasSelectedInnerBlock,
        getBlockParentsByBlockName
      } = select(import_block_editor.store);
      const selectedBlockId = getSelectedBlockClientId();
      const rootNavigationId = getBlockParentsByBlockName(
        clientId,
        "core/navigation"
      )[0];
      return selectedBlockId === rootNavigationId || hasSelectedInnerBlock(rootNavigationId, true);
    },
    [clientId]
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useEnableLinkStatusValidation
});
//# sourceMappingURL=use-enable-link-status-validation.cjs.map
