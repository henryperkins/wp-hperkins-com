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

// packages/fields/src/actions/duplicate-pattern.tsx
var duplicate_pattern_exports = {};
__export(duplicate_pattern_exports, {
  default: () => duplicate_pattern_default
});
module.exports = __toCommonJS(duplicate_pattern_exports);
var import_i18n = require("@wordpress/i18n");
var import_patterns = require("@wordpress/patterns");
var import_lock_unlock = require("../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { CreatePatternModalContents, useDuplicatePatternProps } = (0, import_lock_unlock.unlock)(import_patterns.privateApis);
var duplicatePattern = {
  id: "duplicate-pattern",
  label: (0, import_i18n._x)("Duplicate", "action label"),
  isEligible: (item) => item.type !== "wp_template_part",
  modalHeader: (0, import_i18n._x)("Duplicate pattern", "action label"),
  modalFocusOnMount: "firstContentElement",
  RenderModal: ({ items, closeModal }) => {
    const [item] = items;
    const duplicatedProps = useDuplicatePatternProps({
      pattern: item,
      onSuccess: () => closeModal?.()
    });
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      CreatePatternModalContents,
      {
        onClose: closeModal,
        confirmLabel: (0, import_i18n._x)("Duplicate", "action label"),
        ...duplicatedProps
      }
    );
  }
};
var duplicate_pattern_default = duplicatePattern;
//# sourceMappingURL=duplicate-pattern.cjs.map
