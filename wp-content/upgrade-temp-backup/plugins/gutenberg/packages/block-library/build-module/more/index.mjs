// packages/block-library/src/more/index.js
import { more as icon } from "@wordpress/icons";
import { __ } from "@wordpress/i18n";
import { privateApis as blocksPrivateApis } from "@wordpress/blocks";
import initBlock from "../utils/init-block.mjs";
import edit from "./edit.mjs";
import metadata from "./block.json";
import save from "./save.mjs";
import transforms from "./transforms.mjs";
import { unlock } from "../lock-unlock.mjs";
var { fieldsKey, formKey } = unlock(blocksPrivateApis);
var { name } = metadata;
var settings = {
  icon,
  example: {},
  __experimentalLabel(attributes, { context }) {
    const customName = attributes?.metadata?.name;
    if ((context === "list-view" || context === "breadcrumb") && customName) {
      return customName;
    }
    if (context === "accessibility") {
      return attributes.customText;
    }
  },
  transforms,
  edit,
  save
};
if (window.__experimentalContentOnlyInspectorFields) {
  settings[fieldsKey] = [
    {
      id: "customText",
      label: __("Content"),
      type: "text",
      Edit: "rich-text"
      // TODO: replace with custom component
    }
  ];
  settings[formKey] = {
    fields: ["customText"]
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
