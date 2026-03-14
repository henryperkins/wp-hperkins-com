// packages/block-library/src/columns/index.js
import { __ } from "@wordpress/i18n";
import { columns as icon } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import deprecated from "./deprecated.mjs";
import edit from "./edit.mjs";
import metadata from "./block.json";
import save from "./save.mjs";
import variations from "./variations.mjs";
import transforms from "./transforms.mjs";
var { name } = metadata;
var settings = {
  icon,
  variations,
  example: {
    viewportWidth: 782,
    // Columns collapse "@media (max-width: 781px)".
    innerBlocks: [
      {
        name: "core/column",
        innerBlocks: [
          {
            name: "core/paragraph",
            attributes: {
              /* translators: example text. */
              content: __(
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et eros eu felis."
              )
            }
          },
          {
            name: "core/image",
            attributes: {
              url: "https://s.w.org/images/core/5.3/Windbuchencom.jpg"
            }
          },
          {
            name: "core/paragraph",
            attributes: {
              /* translators: example text. */
              content: __(
                "Suspendisse commodo neque lacus, a dictum orci interdum et."
              )
            }
          }
        ]
      },
      {
        name: "core/column",
        innerBlocks: [
          {
            name: "core/paragraph",
            attributes: {
              /* translators: example text. */
              content: __(
                "Etiam et egestas lorem. Vivamus sagittis sit amet dolor quis lobortis. Integer sed fermentum arcu, id vulputate lacus. Etiam fermentum sem eu quam hendrerit."
              )
            }
          },
          {
            name: "core/paragraph",
            attributes: {
              /* translators: example text. */
              content: __(
                "Nam risus massa, ullamcorper consectetur eros fermentum, porta aliquet ligula. Sed vel mauris nec enim."
              )
            }
          }
        ]
      }
    ]
  },
  deprecated,
  edit,
  save,
  transforms
};
var init = () => initBlock({ name, metadata, settings });
export {
  init,
  metadata,
  name,
  settings
};
//# sourceMappingURL=index.mjs.map
