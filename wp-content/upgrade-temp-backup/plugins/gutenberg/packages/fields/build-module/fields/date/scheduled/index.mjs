// packages/fields/src/fields/date/scheduled/index.tsx
import { __ } from "@wordpress/i18n";
var scheduledDateField = {
  id: "scheduled_date",
  type: "datetime",
  label: __("Scheduled Date"),
  getValue: ({ item }) => item.date,
  setValue: ({ value }) => ({ date: value }),
  isVisible: (item) => item.status === "future",
  enableHiding: false,
  enableSorting: false,
  filterBy: false
};
var scheduled_default = scheduledDateField;
export {
  scheduled_default as default
};
//# sourceMappingURL=index.mjs.map
