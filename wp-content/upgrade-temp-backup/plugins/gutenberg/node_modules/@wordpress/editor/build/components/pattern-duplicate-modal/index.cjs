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

// packages/editor/src/components/pattern-duplicate-modal/index.js
var pattern_duplicate_modal_exports = {};
__export(pattern_duplicate_modal_exports, {
  default: () => PatternDuplicateModal,
  modalName: () => modalName
});
module.exports = __toCommonJS(pattern_duplicate_modal_exports);
var import_data = require("@wordpress/data");
var import_patterns = require("@wordpress/patterns");
var import_core_data = require("@wordpress/core-data");
var import_interface = require("@wordpress/interface");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_store = require("../../store/index.cjs");
var import_constants = require("../../store/constants.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { DuplicatePatternModal } = (0, import_lock_unlock.unlock)(import_patterns.privateApis);
var modalName = "editor/pattern-duplicate";
function PatternDuplicateModal() {
  const isActive = (0, import_data.useSelect)(
    (select) => select(import_interface.store).isModalActive(modalName)
  );
  const { record, postType } = (0, import_data.useSelect)(
    (select) => {
      if (!isActive) {
        return {};
      }
      const { getCurrentPostType, getCurrentPostId } = select(import_store.store);
      const { getEditedEntityRecord } = select(import_core_data.store);
      const _postType = getCurrentPostType();
      return {
        record: getEditedEntityRecord(
          "postType",
          _postType,
          getCurrentPostId()
        ),
        postType: _postType
      };
    },
    [isActive]
  );
  const { closeModal } = (0, import_data.useDispatch)(import_interface.store);
  if (!isActive || postType !== import_constants.PATTERN_POST_TYPE) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    DuplicatePatternModal,
    {
      onClose: closeModal,
      onSuccess: () => closeModal(),
      pattern: record
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  modalName
});
//# sourceMappingURL=index.cjs.map
