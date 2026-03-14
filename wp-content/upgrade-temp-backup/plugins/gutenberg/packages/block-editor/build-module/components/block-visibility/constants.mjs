// packages/block-editor/src/components/block-visibility/constants.js
import { __ } from "@wordpress/i18n";
import { desktop, tablet, mobile } from "@wordpress/icons";
var BLOCK_VISIBILITY_VIEWPORTS = {
  desktop: {
    label: __("Desktop"),
    icon: desktop,
    key: "desktop"
  },
  tablet: {
    label: __("Tablet"),
    icon: tablet,
    key: "tablet"
  },
  mobile: {
    label: __("Mobile"),
    icon: mobile,
    key: "mobile"
  }
};
var BLOCK_VISIBILITY_VIEWPORT_ENTRIES = Object.entries(
  BLOCK_VISIBILITY_VIEWPORTS
);
export {
  BLOCK_VISIBILITY_VIEWPORTS,
  BLOCK_VISIBILITY_VIEWPORT_ENTRIES
};
//# sourceMappingURL=constants.mjs.map
