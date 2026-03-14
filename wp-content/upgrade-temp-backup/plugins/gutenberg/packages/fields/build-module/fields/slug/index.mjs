// packages/fields/src/fields/slug/index.ts
import { __ } from "@wordpress/i18n";
import SlugEdit from "./slug-edit.mjs";
import SlugView from "./slug-view.mjs";
var slugField = {
  id: "slug",
  type: "text",
  label: __("Slug"),
  Edit: SlugEdit,
  render: SlugView,
  filterBy: false
};
var slug_default = slugField;
export {
  slug_default as default
};
//# sourceMappingURL=index.mjs.map
