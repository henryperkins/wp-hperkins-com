// packages/edit-widgets/src/filters/replace-media-upload.js
var import_hooks = require("@wordpress/hooks");
var import_media_utils = require("@wordpress/media-utils");
var replaceMediaUpload = () => import_media_utils.MediaUpload;
(0, import_hooks.addFilter)(
  "editor.MediaUpload",
  "core/edit-widgets/replace-media-upload",
  replaceMediaUpload
);
//# sourceMappingURL=replace-media-upload.cjs.map
