// packages/block-library/src/cover/index.js
import { __ } from "@wordpress/i18n";
import { cover as icon } from "@wordpress/icons";
import { privateApis as blocksPrivateApis } from "@wordpress/blocks";
import initBlock from "../utils/init-block.mjs";
import deprecated from "./deprecated.mjs";
import edit from "./edit/index.mjs";
import metadata from "./block.json";
import save from "./save.mjs";
import transforms from "./transforms.mjs";
import variations from "./variations.mjs";
import { unlock } from "../lock-unlock.mjs";
var { fieldsKey, formKey } = unlock(blocksPrivateApis);
var { name } = metadata;
var settings = {
  icon,
  example: {
    attributes: {
      customOverlayColor: "#065174",
      dimRatio: 40,
      url: "https://s.w.org/images/core/5.3/Windbuchencom.jpg",
      style: {
        typography: {
          fontSize: 48
        },
        color: {
          text: "white"
        }
      }
    },
    innerBlocks: [
      {
        name: "core/paragraph",
        attributes: {
          content: `<strong>${__("Snow Patrol")}</strong>`,
          style: {
            typography: {
              textAlign: "center"
            }
          }
        }
      }
    ]
  },
  transforms,
  save,
  edit,
  deprecated,
  variations
};
if (window.__experimentalContentOnlyInspectorFields) {
  settings[fieldsKey] = [
    {
      id: "background",
      label: __("Background"),
      type: "media",
      Edit: {
        control: "media",
        // TODO: replace with custom component
        // TODO - How to support custom gradient?
        // Build it into Media, or use a custom control?
        allowedTypes: ["image", "video"],
        multiple: false,
        useFeaturedImage: true
      },
      getValue: ({ item }) => ({
        id: item.id,
        url: item.url,
        alt: item.alt,
        mediaType: item.backgroundType,
        featuredImage: item.useFeaturedImage
      }),
      setValue: ({ value }) => ({
        id: value.id,
        url: value.url,
        alt: value.alt,
        mediaType: value.backgroundType,
        useFeaturedImage: value.featuredImage
      })
    }
  ];
  settings[formKey] = {
    fields: ["background"]
  };
}
var init = () => initBlock({ name, metadata, settings });
export {
  init,
  metadata,
  name,
  settings
};
//# sourceMappingURL=index.mjs.map
