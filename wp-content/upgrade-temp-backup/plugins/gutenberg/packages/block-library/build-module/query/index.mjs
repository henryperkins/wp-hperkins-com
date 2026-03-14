// packages/block-library/src/query/index.js
import { loop as icon } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import metadata from "./block.json";
import edit from "./edit/index.mjs";
import save from "./save.mjs";
import variations from "./variations.mjs";
import deprecated from "./deprecated.mjs";
var { name } = metadata;
var settings = {
  icon,
  edit,
  example: {
    viewportWidth: 650,
    attributes: {
      namespace: "core/posts-list",
      query: {
        perPage: 4,
        pages: 1,
        offset: 0,
        postType: "post",
        order: "desc",
        orderBy: "date",
        author: "",
        search: "",
        sticky: "exclude",
        inherit: false
      }
    },
    innerBlocks: [
      {
        name: "core/post-template",
        attributes: {
          layout: {
            type: "grid",
            columnCount: 2
          }
        },
        innerBlocks: [
          {
            name: "core/post-title"
          },
          {
            name: "core/post-date",
            attributes: {
              metadata: {
                bindings: {
                  datetime: {
                    source: "core/post-data",
                    args: { field: "date" }
                  }
                }
              }
            }
          },
          {
            name: "core/post-excerpt"
          }
        ]
      }
    ]
  },
  save,
  variations,
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
