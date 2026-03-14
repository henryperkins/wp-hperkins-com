// packages/block-library/src/social-links/index.js
import { share as icon } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import deprecated from "./deprecated.mjs";
import edit from "./edit.mjs";
import metadata from "./block.json";
import save from "./save.mjs";
var { name } = metadata;
var settings = {
  example: {
    innerBlocks: [
      {
        name: "core/social-link",
        attributes: {
          service: "wordpress",
          url: "https://wordpress.org"
        }
      },
      {
        name: "core/social-link",
        attributes: {
          service: "facebook",
          url: "https://www.facebook.com/WordPress/"
        }
      },
      {
        name: "core/social-link",
        attributes: {
          service: "twitter",
          url: "https://twitter.com/WordPress"
        }
      }
    ]
  },
  icon,
  edit,
  save,
  deprecated
};
var init = () => initBlock({ name, metadata, settings });
export {
  init,
  metadata,
  name,
  settings
};
//# sourceMappingURL=index.mjs.map
