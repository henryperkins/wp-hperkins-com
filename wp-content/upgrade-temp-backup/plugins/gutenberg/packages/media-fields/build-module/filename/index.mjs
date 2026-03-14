// packages/media-fields/src/filename/index.ts
import { __ } from "@wordpress/i18n";
import { getFilename } from "@wordpress/url";
import FileNameView from "./view.mjs";
var filenameField = {
  id: "filename",
  type: "text",
  label: __("File name"),
  getValue: ({ item }) => getFilename(item?.source_url || ""),
  render: FileNameView,
  enableSorting: false,
  filterBy: false,
  readOnly: true
};
var filename_default = filenameField;
export {
  filename_default as default
};
//# sourceMappingURL=index.mjs.map
