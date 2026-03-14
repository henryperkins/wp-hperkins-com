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

// packages/fields/src/actions/reorder-page.tsx
var reorder_page_exports = {};
__export(reorder_page_exports, {
  default: () => reorder_page_default
});
module.exports = __toCommonJS(reorder_page_exports);
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_i18n = require("@wordpress/i18n");
var import_notices = require("@wordpress/notices");
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_jsx_runtime = require("react/jsx-runtime");
function isItemValid(item) {
  return typeof item.menu_order === "number" && Number.isInteger(item.menu_order);
}
function ReorderModal({
  items,
  closeModal,
  onActionPerformed
}) {
  const [item, setItem] = (0, import_element.useState)(items[0]);
  const { editEntityRecord, saveEditedEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
  const { createSuccessNotice, createErrorNotice } = (0, import_data.useDispatch)(import_notices.store);
  const isValid = isItemValid(item);
  async function onOrder(event) {
    event.preventDefault();
    if (!isValid) {
      return;
    }
    try {
      await editEntityRecord("postType", item.type, item.id, {
        menu_order: item.menu_order
      });
      closeModal?.();
      await saveEditedEntityRecord("postType", item.type, item.id, {
        throwOnError: true
      });
      createSuccessNotice((0, import_i18n.__)("Order updated."), {
        type: "snackbar"
      });
      onActionPerformed?.(items);
    } catch (error) {
      const typedError = error;
      const errorMessage = typedError.message && typedError.code !== "unknown_error" ? typedError.message : (0, import_i18n.__)("An error occurred while updating the order");
      createErrorNotice(errorMessage, {
        type: "snackbar"
      });
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", { onSubmit: onOrder, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: "5", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: (0, import_i18n.__)(
      "Determines the order of pages. Pages with the same order value are sorted alphabetically. Negative order values are supported."
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.__experimentalInputControl,
      {
        __next40pxDefaultSize: true,
        label: (0, import_i18n.__)("Order"),
        type: "number",
        value: typeof item.menu_order === "number" && Number.isInteger(item.menu_order) ? String(item.menu_order) : "",
        onChange: (value) => {
          const parsed = parseInt(value, 10);
          setItem({
            ...item,
            menu_order: isNaN(parsed) ? void 0 : parsed
          });
        }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "right", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.Button,
        {
          __next40pxDefaultSize: true,
          variant: "tertiary",
          onClick: () => {
            closeModal?.();
          },
          children: (0, import_i18n.__)("Cancel")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.Button,
        {
          __next40pxDefaultSize: true,
          variant: "primary",
          type: "submit",
          accessibleWhenDisabled: true,
          disabled: !isValid,
          children: (0, import_i18n.__)("Save")
        }
      )
    ] })
  ] }) });
}
var reorderPage = {
  id: "order-pages",
  label: (0, import_i18n.__)("Order"),
  isEligible({ status }) {
    return status !== "trash";
  },
  modalFocusOnMount: "firstContentElement",
  RenderModal: ReorderModal
};
var reorder_page_default = reorderPage;
//# sourceMappingURL=reorder-page.cjs.map
