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

// packages/block-library/src/image/index.js
var image_exports = {};
__export(image_exports, {
  init: () => init,
  metadata: () => import_block.default,
  name: () => name,
  settings: () => settings
});
module.exports = __toCommonJS(image_exports);
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_blocks = require("@wordpress/blocks");
var import_init_block = __toESM(require("../utils/init-block.cjs"));
var import_deprecated = __toESM(require("./deprecated.cjs"));
var import_edit = __toESM(require("./edit.cjs"));
var import_block = __toESM(require("./block.json"));
var import_save = __toESM(require("./save.cjs"));
var import_transforms = __toESM(require("./transforms.cjs"));
var import_lock_unlock = require("../lock-unlock.cjs");
var { fieldsKey, formKey } = (0, import_lock_unlock.unlock)(import_blocks.privateApis);
var { name } = import_block.default;
var settings = {
  icon: import_icons.image,
  example: {
    attributes: {
      sizeSlug: "large",
      url: "https://s.w.org/images/core/5.3/MtBlanc1.jpg",
      // translators: Caption accompanying an image of the Mont Blanc, which serves as an example for the Image block.
      caption: (0, import_i18n.__)("Mont Blanc appears\u2014still, snowy, and serene.")
    }
  },
  __experimentalLabel(attributes, { context }) {
    const customName = attributes?.metadata?.name;
    if ((context === "list-view" || context === "breadcrumb") && customName) {
      return customName;
    }
    if (context === "accessibility") {
      const { caption, alt, url } = attributes;
      if (!url) {
        return (0, import_i18n.__)("Empty");
      }
      if (!alt) {
        return caption || "";
      }
      return alt + (caption ? ". " + caption : "");
    }
  },
  getEditWrapperProps(attributes) {
    return {
      "data-align": attributes.align
    };
  },
  transforms: import_transforms.default,
  edit: import_edit.default,
  save: import_save.default,
  deprecated: import_deprecated.default
};
if (window.__experimentalContentOnlyInspectorFields) {
  settings[fieldsKey] = [
    {
      id: "image",
      label: (0, import_i18n.__)("Image"),
      type: "media",
      Edit: {
        control: "media",
        // TODO: replace with custom component
        allowedTypes: ["image"],
        multiple: false
      },
      getValue: ({ item }) => ({
        id: item.id,
        url: item.url,
        alt: item.alt,
        caption: item.caption
      }),
      setValue: ({ value }) => ({
        id: value.id,
        url: value.url,
        alt: value.alt,
        caption: value.caption
      })
    },
    {
      id: "link",
      label: (0, import_i18n.__)("Link"),
      type: "url",
      Edit: "link",
      // TODO: replace with custom component
      getValue: ({ item }) => ({
        url: item.href,
        rel: item.rel,
        linkTarget: item.linkTarget
      }),
      setValue: ({ value }) => ({
        href: value.url,
        rel: value.rel,
        linkTarget: value.linkTarget
      })
    },
    {
      id: "caption",
      label: (0, import_i18n.__)("Caption"),
      type: "text",
      Edit: "rich-text"
      // TODO: replace with custom component
    },
    {
      id: "alt",
      label: (0, import_i18n.__)("Alt text"),
      type: "text"
    }
  ];
  settings[formKey] = {
    fields: ["image", "link", "caption", "alt"]
  };
}
var init = () => (0, import_init_block.default)({ name, metadata: import_block.default, settings });
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  init,
  metadata,
  name,
  settings
});
//# sourceMappingURL=index.cjs.map
