// packages/fields/src/fields/comment-status/index.tsx
import { __ } from "@wordpress/i18n";
var commentStatusField = {
  id: "comment_status",
  label: __("Comments"),
  type: "text",
  Edit: "radio",
  enableSorting: false,
  enableHiding: false,
  filterBy: false,
  elements: [
    {
      value: "open",
      label: __("Open"),
      description: __("Visitors can add new comments and replies.")
    },
    {
      value: "closed",
      label: __("Closed"),
      description: __(
        "Visitors cannot add new comments or replies. Existing comments remain visible."
      )
    }
  ]
};
var comment_status_default = commentStatusField;
export {
  comment_status_default as default
};
//# sourceMappingURL=index.mjs.map
