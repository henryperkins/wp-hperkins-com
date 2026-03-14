// packages/fields/src/fields/title/index.ts
import { __ } from "@wordpress/i18n";
import { getItemTitle } from "../../actions/utils.mjs";
import TitleView from "./view.mjs";
var titleField = {
  type: "text",
  id: "title",
  label: __("Title"),
  placeholder: __("No title"),
  getValue: ({ item }) => getItemTitle(item),
  render: TitleView,
  enableHiding: true,
  enableGlobalSearch: true,
  filterBy: false
};
var title_default = titleField;
export {
  title_default as default
};
//# sourceMappingURL=index.mjs.map
