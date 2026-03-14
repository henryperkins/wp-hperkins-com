// packages/block-library/src/paragraph/index.js
import { __ } from "@wordpress/i18n";
import { paragraph as icon } from "@wordpress/icons";
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
      content: __(
        "In a village of La Mancha, the name of which I have no desire to call to mind, there lived not long since one of those gentlemen that keep a lance in the lance-rack, an old buckler, a lean hack, and a greyhound for coursing."
      )
    }
  },
  __experimentalLabel(attributes, { context }) {
    const customName = attributes?.metadata?.name;
    if ((context === "list-view" || context === "breadcrumb") && customName) {
      return customName;
    }
    if (context === "accessibility") {
      if (customName) {
        return customName;
      }
      const { content } = attributes;
      return !content || content.length === 0 ? __("Empty") : content;
    }
  },
  transforms,
  deprecated,
  merge(attributes, attributesToMerge) {
    return {
      content: (attributes.content || "") + (attributesToMerge.content || "")
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
