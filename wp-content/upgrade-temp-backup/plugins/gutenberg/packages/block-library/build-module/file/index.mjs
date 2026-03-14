// packages/block-library/src/file/index.js
import { _x, __ } from "@wordpress/i18n";
import { file as icon } from "@wordpress/icons";
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
      href: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Armstrong_Small_Step.ogg",
      fileName: _x("Armstrong_Small_Step", "Name of the file")
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
      id: "file",
      label: __("File"),
      type: "media",
      Edit: {
        control: "media",
        // TODO: replace with custom component
        allowedTypes: [],
        multiple: false
      },
      getValue: ({ item }) => ({
        id: item.id,
        url: item.href
      }),
      setValue: ({ value }) => ({
        id: value.id,
        href: value.url
      })
    },
    {
      id: "fileName",
      label: __("Filename"),
      type: "text",
      Edit: "rich-text"
      // TODO: replace with custom component
    },
    {
      id: "downloadButtonText",
      label: __("Button Text"),
      type: "text",
      Edit: "rich-text"
      // TODO: replace with custom component
    }
  ];
  settings[formKey] = {
    fields: ["file", "fileName", "downloadButtonText"]
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
