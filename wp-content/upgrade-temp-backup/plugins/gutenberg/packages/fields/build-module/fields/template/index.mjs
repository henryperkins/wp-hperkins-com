// packages/fields/src/fields/template/index.ts
import { __ } from "@wordpress/i18n";
import { TemplateEdit } from "./template-edit.mjs";
import { TemplateView } from "./template-view.mjs";
var templateField = {
  id: "template",
  type: "text",
  label: __("Template"),
  Edit: TemplateEdit,
  render: TemplateView,
  enableSorting: false,
  filterBy: false
};
var template_default = templateField;
export {
  template_default as default
};
//# sourceMappingURL=index.mjs.map
