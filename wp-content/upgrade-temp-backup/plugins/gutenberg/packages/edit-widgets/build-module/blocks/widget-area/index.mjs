// packages/edit-widgets/src/blocks/widget-area/index.js
import { __ } from "@wordpress/i18n";
import metadata from "./block.json";
import edit from "./edit/index.mjs";
var { name } = metadata;
var settings = {
  title: __("Widget Area"),
  description: __("A widget area container."),
  __experimentalLabel: ({ name: label }) => label,
  edit
};
export {
  metadata,
  name,
  settings
};
//# sourceMappingURL=index.mjs.map
