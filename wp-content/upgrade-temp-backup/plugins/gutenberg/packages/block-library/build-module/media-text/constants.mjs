// packages/block-library/src/media-text/constants.js
import { _x } from "@wordpress/i18n";
var DEFAULT_MEDIA_SIZE_SLUG = "full";
var WIDTH_CONSTRAINT_PERCENTAGE = 15;
var LINK_DESTINATION_NONE = "none";
var LINK_DESTINATION_MEDIA = "media";
var LINK_DESTINATION_ATTACHMENT = "attachment";
var TEMPLATE = [
  [
    "core/paragraph",
    {
      placeholder: _x("Content\u2026", "content placeholder")
    }
  ]
];
export {
  DEFAULT_MEDIA_SIZE_SLUG,
  LINK_DESTINATION_ATTACHMENT,
  LINK_DESTINATION_MEDIA,
  LINK_DESTINATION_NONE,
  TEMPLATE,
  WIDTH_CONSTRAINT_PERCENTAGE
};
//# sourceMappingURL=constants.mjs.map
