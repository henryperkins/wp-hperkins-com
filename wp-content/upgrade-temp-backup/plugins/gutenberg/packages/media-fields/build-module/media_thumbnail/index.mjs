// packages/media-fields/src/media_thumbnail/index.tsx
import { __ } from "@wordpress/i18n";
import MediaThumbnailView from "./view.mjs";
var mediaThumbnailField = {
  id: "media_thumbnail",
  type: "media",
  label: __("Thumbnail"),
  render: MediaThumbnailView,
  enableSorting: false,
  filterBy: false
};
var media_thumbnail_default = mediaThumbnailField;
export {
  media_thumbnail_default as default
};
//# sourceMappingURL=index.mjs.map
