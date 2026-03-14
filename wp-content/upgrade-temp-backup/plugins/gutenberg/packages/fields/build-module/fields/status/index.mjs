// packages/fields/src/fields/status/index.tsx
import { __ } from "@wordpress/i18n";
import StatusView from "./status-view.mjs";
import STATUSES from "./status-elements.mjs";
var OPERATOR_IS_ANY = "isAny";
var statusField = {
  label: __("Status"),
  id: "status",
  type: "text",
  elements: STATUSES,
  render: StatusView,
  Edit: "radio",
  enableSorting: false,
  filterBy: {
    operators: [OPERATOR_IS_ANY]
  }
};
var status_default = statusField;
export {
  status_default as default
};
//# sourceMappingURL=index.mjs.map
