// packages/block-library/src/verse/index.js
import { __ } from "@wordpress/i18n";
import { verse as icon } from "@wordpress/icons";
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
      /* eslint-disable @wordpress/i18n-no-collapsible-whitespace */
      // translators: Sample content for the Verse block. Can be replaced with a more locale-adequate work.
      content: __(
        "WHAT was he doing, the great god Pan,\n	Down in the reeds by the river?\nSpreading ruin and scattering ban,\nSplashing and paddling with hoofs of a goat,\nAnd breaking the golden lilies afloat\n    With the dragon-fly on the river."
      )
      /* eslint-enable @wordpress/i18n-no-collapsible-whitespace */
    }
  },
  transforms,
  deprecated,
  merge(attributes, attributesToMerge) {
    return {
      content: attributes.content + "\n\n" + attributesToMerge.content
    };
  },
  edit,
  save
};
if (window.__experimentalContentOnlyInspectorFields) {
  settings[fieldsKey] = [
    {
      id: "content",
      label: __("Content"),
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
