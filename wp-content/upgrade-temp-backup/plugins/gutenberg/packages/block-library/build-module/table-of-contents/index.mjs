// packages/block-library/src/table-of-contents/index.js
import { __ } from "@wordpress/i18n";
import { tableOfContents as icon } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import metadata from "./block.json";
import edit from "./edit.mjs";
import save from "./save.mjs";
var { name } = metadata;
var settings = {
  icon,
  edit,
  save,
  example: {
    innerBlocks: [
      {
        name: "core/heading",
        attributes: {
          level: 2,
          content: __("Heading")
        }
      },
      {
        name: "core/heading",
        attributes: {
          level: 3,
          content: __("Subheading")
        }
      },
      {
        name: "core/heading",
        attributes: {
          level: 2,
          content: __("Heading")
        }
      },
      {
        name: "core/heading",
        attributes: {
          level: 3,
          content: __("Subheading")
        }
      }
    ],
    attributes: {
      headings: [
        {
          content: __("Heading"),
          level: 2
        },
        {
          content: __("Subheading"),
          level: 3
        },
        {
          content: __("Heading"),
          level: 2
        },
        {
          content: __("Subheading"),
          level: 3
        }
      ]
    }
  }
};
var init = () => initBlock({ name, metadata, settings });
export {
  init,
  metadata,
  name,
  settings
};
//# sourceMappingURL=index.mjs.map
