"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/fields/src/fields/featured-image/index.tsx
var featured_image_exports = {};
__export(featured_image_exports, {
  default: () => featured_image_default
});
module.exports = __toCommonJS(featured_image_exports);
var import_i18n = require("@wordpress/i18n");
var import_media_edit = __toESM(require("../../components/media-edit/index.cjs"));
var import_featured_image_view = require("./featured-image-view.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var featuredImageField = {
  id: "featured_media",
  type: "media",
  label: (0, import_i18n.__)("Featured Image"),
  Edit: (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_media_edit.default, { ...props, isExpanded: true }),
  render: import_featured_image_view.FeaturedImageView,
  setValue: ({ value }) => ({
    featured_media: value ?? 0
  }),
  enableSorting: false,
  filterBy: false
};
var featured_image_default = featuredImageField;
//# sourceMappingURL=index.cjs.map
