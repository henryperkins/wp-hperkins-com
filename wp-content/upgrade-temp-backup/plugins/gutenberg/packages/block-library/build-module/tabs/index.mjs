// packages/block-library/src/tabs/index.js
import { __, sprintf } from "@wordpress/i18n";
import { tabs as icon } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import edit from "./edit.mjs";
import save from "./save.mjs";
import metadata from "./block.json";
var { name } = metadata;
var settings = {
  icon,
  example: {
    innerBlocks: [
      {
        name: "core/tabs-menu",
        innerBlocks: [{ name: "core/tabs-menu-item" }]
      },
      {
        name: "core/tab-panel",
        innerBlocks: [1, 2, 3].map((index) => ({
          name: "core/tab",
          attributes: {
            label: sprintf(
              /** translators: %s: tab index number */
              __("Tab %s"),
              index
            )
          },
          innerBlocks: [
            {
              name: "core/paragraph",
              attributes: {
                content: __(
                  "In a village of La Mancha, the name of which I have no desire to call to mind, there lived not long since one of those gentlemen that keep a lance in the lance-rack, an old buckler, a lean hack, and a greyhound for coursing."
                )
              }
            }
          ]
        }))
      }
    ]
  },
  edit,
  save
};
var init = () => initBlock({ name, metadata, settings });
export {
  init,
  metadata,
  name,
  settings
};
//# sourceMappingURL=index.mjs.map
