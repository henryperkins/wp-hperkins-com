// packages/fields/src/fields/order/index.ts
import { __ } from "@wordpress/i18n";
var orderField = {
  id: "menu_order",
  type: "integer",
  label: __("Order"),
  description: __("Determines the order of pages."),
  filterBy: false,
  isValid: {
    required: true
  }
};
var order_default = orderField;
export {
  order_default as default
};
//# sourceMappingURL=index.mjs.map
