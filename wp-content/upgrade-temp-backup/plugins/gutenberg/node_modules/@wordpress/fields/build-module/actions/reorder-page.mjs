// packages/fields/src/actions/reorder-page.tsx
import { useDispatch } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { __ } from "@wordpress/i18n";
import { store as noticesStore } from "@wordpress/notices";
import { useState } from "@wordpress/element";
import {
  Button,
  __experimentalHStack as HStack,
  __experimentalVStack as VStack,
  __experimentalInputControl as InputControl
} from "@wordpress/components";
import { jsx, jsxs } from "react/jsx-runtime";
function isItemValid(item) {
  return typeof item.menu_order === "number" && Number.isInteger(item.menu_order);
}
function ReorderModal({
  items,
  closeModal,
  onActionPerformed
}) {
  const [item, setItem] = useState(items[0]);
  const { editEntityRecord, saveEditedEntityRecord } = useDispatch(coreStore);
  const { createSuccessNotice, createErrorNotice } = useDispatch(noticesStore);
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
      createSuccessNotice(__("Order updated."), {
        type: "snackbar"
      });
      onActionPerformed?.(items);
    } catch (error) {
      const typedError = error;
      const errorMessage = typedError.message && typedError.code !== "unknown_error" ? typedError.message : __("An error occurred while updating the order");
      createErrorNotice(errorMessage, {
        type: "snackbar"
      });
    }
  }
  return /* @__PURE__ */ jsx("form", { onSubmit: onOrder, children: /* @__PURE__ */ jsxs(VStack, { spacing: "5", children: [
    /* @__PURE__ */ jsx("div", { children: __(
      "Determines the order of pages. Pages with the same order value are sorted alphabetically. Negative order values are supported."
    ) }),
    /* @__PURE__ */ jsx(
      InputControl,
      {
        __next40pxDefaultSize: true,
        label: __("Order"),
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
    /* @__PURE__ */ jsxs(HStack, { justify: "right", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          __next40pxDefaultSize: true,
          variant: "tertiary",
          onClick: () => {
            closeModal?.();
          },
          children: __("Cancel")
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          __next40pxDefaultSize: true,
          variant: "primary",
          type: "submit",
          accessibleWhenDisabled: true,
          disabled: !isValid,
          children: __("Save")
        }
      )
    ] })
  ] }) });
}
var reorderPage = {
  id: "order-pages",
  label: __("Order"),
  isEligible({ status }) {
    return status !== "trash";
  },
  modalFocusOnMount: "firstContentElement",
  RenderModal: ReorderModal
};
var reorder_page_default = reorderPage;
export {
  reorder_page_default as default
};
//# sourceMappingURL=reorder-page.mjs.map
