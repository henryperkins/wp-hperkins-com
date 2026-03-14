// packages/media-fields/src/date_modified/index.tsx
import { __ } from "@wordpress/i18n";
import { getSettings } from "@wordpress/date";
var dateModifiedField = {
  id: "modified",
  type: "datetime",
  label: __("Date modified"),
  filterBy: {
    operators: ["before", "after"]
  },
  format: {
    datetime: getSettings().formats.datetimeAbbreviated
  },
  readOnly: true
};
var date_modified_default = dateModifiedField;
export {
  date_modified_default as default
};
//# sourceMappingURL=index.mjs.map
