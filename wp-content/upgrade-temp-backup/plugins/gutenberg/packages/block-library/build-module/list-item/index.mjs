// packages/block-library/src/list-item/index.js
import { __ } from "@wordpress/i18n";
import { listItem as icon } from "@wordpress/icons";
import { privateApis } from "@wordpress/block-editor";
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
  edit,
  save,
  merge(attributes, attributesToMerge) {
    return {
      ...attributes,
      content: attributes.content + attributesToMerge.content
    };
  },
  transforms,
  [unlock(privateApis).requiresWrapperOnCopy]: true,
  __experimentalLabel(attributes, { context }) {
    const { content } = attributes;
    const customName = attributes?.metadata?.name;
    const hasContent = content?.trim().length > 0;
    if (context === "list-view" && (customName || hasContent)) {
      return customName || content;
    }
    if (context === "breadcrumb" && customName) {
      return customName;
    }
  }
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
