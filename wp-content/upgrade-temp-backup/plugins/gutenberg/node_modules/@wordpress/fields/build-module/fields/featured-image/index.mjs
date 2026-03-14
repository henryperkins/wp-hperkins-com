// packages/fields/src/fields/featured-image/index.tsx
import { __ } from "@wordpress/i18n";
import MediaEdit from "../../components/media-edit/index.mjs";
import { FeaturedImageView } from "./featured-image-view.mjs";
import { jsx } from "react/jsx-runtime";
var featuredImageField = {
  id: "featured_media",
  type: "media",
  label: __("Featured Image"),
  Edit: (props) => /* @__PURE__ */ jsx(MediaEdit, { ...props, isExpanded: true }),
  render: FeaturedImageView,
  setValue: ({ value }) => ({
    featured_media: value ?? 0
  }),
  enableSorting: false,
  filterBy: false
};
var featured_image_default = featuredImageField;
export {
  featured_image_default as default
};
//# sourceMappingURL=index.mjs.map
