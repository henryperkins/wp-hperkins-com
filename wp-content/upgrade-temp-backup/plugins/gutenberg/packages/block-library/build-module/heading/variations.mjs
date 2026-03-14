// packages/block-library/src/heading/variations.js
import { __, sprintf } from "@wordpress/i18n";
import {
  headingLevel1,
  headingLevel2,
  headingLevel3,
  headingLevel4,
  headingLevel5,
  headingLevel6
} from "@wordpress/icons";
var LEVEL_ICONS = [
  headingLevel1,
  headingLevel2,
  headingLevel3,
  headingLevel4,
  headingLevel5,
  headingLevel6
];
var variations = [
  ...[1, 2, 3, 4, 5, 6].map((level) => ({
    name: `h${level}`,
    title: sprintf(
      /* translators: %d: heading level e.g: "1", "2", "3" */
      __("Heading %d"),
      level
    ),
    description: __(
      "Introduce new sections and organize content to help visitors (and search engines) understand the structure of your content."
    ),
    icon: LEVEL_ICONS[level - 1],
    attributes: { level },
    scope: ["block", "transform"],
    keywords: [`h${level}`],
    isActive: (blockAttributes) => blockAttributes.level === level
  }))
];
var variations_default = variations;
export {
  variations_default as default
};
//# sourceMappingURL=variations.mjs.map
