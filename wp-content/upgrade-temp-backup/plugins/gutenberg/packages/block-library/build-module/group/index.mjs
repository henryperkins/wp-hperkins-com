// packages/block-library/src/group/index.js
import { __ } from "@wordpress/i18n";
import { group as icon } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import deprecated from "./deprecated.mjs";
import edit from "./edit.mjs";
import metadata from "./block.json";
import save from "./save.mjs";
import transforms from "./transforms.mjs";
import variations from "./variations.mjs";
var { name } = metadata;
var settings = {
  icon,
  example: {
    attributes: {
      layout: {
        type: "constrained",
        justifyContent: "center"
      },
      style: {
        spacing: {
          padding: {
            top: "4em",
            right: "3em",
            bottom: "4em",
            left: "3em"
          }
        }
      }
    },
    innerBlocks: [
      {
        name: "core/heading",
        attributes: {
          content: __("La Mancha"),
          style: {
            typography: {
              textAlign: "center"
            }
          }
        }
      },
      {
        name: "core/paragraph",
        attributes: {
          style: {
            typography: {
              textAlign: "center"
            }
          },
          content: __(
            "In a village of La Mancha, the name of which I have no desire to call to mind, there lived not long since one of those gentlemen that keep a lance in the lance-rack, an old buckler, a lean hack, and a greyhound for coursing."
          )
        }
      },
      {
        name: "core/spacer",
        attributes: {
          height: "10px"
        }
      },
      {
        name: "core/button",
        attributes: {
          text: __("Read more")
        }
      }
    ],
    viewportWidth: 600
  },
  transforms,
  edit,
  save,
  deprecated,
  variations
};
var init = () => initBlock({ name, metadata, settings });
export {
  init,
  metadata,
  name,
  settings
};
//# sourceMappingURL=index.mjs.map
