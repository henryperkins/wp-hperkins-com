// packages/block-library/src/social-link/index.js
import { __ } from "@wordpress/i18n";
import { share as icon } from "@wordpress/icons";
import { privateApis as blocksPrivateApis } from "@wordpress/blocks";
import initBlock from "../utils/init-block.mjs";
import edit from "./edit.mjs";
import metadata from "./block.json";
import variations from "./variations.mjs";
import { unlock } from "../lock-unlock.mjs";
var { fieldsKey, formKey } = unlock(blocksPrivateApis);
var { name } = metadata;
var settings = {
  icon,
  edit,
  variations
};
if (window.__experimentalContentOnlyInspectorFields) {
  settings[fieldsKey] = [
    {
      id: "link",
      label: __("Link"),
      type: "url",
      Edit: "link",
      // TODO: replace with custom component
      getValue: ({ item }) => ({
        url: item.url,
        rel: item.rel
      }),
      setValue: ({ value }) => ({
        url: value.url,
        rel: value.rel
      })
    },
    {
      id: "label",
      label: __("Label"),
      type: "text"
    }
  ];
  settings[formKey] = {
    fields: ["link", "label"]
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
