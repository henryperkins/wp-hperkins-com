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

// packages/fields/src/actions/duplicate-template-part.tsx
var duplicate_template_part_exports = {};
__export(duplicate_template_part_exports, {
  default: () => duplicate_template_part_default
});
module.exports = __toCommonJS(duplicate_template_part_exports);
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_notices = require("@wordpress/notices");
var import_element = require("@wordpress/element");
var import_blocks = require("@wordpress/blocks");
var import_create_template_part_modal = require("../components/create-template-part-modal/index.cjs");
var import_utils = require("./utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var duplicateTemplatePart = {
  id: "duplicate-template-part",
  label: (0, import_i18n._x)("Duplicate", "action label"),
  isEligible: (item) => item.type === "wp_template_part",
  modalHeader: (0, import_i18n._x)("Duplicate template part", "action label"),
  modalFocusOnMount: "firstContentElement",
  RenderModal: ({ items, closeModal }) => {
    const [item] = items;
    const blocks = (0, import_element.useMemo)(() => {
      return item.blocks ?? (0, import_blocks.parse)(
        typeof item.content === "string" ? item.content : item.content.raw,
        {
          __unstableSkipMigrationLogs: true
        }
      );
    }, [item.content, item.blocks]);
    const { createSuccessNotice } = (0, import_data.useDispatch)(import_notices.store);
    function onTemplatePartSuccess(templatePart) {
      createSuccessNotice(
        (0, import_i18n.sprintf)(
          // translators: %s: The new template part's title e.g. 'Call to action (copy)'.
          (0, import_i18n._x)('"%s" duplicated.', "template part"),
          (0, import_utils.getItemTitle)(templatePart)
        ),
        { type: "snackbar", id: "edit-site-patterns-success" }
      );
      closeModal?.();
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_create_template_part_modal.CreateTemplatePartModalContents,
      {
        blocks,
        defaultArea: item.area,
        defaultTitle: (0, import_i18n.sprintf)(
          /* translators: %s: Existing template part title */
          (0, import_i18n._x)("%s (Copy)", "template part"),
          (0, import_utils.getItemTitle)(item)
        ),
        onCreate: onTemplatePartSuccess,
        onError: closeModal,
        confirmLabel: (0, import_i18n._x)("Duplicate", "action label"),
        closeModal: closeModal ?? (() => {
        })
      }
    );
  }
};
var duplicate_template_part_default = duplicateTemplatePart;
//# sourceMappingURL=duplicate-template-part.cjs.map
