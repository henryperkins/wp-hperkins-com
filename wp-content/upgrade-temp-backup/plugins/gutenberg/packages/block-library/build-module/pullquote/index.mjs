// packages/block-library/src/pullquote/index.js
import { __ } from "@wordpress/i18n";
import { pullquote as icon } from "@wordpress/icons";
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
      value: (
        // translators: Quote serving as example for the Pullquote block. Attributed to Matt Mullenweg.
        __(
          "One of the hardest things to do in technology is disrupt yourself."
        )
      ),
      citation: __("Matt Mullenweg")
    }
  },
  transforms,
  edit,
  save,
  deprecated
};
if (window.__experimentalContentOnlyInspectorFields) {
  settings[fieldsKey] = [
    {
      id: "value",
      label: __("Content"),
      type: "text",
      Edit: "rich-text"
      // TODO: replace with custom component
    },
    {
      id: "citation",
      label: __("Citation"),
      type: "text",
      Edit: "rich-text"
      // TODO: replace with custom component
    }
  ];
  settings[formKey] = {
    fields: ["value", "citation"]
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
