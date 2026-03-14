// packages/block-library/src/navigation-link/index.js
import { _x, __, sprintf } from "@wordpress/i18n";
import { customLink as linkIcon } from "@wordpress/icons";
import { InnerBlocks } from "@wordpress/block-editor";
import { addFilter } from "@wordpress/hooks";
import { privateApis as blocksPrivateApis } from "@wordpress/blocks";
import initBlock from "../utils/init-block.mjs";
import metadata from "./block.json";
import edit from "./edit.mjs";
import save from "./save.mjs";
import { enhanceNavigationLinkVariations } from "./hooks.mjs";
import transforms from "./transforms.mjs";
import { unlock } from "../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var { fieldsKey, formKey } = unlock(blocksPrivateApis);
var { name } = metadata;
var settings = {
  icon: linkIcon,
  __experimentalLabel(attributes, { context }) {
    if (context === "list-view") {
      return attributes?.label;
    }
    if (context === "appender") {
      const type = attributes?.type || "link";
      return sprintf(
        /* translators: %s: block type (e.g., 'page', 'post', 'category') */
        _x("Add %s", "add default block type"),
        type
      );
    }
    return attributes?.label;
  },
  merge(leftAttributes, { label: rightLabel = "" }) {
    return {
      ...leftAttributes,
      label: leftAttributes.label + rightLabel
    };
  },
  edit,
  save,
  example: {
    attributes: {
      label: _x("Example Link", "navigation link preview example"),
      url: "https://example.com"
    }
  },
  deprecated: [
    {
      isEligible(attributes) {
        return attributes.nofollow;
      },
      attributes: {
        label: {
          type: "string"
        },
        type: {
          type: "string"
        },
        nofollow: {
          type: "boolean"
        },
        description: {
          type: "string"
        },
        id: {
          type: "number"
        },
        opensInNewTab: {
          type: "boolean",
          default: false
        },
        url: {
          type: "string"
        }
      },
      migrate({ nofollow, ...rest }) {
        return {
          rel: nofollow ? "nofollow" : "",
          ...rest
        };
      },
      save() {
        return /* @__PURE__ */ jsx(InnerBlocks.Content, {});
      }
    }
  ],
  transforms
};
if (window.__experimentalContentOnlyInspectorFields) {
  settings[fieldsKey] = [
    {
      id: "label",
      label: __("Label"),
      type: "text",
      Edit: "rich-text"
    },
    {
      id: "link",
      label: __("Link"),
      type: "url",
      Edit: "link",
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
var init = () => {
  addFilter(
    "blocks.registerBlockType",
    "core/navigation-link",
    enhanceNavigationLinkVariations
  );
  return initBlock({ name, metadata, settings });
};
export {
  init,
  metadata,
  name,
  settings
};
//# sourceMappingURL=index.mjs.map
