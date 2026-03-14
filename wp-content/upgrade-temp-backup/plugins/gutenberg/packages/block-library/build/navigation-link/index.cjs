"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-library/src/navigation-link/index.js
var navigation_link_exports = {};
__export(navigation_link_exports, {
  init: () => init,
  metadata: () => import_block.default,
  name: () => name,
  settings: () => settings
});
module.exports = __toCommonJS(navigation_link_exports);
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_block_editor = require("@wordpress/block-editor");
var import_hooks = require("@wordpress/hooks");
var import_blocks = require("@wordpress/blocks");
var import_init_block = __toESM(require("../utils/init-block.cjs"));
var import_block = __toESM(require("./block.json"));
var import_edit = __toESM(require("./edit.cjs"));
var import_save = __toESM(require("./save.cjs"));
var import_hooks2 = require("./hooks.cjs");
var import_transforms = __toESM(require("./transforms.cjs"));
var import_lock_unlock = require("../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { fieldsKey, formKey } = (0, import_lock_unlock.unlock)(import_blocks.privateApis);
var { name } = import_block.default;
var settings = {
  icon: import_icons.customLink,
  __experimentalLabel(attributes, { context }) {
    if (context === "list-view") {
      return attributes?.label;
    }
    if (context === "appender") {
      const type = attributes?.type || "link";
      return (0, import_i18n.sprintf)(
        /* translators: %s: block type (e.g., 'page', 'post', 'category') */
        (0, import_i18n._x)("Add %s", "add default block type"),
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
  edit: import_edit.default,
  save: import_save.default,
  example: {
    attributes: {
      label: (0, import_i18n._x)("Example Link", "navigation link preview example"),
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
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.InnerBlocks.Content, {});
      }
    }
  ],
  transforms: import_transforms.default
};
if (window.__experimentalContentOnlyInspectorFields) {
  settings[fieldsKey] = [
    {
      id: "label",
      label: (0, import_i18n.__)("Label"),
      type: "text",
      Edit: "rich-text"
    },
    {
      id: "link",
      label: (0, import_i18n.__)("Link"),
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
  (0, import_hooks.addFilter)(
    "blocks.registerBlockType",
    "core/navigation-link",
    import_hooks2.enhanceNavigationLinkVariations
  );
  return (0, import_init_block.default)({ name, metadata: import_block.default, settings });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  init,
  metadata,
  name,
  settings
});
//# sourceMappingURL=index.cjs.map
