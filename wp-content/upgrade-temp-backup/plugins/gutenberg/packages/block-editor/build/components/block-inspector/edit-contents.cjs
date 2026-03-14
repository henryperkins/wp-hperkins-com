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

// packages/block-editor/src/components/block-inspector/edit-contents.js
var edit_contents_exports = {};
__export(edit_contents_exports, {
  default: () => EditContents
});
module.exports = __toCommonJS(edit_contents_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_blocks = require("@wordpress/blocks");
var import_use_content_only_section_edit = __toESM(require("../../hooks/use-content-only-section-edit.cjs"));
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function IsolatedEditButton({
  block,
  onNavigateToEntityRecord,
  isSyncedPattern,
  isTemplatePartBlock
}) {
  const blockAttributes = block?.attributes || {};
  const handleClick = () => {
    if (isSyncedPattern) {
      onNavigateToEntityRecord({
        postId: blockAttributes.ref,
        postType: "wp_block"
      });
    } else if (isTemplatePartBlock) {
      const { theme, slug } = blockAttributes;
      const templatePartId = theme && slug ? `${theme}//${slug}` : null;
      if (templatePartId) {
        onNavigateToEntityRecord({
          postId: templatePartId,
          postType: "wp_template_part"
        });
      }
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalVStack, { className: "block-editor-block-inspector-edit-contents", expanded: true, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Button,
    {
      className: "block-editor-block-inspector-edit-contents__button",
      __next40pxDefaultSize: true,
      variant: "secondary",
      onClick: handleClick,
      children: (0, import_i18n.__)("Edit original")
    }
  ) });
}
function InlineEditButton({
  clientId,
  editedContentOnlySection,
  editContentOnlySection,
  stopEditingContentOnlySection
}) {
  const handleClick = () => {
    if (!editedContentOnlySection) {
      editContentOnlySection(clientId);
    } else {
      stopEditingContentOnlySection();
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalVStack, { className: "block-editor-block-inspector-edit-contents", expanded: true, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Button,
    {
      className: "block-editor-block-inspector-edit-contents__button",
      __next40pxDefaultSize: true,
      variant: "secondary",
      onClick: handleClick,
      children: editedContentOnlySection ? (0, import_i18n.__)("Exit pattern") : (0, import_i18n.__)("Edit pattern")
    }
  ) });
}
function EditContents({ clientId }) {
  const {
    isWithinSection,
    isWithinEditedSection,
    editedContentOnlySection,
    editContentOnlySection,
    stopEditingContentOnlySection
  } = (0, import_use_content_only_section_edit.default)(clientId);
  const { block, onNavigateToEntityRecord } = (0, import_data.useSelect)(
    (select) => {
      const { getBlock, getSettings } = select(import_store.store);
      return {
        block: getBlock(clientId),
        onNavigateToEntityRecord: getSettings().onNavigateToEntityRecord
      };
    },
    [clientId]
  );
  if (!isWithinSection && !isWithinEditedSection) {
    return null;
  }
  const isSyncedPattern = (0, import_blocks.isReusableBlock)(block);
  const isTemplatePartBlock = (0, import_blocks.isTemplatePart)(block);
  const shouldUseIsolatedEditor = (isSyncedPattern || isTemplatePartBlock) && onNavigateToEntityRecord;
  if (shouldUseIsolatedEditor) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      IsolatedEditButton,
      {
        block,
        onNavigateToEntityRecord,
        isSyncedPattern,
        isTemplatePartBlock
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    InlineEditButton,
    {
      clientId,
      editedContentOnlySection,
      editContentOnlySection,
      stopEditingContentOnlySection
    }
  );
}
//# sourceMappingURL=edit-contents.cjs.map
