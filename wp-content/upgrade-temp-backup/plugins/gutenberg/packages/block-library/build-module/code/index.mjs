// packages/block-library/src/code/index.js
import { __ } from "@wordpress/i18n";
import { code as icon } from "@wordpress/icons";
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
  example: {
    attributes: {
      /* eslint-disable @wordpress/i18n-no-collapsible-whitespace */
      // translators: Preserve \n markers for line breaks
      content: __(
        "// A \u201Cblock\u201D is the abstract term used\n// to describe units of markup that\n// when composed together, form the\n// content or layout of a page.\nregisterBlockType( name, settings );"
      )
      /* eslint-enable @wordpress/i18n-no-collapsible-whitespace */
    }
  },
  merge(attributes, attributesToMerge) {
    return {
      content: attributes.content + "\n\n" + attributesToMerge.content
    };
  },
  transforms,
  edit,
  save
};
if (window.__experimentalContentOnlyInspectorFields) {
  settings[fieldsKey] = [
    {
      id: "content",
      label: __("Code"),
      type: "text",
      Edit: "rich-text"
      // TODO: replace with custom component
    }
  ];
  settings[formKey] = {
    fields: ["content"]
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
