// packages/block-library/src/audio/index.js
import { __ } from "@wordpress/i18n";
import { audio as icon } from "@wordpress/icons";
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
      src: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Armstrong_Small_Step.ogg"
    },
    viewportWidth: 350
  },
  transforms,
  deprecated,
  edit,
  save
};
if (window.__experimentalContentOnlyInspectorFields) {
  settings[fieldsKey] = [
    {
      id: "audio",
      label: __("Audio"),
      type: "media",
      Edit: {
        control: "media",
        // TODO: replace with custom component
        allowedTypes: ["audio"],
        multiple: false
      },
      getValue: ({ item }) => ({
        id: item.id,
        url: item.src
      }),
      setValue: ({ value }) => ({
        id: value.id,
        src: value.url
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
    fields: ["audio", "caption"]
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
