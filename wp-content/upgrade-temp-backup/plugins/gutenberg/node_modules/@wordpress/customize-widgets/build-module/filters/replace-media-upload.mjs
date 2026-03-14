// packages/customize-widgets/src/filters/replace-media-upload.js
import { addFilter } from "@wordpress/hooks";
import { MediaUpload } from "@wordpress/media-utils";
var replaceMediaUpload = () => MediaUpload;
addFilter(
  "editor.MediaUpload",
  "core/edit-widgets/replace-media-upload",
  replaceMediaUpload
);
//# sourceMappingURL=replace-media-upload.mjs.map
