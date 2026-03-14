// packages/fields/src/fields/pattern-title/index.ts
import { __ } from "@wordpress/i18n";
import { getItemTitle } from "../../actions/utils.mjs";
import PatternTitleView from "./view.mjs";
var patternTitleField = {
  type: "text",
  id: "title",
  label: __("Title"),
  placeholder: __("No title"),
  getValue: ({ item }) => getItemTitle(item),
  render: PatternTitleView,
  enableHiding: false,
  enableGlobalSearch: true,
  filterBy: false
};
var pattern_title_default = patternTitleField;
export {
  pattern_title_default as default
};
//# sourceMappingURL=index.mjs.map
