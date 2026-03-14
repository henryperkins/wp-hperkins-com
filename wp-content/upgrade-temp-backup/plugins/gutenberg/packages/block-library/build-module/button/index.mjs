// packages/block-library/src/button/index.js
import { __ } from "@wordpress/i18n";
import { button as icon } from "@wordpress/icons";
import { privateApis as blocksPrivateApis } from "@wordpress/blocks";
import initBlock from "../utils/init-block.mjs";
import deprecated from "./deprecated.mjs";
import edit from "./edit.mjs";
import metadata from "./block.json";
import save from "./save.mjs";
import { unlock } from "../lock-unlock.mjs";
var { fieldsKey, formKey } = unlock(blocksPrivateApis);
var { name } = metadata;
var settings = {
  icon,
  example: {
    attributes: {
      className: "is-style-fill",
      text: __("Call to action")
    }
  },
  edit,
  save,
  deprecated,
  merge: (a, { text = "" }) => ({
    ...a,
    text: (a.text || "") + text
  }),
  __experimentalLabel(attributes, { context }) {
    const { text } = attributes;
    const customName = attributes?.metadata?.name;
    const hasContent = text?.trim().length > 0;
    if (context === "list-view" && (customName || hasContent)) {
      return customName || text;
    }
    if (context === "breadcrumb" && customName) {
      return customName;
    }
  }
};
if (window.__experimentalContentOnlyInspectorFields) {
  settings[fieldsKey] = [
    {
      id: "text",
      label: __("Content"),
      type: "text",
      Edit: "rich-text"
      // TODO: replace with custom component
    },
    {
      id: "link",
      label: __("Link"),
      type: "url",
      Edit: "link",
      // TODO: replace with custom component
      getValue: ({ item }) => ({
        url: item.url,
        rel: item.rel,
        linkTarget: item.linkTarget
      }),
      setValue: ({ value }) => ({
        url: value.url,
        rel: value.rel,
        linkTarget: value.linkTarget
      })
    }
  ];
  settings[formKey] = {
    fields: ["text", "link"]
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
