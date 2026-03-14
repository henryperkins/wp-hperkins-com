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

// packages/block-library/src/navigation-link/shared/index.js
var shared_exports = {};
__export(shared_exports, {
  Controls: () => import_controls.Controls,
  InvalidDraftDisplay: () => import_invalid_draft_display.InvalidDraftDisplay,
  LinkUI: () => import_link_ui.LinkUI,
  buildNavigationLinkEntityBinding: () => import_use_entity_binding.buildNavigationLinkEntityBinding,
  getInvalidLinkHelpText: () => import_controls.getInvalidLinkHelpText,
  selectLabelText: () => import_select_label_text.selectLabelText,
  updateAttributes: () => import_update_attributes.updateAttributes,
  useEnableLinkStatusValidation: () => import_use_enable_link_status_validation.useEnableLinkStatusValidation,
  useEntityBinding: () => import_use_entity_binding.useEntityBinding,
  useHandleLinkChange: () => import_use_handle_link_change.useHandleLinkChange,
  useIsDraggingWithin: () => import_use_is_dragging_within.useIsDraggingWithin,
  useIsInvalidLink: () => import_use_is_invalid_link.useIsInvalidLink,
  useLinkPreview: () => import_use_link_preview.useLinkPreview
});
module.exports = __toCommonJS(shared_exports);
var import_controls = require("./controls.cjs");
var import_update_attributes = require("./update-attributes.cjs");
var import_use_entity_binding = require("./use-entity-binding.cjs");
var import_link_ui = require("../link-ui/index.cjs");
var import_use_handle_link_change = require("./use-handle-link-change.cjs");
var import_use_is_invalid_link = require("./use-is-invalid-link.cjs");
var import_invalid_draft_display = require("./invalid-draft-display.cjs");
var import_use_enable_link_status_validation = require("./use-enable-link-status-validation.cjs");
var import_use_is_dragging_within = require("./use-is-dragging-within.cjs");
var import_select_label_text = require("./select-label-text.cjs");
var import_use_link_preview = require("./use-link-preview.cjs");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Controls,
  InvalidDraftDisplay,
  LinkUI,
  buildNavigationLinkEntityBinding,
  getInvalidLinkHelpText,
  selectLabelText,
  updateAttributes,
  useEnableLinkStatusValidation,
  useEntityBinding,
  useHandleLinkChange,
  useIsDraggingWithin,
  useIsInvalidLink,
  useLinkPreview
});
//# sourceMappingURL=index.cjs.map
