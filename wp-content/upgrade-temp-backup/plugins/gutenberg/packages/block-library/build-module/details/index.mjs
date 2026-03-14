// packages/block-library/src/details/index.js
import { details as icon } from "@wordpress/icons";
import { __, sprintf } from "@wordpress/i18n";
import { privateApis as blocksPrivateApis } from "@wordpress/blocks";
import initBlock from "../utils/init-block.mjs";
import metadata from "./block.json";
import edit from "./edit.mjs";
import save from "./save.mjs";
import transforms from "./transforms.mjs";
import { unlock } from "../lock-unlock.mjs";
var { fieldsKey, formKey } = unlock(blocksPrivateApis);
var { name } = metadata;
var settings = {
  icon,
  example: {
    attributes: {
      summary: __("La Mancha"),
      showContent: true
    },
    innerBlocks: [
      {
        name: "core/paragraph",
        attributes: {
          content: __(
            "In a village of La Mancha, the name of which I have no desire to call to mind, there lived not long since one of those gentlemen that keep a lance in the lance-rack, an old buckler, a lean hack, and a greyhound for coursing."
          )
        }
      }
    ]
  },
  __experimentalLabel(attributes, { context }) {
    const { summary } = attributes;
    const customName = attributes?.metadata?.name;
    const hasSummary = summary?.trim().length > 0;
    if (context === "list-view" && (customName || hasSummary)) {
      return customName || summary;
    }
    if (context === "breadcrumb" && customName) {
      return customName;
    }
    if (context === "accessibility") {
      return !hasSummary ? __("Details. Empty.") : sprintf(
        /* translators: %s: accessibility text; summary title. */
        __("Details. %s"),
        summary
      );
    }
  },
  save,
  edit,
  transforms
};
if (window.__experimentalContentOnlyInspectorFields) {
  settings[fieldsKey] = [
    {
      id: "summary",
      label: __("Summary"),
      type: "text",
      Edit: "rich-text"
      // TODO: replace with custom component
    }
  ];
  settings[formKey] = {
    fields: ["summary"]
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
