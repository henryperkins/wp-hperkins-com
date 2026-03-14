// packages/fields/src/fields/date/index.tsx
import { __ } from "@wordpress/i18n";
import DateView from "./date-view.mjs";
var dateField = {
  id: "date",
  type: "datetime",
  label: __("Date"),
  render: DateView,
  filterBy: {
    operators: ["before", "after"]
  }
};
var date_default = dateField;
export {
  date_default as default
};
//# sourceMappingURL=index.mjs.map
