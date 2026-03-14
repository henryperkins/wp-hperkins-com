"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/fields/src/fields/status/status-elements.tsx
var status_elements_exports = {};
__export(status_elements_exports, {
  default: () => status_elements_default
});
module.exports = __toCommonJS(status_elements_exports);
var import_icons = require("@wordpress/icons");
var import_i18n = require("@wordpress/i18n");
var STATUSES = [
  {
    value: "draft",
    label: (0, import_i18n.__)("Draft"),
    icon: import_icons.drafts,
    description: (0, import_i18n.__)("Not ready to publish.")
  },
  {
    value: "future",
    label: (0, import_i18n.__)("Scheduled"),
    icon: import_icons.scheduled,
    description: (0, import_i18n.__)("Publish automatically on a chosen date.")
  },
  {
    value: "pending",
    label: (0, import_i18n.__)("Pending Review"),
    icon: import_icons.pending,
    description: (0, import_i18n.__)("Waiting for review before publishing.")
  },
  {
    value: "private",
    label: (0, import_i18n.__)("Private"),
    icon: import_icons.notAllowed,
    description: (0, import_i18n.__)("Only visible to site admins and editors.")
  },
  {
    value: "publish",
    label: (0, import_i18n.__)("Published"),
    icon: import_icons.published,
    description: (0, import_i18n.__)("Visible to everyone.")
  },
  { value: "trash", label: (0, import_i18n.__)("Trash"), icon: import_icons.trash }
];
var status_elements_default = STATUSES;
//# sourceMappingURL=status-elements.cjs.map
