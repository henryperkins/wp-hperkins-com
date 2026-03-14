// packages/fields/src/fields/page-title/index.ts
import { __ } from "@wordpress/i18n";
import { getItemTitle } from "../../actions/utils.mjs";
import PageTitleView from "./view.mjs";
var pageTitleField = {
  type: "text",
  id: "title",
  label: __("Title"),
  placeholder: __("No title"),
  getValue: ({ item }) => getItemTitle(item),
  render: PageTitleView,
  enableHiding: false,
  enableGlobalSearch: true,
  filterBy: false
};
var page_title_default = pageTitleField;
export {
  page_title_default as default
};
//# sourceMappingURL=index.mjs.map
