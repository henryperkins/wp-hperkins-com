// packages/media-fields/src/media_dimensions/index.ts
import { __, _x, sprintf } from "@wordpress/i18n";
var mediaDimensionsField = {
  id: "media_dimensions",
  type: "text",
  label: __("Dimensions"),
  getValue: ({ item }) => item?.media_details?.width && item?.media_details?.height ? sprintf(
    // translators: 1: Width. 2: Height.
    _x("%1$s \xD7 %2$s", "image dimensions"),
    item?.media_details?.width?.toString(),
    item?.media_details?.height?.toString()
  ) : "",
  isVisible: (item) => {
    return !!(item?.media_details?.width && item?.media_details?.height);
  },
  enableSorting: false,
  filterBy: false,
  readOnly: true
};
var media_dimensions_default = mediaDimensionsField;
export {
  media_dimensions_default as default
};
//# sourceMappingURL=index.mjs.map
