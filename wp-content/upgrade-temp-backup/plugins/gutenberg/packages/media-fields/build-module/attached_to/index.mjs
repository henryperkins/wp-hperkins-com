// packages/media-fields/src/attached_to/index.tsx
import { __ } from "@wordpress/i18n";
import MediaAttachedToView from "./view.mjs";
import MediaAttachedToEdit from "./edit.mjs";
var attachedToField = {
  id: "attached_to",
  type: "text",
  label: __("Attached to"),
  Edit: MediaAttachedToEdit,
  render: MediaAttachedToView,
  enableSorting: false,
  filterBy: false
};
var attached_to_default = attachedToField;
export {
  attached_to_default as default
};
//# sourceMappingURL=index.mjs.map
