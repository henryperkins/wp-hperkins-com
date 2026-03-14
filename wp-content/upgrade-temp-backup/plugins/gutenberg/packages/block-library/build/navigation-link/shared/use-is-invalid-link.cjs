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

// packages/block-library/src/navigation-link/shared/use-is-invalid-link.js
var use_is_invalid_link_exports = {};
__export(use_is_invalid_link_exports, {
  useIsInvalidLink: () => useIsInvalidLink
});
module.exports = __toCommonJS(use_is_invalid_link_exports);
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_block_editor = require("@wordpress/block-editor");
var useIsInvalidLink = (kind, type, id, enabled) => {
  const isPostType = kind === "post-type" || type === "post" || type === "page";
  const hasId = Number.isInteger(id);
  const blockEditingMode = (0, import_block_editor.useBlockEditingMode)();
  const { postStatus, isDeleted } = (0, import_data.useSelect)(
    (select) => {
      if (!isPostType) {
        return { postStatus: null, isDeleted: false };
      }
      if (blockEditingMode === "disabled" || !enabled) {
        return { postStatus: null, isDeleted: false };
      }
      const { getEntityRecord, hasFinishedResolution } = select(import_core_data.store);
      const entityRecord = getEntityRecord("postType", type, id);
      const hasResolved = hasFinishedResolution("getEntityRecord", [
        "postType",
        type,
        id
      ]);
      const deleted = hasResolved && entityRecord === void 0;
      return {
        postStatus: entityRecord?.status,
        isDeleted: deleted
      };
    },
    [isPostType, blockEditingMode, enabled, type, id]
  );
  const isInvalid = isPostType && hasId && (isDeleted || postStatus && "trash" === postStatus);
  const isDraft = "draft" === postStatus;
  return [isInvalid, isDraft];
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useIsInvalidLink
});
//# sourceMappingURL=use-is-invalid-link.cjs.map
