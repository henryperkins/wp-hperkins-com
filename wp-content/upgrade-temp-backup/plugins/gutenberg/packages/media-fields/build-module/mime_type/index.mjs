// packages/media-fields/src/mime_type/index.ts
import { __ } from "@wordpress/i18n";
var mimeTypeField = {
  id: "mime_type",
  type: "text",
  label: __("File type"),
  getValue: ({ item }) => item?.mime_type || "",
  render: ({ item }) => item?.mime_type || "-",
  // Disable sorting until REST API support for ordering my `mime_type` is added.
  // See: https://core.trac.wordpress.org/ticket/64073
  enableSorting: false,
  filterBy: false,
  readOnly: true
};
var mime_type_default = mimeTypeField;
export {
  mime_type_default as default
};
//# sourceMappingURL=index.mjs.map
