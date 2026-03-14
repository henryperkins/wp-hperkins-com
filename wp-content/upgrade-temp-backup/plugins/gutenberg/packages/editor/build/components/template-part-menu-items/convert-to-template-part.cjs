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

// packages/editor/src/components/template-part-menu-items/convert-to-template-part.js
var convert_to_template_part_exports = {};
__export(convert_to_template_part_exports, {
  default: () => ConvertToTemplatePart
});
module.exports = __toCommonJS(convert_to_template_part_exports);
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_components = require("@wordpress/components");
var import_blocks = require("@wordpress/blocks");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_notices = require("@wordpress/notices");
var import_icons = require("@wordpress/icons");
var import_core_data = require("@wordpress/core-data");
var import_fields = require("@wordpress/fields");
var import_jsx_runtime = require("react/jsx-runtime");
function ConvertToTemplatePart({ clientIds, blocks }) {
  const [isModalOpen, setIsModalOpen] = (0, import_element.useState)(false);
  const { replaceBlocks } = (0, import_data.useDispatch)(import_block_editor.store);
  const { createSuccessNotice } = (0, import_data.useDispatch)(import_notices.store);
  const { isBlockBasedTheme, canCreate } = (0, import_data.useSelect)((select) => {
    return {
      isBlockBasedTheme: select(import_core_data.store).getCurrentTheme()?.is_block_theme,
      canCreate: select(import_block_editor.store).canInsertBlockType(
        "core/template-part"
      )
    };
  }, []);
  if (!isBlockBasedTheme || !canCreate) {
    return null;
  }
  const onConvert = async (templatePart) => {
    replaceBlocks(
      clientIds,
      (0, import_blocks.createBlock)("core/template-part", {
        slug: templatePart.slug,
        theme: templatePart.theme
      })
    );
    createSuccessNotice((0, import_i18n.__)("Template part created."), {
      type: "snackbar"
    });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.MenuItem,
      {
        icon: import_icons.symbolFilled,
        onClick: () => {
          setIsModalOpen(true);
        },
        "aria-expanded": isModalOpen,
        "aria-haspopup": "dialog",
        children: (0, import_i18n.__)("Create template part")
      }
    ),
    isModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_fields.CreateTemplatePartModal,
      {
        closeModal: () => {
          setIsModalOpen(false);
        },
        blocks,
        onCreate: onConvert
      }
    )
  ] });
}
//# sourceMappingURL=convert-to-template-part.cjs.map
