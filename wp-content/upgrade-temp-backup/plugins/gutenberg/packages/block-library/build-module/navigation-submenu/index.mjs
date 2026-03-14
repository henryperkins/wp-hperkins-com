// packages/block-library/src/navigation-submenu/index.js
import { page, addSubmenu } from "@wordpress/icons";
import { _x, __ } from "@wordpress/i18n";
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
  icon: ({ context }) => {
    if (context === "list-view") {
      return page;
    }
    return addSubmenu;
  },
  __experimentalLabel(attributes, { context }) {
    const { label } = attributes;
    const customName = attributes?.metadata?.name;
    if ((context === "list-view" || context === "breadcrumb") && customName) {
      return customName;
    }
    return label;
  },
  edit,
  example: {
    attributes: {
      label: _x("About", "Example link text for Navigation Submenu"),
      type: "page"
    }
  },
  save,
  transforms
};
if (window.__experimentalContentOnlyInspectorFields) {
  settings[fieldsKey] = [
    {
      id: "label",
      label: __("Label"),
      type: "text",
      Edit: "rich-text"
      //TODO: replace with custom component
    },
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
    }
  ];
  settings[formKey] = {
    fields: ["label", "link"]
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
