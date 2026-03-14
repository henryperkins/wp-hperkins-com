// packages/editor/src/components/post-visibility/utils.js
import { __ } from "@wordpress/i18n";
var VISIBILITY_OPTIONS = [
  {
    label: __("Public"),
    value: "public",
    description: __("Visible to everyone.")
  },
  {
    label: __("Private"),
    value: "private",
    description: __("Only visible to site admins and editors.")
  },
  {
    label: __("Password protected"),
    value: "password",
    description: __("Only visible to those who know the password.")
  }
];
export {
  VISIBILITY_OPTIONS
};
//# sourceMappingURL=utils.mjs.map
