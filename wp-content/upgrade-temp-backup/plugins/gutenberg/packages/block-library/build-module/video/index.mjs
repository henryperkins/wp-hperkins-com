// packages/block-library/src/video/index.js
import { __ } from "@wordpress/i18n";
import { video as icon } from "@wordpress/icons";
import { privateApis as blocksPrivateApis } from "@wordpress/blocks";
import initBlock from "../utils/init-block.mjs";
import deprecated from "./deprecated.mjs";
import edit from "./edit.mjs";
import metadata from "./block.json";
import save from "./save.mjs";
import transforms from "./transforms.mjs";
import { unlock } from "../lock-unlock.mjs";
var { fieldsKey, formKey } = unlock(blocksPrivateApis);
var { name } = metadata;
var settings = {
  icon,
  example: {
    attributes: {
      src: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Wood_thrush_in_Central_Park_switch_sides_%2816510%29.webm",
      // translators: Caption accompanying a video of the wood thrush singing, which serves as an example for the Video block.
      caption: __("Wood thrush singing in Central Park, NYC.")
    }
  },
  transforms,
  deprecated,
  edit,
  save
};
if (window.__experimentalContentOnlyInspectorFields) {
  settings[fieldsKey] = [
    {
      id: "video",
      label: __("Video"),
      type: "media",
      Edit: {
        control: "media",
        // TODO: replace with custom component
        allowedTypes: ["video"],
        multiple: false
      },
      getValue: ({ item }) => ({
        id: item.id,
        url: item.src,
        caption: item.caption,
        poster: item.poster
      }),
      setValue: ({ value }) => ({
        id: value.id,
        src: value.url,
        caption: value.caption,
        poster: value.poster
      })
    },
    {
      id: "caption",
      label: __("Caption"),
      type: "text",
      Edit: "rich-text"
      // TODO: replace with custom component
    }
  ];
  settings[formKey] = {
    fields: ["video", "caption"]
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
