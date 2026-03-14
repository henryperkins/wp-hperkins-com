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

// packages/fields/src/fields/slug/slug-view.tsx
var slug_view_exports = {};
__export(slug_view_exports, {
  default: () => slug_view_default
});
module.exports = __toCommonJS(slug_view_exports);
var import_element = require("@wordpress/element");
var import_utils = require("./utils.cjs");
var SlugView = ({ item }) => {
  const slug = (0, import_utils.getSlug)(item);
  const originalSlugRef = (0, import_element.useRef)(slug);
  (0, import_element.useEffect)(() => {
    if (slug && originalSlugRef.current === void 0) {
      originalSlugRef.current = slug;
    }
  }, [slug]);
  const slugToDisplay = slug || originalSlugRef.current;
  return `${slugToDisplay}`;
};
var slug_view_default = SlugView;
//# sourceMappingURL=slug-view.cjs.map
