// packages/fields/src/fields/template-title/index.ts
import { __ } from "@wordpress/i18n";
import { getItemTitle } from "../../actions/utils.mjs";
import TitleView from "../title/view.mjs";
var templateTitleField = {
  type: "text",
  label: __("Template"),
  placeholder: __("No title"),
  id: "title",
  getValue: ({ item }) => getItemTitle(item),
  render: TitleView,
  enableHiding: false,
  enableGlobalSearch: true,
  filterBy: false
};
var template_title_default = templateTitleField;
export {
  template_title_default as default
};
//# sourceMappingURL=index.mjs.map
