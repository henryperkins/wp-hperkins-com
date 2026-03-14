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

// packages/block-directory/src/components/downloadable-block-icon/index.js
var downloadable_block_icon_exports = {};
__export(downloadable_block_icon_exports, {
  default: () => downloadable_block_icon_default
});
module.exports = __toCommonJS(downloadable_block_icon_exports);
var import_block_editor = require("@wordpress/block-editor");
var import_jsx_runtime = require("react/jsx-runtime");
function DownloadableBlockIcon({ icon }) {
  const className = "block-directory-downloadable-block-icon";
  return icon.match(/\.(jpeg|jpg|gif|png|svg)(?:\?.*)?$/) !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { className, src: icon, alt: "" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockIcon, { className, icon, showColors: true });
}
var downloadable_block_icon_default = DownloadableBlockIcon;
//# sourceMappingURL=index.cjs.map
