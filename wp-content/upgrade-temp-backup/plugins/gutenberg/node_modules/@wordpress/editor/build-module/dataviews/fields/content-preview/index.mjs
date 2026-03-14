// packages/editor/src/dataviews/fields/content-preview/index.tsx
import { __ } from "@wordpress/i18n";
import PostPreviewView from "./content-preview-view.mjs";
var postPreviewField = {
  type: "media",
  id: "content-preview",
  label: __("Content preview"),
  render: PostPreviewView,
  enableSorting: false
};
var content_preview_default = postPreviewField;
export {
  content_preview_default as default
};
//# sourceMappingURL=index.mjs.map
