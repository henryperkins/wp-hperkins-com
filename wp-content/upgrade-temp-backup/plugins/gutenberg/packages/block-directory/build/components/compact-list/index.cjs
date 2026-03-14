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

// packages/block-directory/src/components/compact-list/index.js
var compact_list_exports = {};
__export(compact_list_exports, {
  default: () => CompactList
});
module.exports = __toCommonJS(compact_list_exports);
var import_i18n = require("@wordpress/i18n");
var import_downloadable_block_icon = __toESM(require("../downloadable-block-icon/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function CompactList({ items }) {
  if (!items.length) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { className: "block-directory-compact-list", children: items.map(({ icon, id, title, author }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { className: "block-directory-compact-list__item", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_downloadable_block_icon.default, { icon, title }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "block-directory-compact-list__item-details", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "block-directory-compact-list__item-title", children: title }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "block-directory-compact-list__item-author", children: (0, import_i18n.sprintf)(
        /* translators: %s: Name of the block author. */
        (0, import_i18n.__)("By %s"),
        author
      ) })
    ] })
  ] }, id)) });
}
//# sourceMappingURL=index.cjs.map
