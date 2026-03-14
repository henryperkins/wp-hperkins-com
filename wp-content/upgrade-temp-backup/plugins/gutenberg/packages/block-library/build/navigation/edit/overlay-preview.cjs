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

// packages/block-library/src/navigation/edit/overlay-preview.js
var overlay_preview_exports = {};
__export(overlay_preview_exports, {
  default: () => OverlayPreview
});
module.exports = __toCommonJS(overlay_preview_exports);
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_element = require("@wordpress/element");
var import_blocks = require("@wordpress/blocks");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_block_editor = require("@wordpress/block-editor");
var import_create_template_part_id = require("../../template-part/edit/utils/create-template-part-id.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function OverlayPreview({ overlay, currentTheme }) {
  const templatePartId = (0, import_element.useMemo)(() => {
    if (!overlay || !currentTheme) {
      return null;
    }
    return (0, import_create_template_part_id.createTemplatePartId)(currentTheme, overlay);
  }, [currentTheme, overlay]);
  const { content, editedBlocks, hasResolved } = (0, import_data.useSelect)(
    (select) => {
      if (!templatePartId) {
        return {
          content: null,
          editedBlocks: null,
          hasResolved: true
        };
      }
      const { getEditedEntityRecord, hasFinishedResolution } = select(import_core_data.store);
      const editedRecord = getEditedEntityRecord(
        "postType",
        "wp_template_part",
        templatePartId,
        { context: "view" }
      );
      return {
        content: editedRecord?.content,
        editedBlocks: editedRecord?.blocks,
        hasResolved: hasFinishedResolution("getEditedEntityRecord", [
          "postType",
          "wp_template_part",
          templatePartId,
          { context: "view" }
        ])
      };
    },
    [templatePartId]
  );
  const blocks = (0, import_element.useMemo)(() => {
    if (!templatePartId) {
      return null;
    }
    if (editedBlocks && editedBlocks.length > 0) {
      return editedBlocks;
    }
    if (content && typeof content === "string") {
      return (0, import_blocks.parse)(content);
    }
    return [];
  }, [templatePartId, editedBlocks, content]);
  if (!overlay) {
    return null;
  }
  if (!hasResolved) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "wp-block-navigation__overlay-preview-loading", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Spinner, {}) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      className: "wp-block-navigation__overlay-preview",
      "aria-label": (0, import_i18n.__)("Navigation Overlay template part preview"),
      role: "region",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_block_editor.BlockPreview.Async,
        {
          placeholder: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "wp-block-navigation__overlay-preview-placeholder" }),
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_block_editor.BlockPreview,
            {
              blocks,
              viewportWidth: 400,
              minHeight: 200
            }
          )
        }
      )
    }
  );
}
//# sourceMappingURL=overlay-preview.cjs.map
