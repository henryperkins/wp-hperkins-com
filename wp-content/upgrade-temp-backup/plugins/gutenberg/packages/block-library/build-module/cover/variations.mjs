// packages/block-library/src/cover/variations.js
import { __ } from "@wordpress/i18n";
import { cover } from "@wordpress/icons";
var variations = [
  {
    name: "cover",
    title: __("Cover"),
    description: __("Add an image or video with a text overlay."),
    attributes: { layout: { type: "constrained" } },
    isDefault: true,
    icon: cover
  }
];
var variations_default = variations;
export {
  variations_default as default
};
//# sourceMappingURL=variations.mjs.map
