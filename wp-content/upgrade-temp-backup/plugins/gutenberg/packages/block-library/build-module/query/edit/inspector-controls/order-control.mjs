// packages/block-library/src/query/edit/inspector-controls/order-control.js
import { SelectControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { jsx } from "react/jsx-runtime";
var defaultOrderByOptions = [
  {
    label: __("Newest to oldest"),
    value: "date/desc"
  },
  {
    label: __("Oldest to newest"),
    value: "date/asc"
  },
  {
    /* translators: Label for ordering posts by title in ascending order. */
    label: __("A \u2192 Z"),
    value: "title/asc"
  },
  {
    /* translators: Label for ordering posts by title in descending order. */
    label: __("Z \u2192 A"),
    value: "title/desc"
  }
];
function OrderControl({
  order,
  orderBy,
  orderByOptions = defaultOrderByOptions,
  onChange
}) {
  return /* @__PURE__ */ jsx(
    SelectControl,
    {
      __next40pxDefaultSize: true,
      label: __("Order by"),
      value: `${orderBy}/${order}`,
      options: orderByOptions,
      onChange: (value) => {
        const [newOrderBy, newOrder] = value.split("/");
        onChange({ order: newOrder, orderBy: newOrderBy });
      }
    }
  );
}
var order_control_default = OrderControl;
export {
  order_control_default as default
};
//# sourceMappingURL=order-control.mjs.map
