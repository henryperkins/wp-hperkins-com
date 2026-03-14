// packages/fields/src/fields/parent/index.ts
import { __ } from "@wordpress/i18n";
import { ParentEdit } from "./parent-edit.mjs";
import { ParentView } from "./parent-view.mjs";
var parentField = {
  id: "parent",
  type: "text",
  label: __("Parent"),
  Edit: ParentEdit,
  render: ParentView,
  enableSorting: true,
  filterBy: false
};
var parent_default = parentField;
export {
  parent_default as default
};
//# sourceMappingURL=index.mjs.map
