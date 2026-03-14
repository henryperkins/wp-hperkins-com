// packages/block-library/src/terms-query/edit/inspector-controls/order-control.js
import { __ } from "@wordpress/i18n";
import { SelectControl } from "@wordpress/components";
import { jsx } from "react/jsx-runtime";
function OrderControl({ orderBy, order, onChange, ...props }) {
  return /* @__PURE__ */ jsx(
    SelectControl,
    {
      __next40pxDefaultSize: true,
      options: [
        {
          label: __("Name: A \u2192 Z"),
          value: "name/asc"
        },
        {
          label: __("Name: Z \u2192 A"),
          value: "name/desc"
        },
        {
          label: __("Count, high to low"),
          value: "count/desc"
        },
        {
          label: __("Count, low to high"),
          value: "count/asc"
        }
      ],
      value: orderBy + "/" + order,
      onChange: (value) => {
        const [newOrderBy, newOrder] = value.split("/");
        onChange(newOrderBy, newOrder);
      },
      ...props
    }
  );
}
export {
  OrderControl as default
};
//# sourceMappingURL=order-control.mjs.map
