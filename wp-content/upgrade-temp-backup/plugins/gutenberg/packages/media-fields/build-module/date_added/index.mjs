// packages/media-fields/src/date_added/index.tsx
import { __ } from "@wordpress/i18n";
import { getSettings } from "@wordpress/date";
var dateAddedField = {
  id: "date",
  type: "datetime",
  label: __("Date added"),
  filterBy: {
    operators: ["before", "after"]
  },
  format: {
    datetime: getSettings().formats.datetimeAbbreviated
  },
  readOnly: true
};
var date_added_default = dateAddedField;
export {
  date_added_default as default
};
//# sourceMappingURL=index.mjs.map
