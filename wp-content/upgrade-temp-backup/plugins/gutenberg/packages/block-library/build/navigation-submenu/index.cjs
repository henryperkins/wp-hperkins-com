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

// packages/block-library/src/navigation-submenu/index.js
var navigation_submenu_exports = {};
__export(navigation_submenu_exports, {
  init: () => init,
  metadata: () => import_block.default,
  name: () => name,
  settings: () => settings
});
module.exports = __toCommonJS(navigation_submenu_exports);
var import_icons = require("@wordpress/icons");
var import_i18n = require("@wordpress/i18n");
var import_blocks = require("@wordpress/blocks");
var import_init_block = __toESM(require("../utils/init-block.cjs"));
var import_block = __toESM(require("./block.json"));
var import_edit = __toESM(require("./edit.cjs"));
var import_save = __toESM(require("./save.cjs"));
var import_transforms = __toESM(require("./transforms.cjs"));
var import_lock_unlock = require("../lock-unlock.cjs");
var { fieldsKey, formKey } = (0, import_lock_unlock.unlock)(import_blocks.privateApis);
var { name } = import_block.default;
var settings = {
  icon: ({ context }) => {
    if (context === "list-view") {
      return import_icons.page;
    }
    return import_icons.addSubmenu;
  },
  __experimentalLabel(attributes, { context }) {
    const { label } = attributes;
    const customName = attributes?.metadata?.name;
    if ((context === "list-view" || context === "breadcrumb") && customName) {
      return customName;
    }
    return label;
  },
  edit: import_edit.default,
  example: {
    attributes: {
      label: (0, import_i18n._x)("About", "Example link text for Navigation Submenu"),
      type: "page"
    }
  },
  save: import_save.default,
  transforms: import_transforms.default
};
if (window.__experimentalContentOnlyInspectorFields) {
  settings[fieldsKey] = [
    {
      id: "label",
      label: (0, import_i18n.__)("Label"),
      type: "text",
      Edit: "rich-text"
      //TODO: replace with custom component
    },
    {
      id: "link",
      label: (0, import_i18n.__)("Link"),
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
var init = () => (0, import_init_block.default)({ name, metadata: import_block.default, settings });
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  init,
  metadata,
  name,
  settings
});
//# sourceMappingURL=index.cjs.map
