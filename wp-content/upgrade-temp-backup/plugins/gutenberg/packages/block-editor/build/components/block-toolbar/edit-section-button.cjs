"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-editor/src/components/block-toolbar/edit-section-button.js
var edit_section_button_exports = {};
__export(edit_section_button_exports, {
  default: () => EditSectionButton
});
module.exports = __toCommonJS(edit_section_button_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_blocks = require("@wordpress/blocks");
var import_store = require("../../store/index.cjs");
var import_use_content_only_section_edit = __toESM(require("../../hooks/use-content-only-section-edit.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function EditSectionButton({ clientId }) {
  const {
    isSectionBlock,
    isEditingContentOnlySection,
    editContentOnlySection,
    stopEditingContentOnlySection
  } = (0, import_use_content_only_section_edit.default)(clientId);
  const blockType = (0, import_data.useSelect)(
    (select) => {
      if (!clientId) {
        return null;
      }
      const { getBlockName } = select(import_store.store);
      const blockName = getBlockName(clientId);
      return blockName ? { name: blockName } : null;
    },
    [clientId]
  );
  if (!clientId || !isSectionBlock && !isEditingContentOnlySection || (0, import_blocks.isReusableBlock)(blockType) || (0, import_blocks.isTemplatePart)(blockType)) {
    return null;
  }
  const isEditing = isEditingContentOnlySection;
  const handleClick = () => {
    if (isEditing) {
      stopEditingContentOnlySection();
    } else {
      editContentOnlySection(clientId);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.ToolbarGroup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.ToolbarButton, { onClick: handleClick, children: isEditing ? (0, import_i18n.__)("Exit pattern") : (0, import_i18n.__)("Edit pattern") }) });
}
//# sourceMappingURL=edit-section-button.cjs.map
