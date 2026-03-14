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

// packages/block-directory/src/components/downloadable-block-notice/index.js
var downloadable_block_notice_exports = {};
__export(downloadable_block_notice_exports, {
  DownloadableBlockNotice: () => DownloadableBlockNotice,
  default: () => downloadable_block_notice_default
});
module.exports = __toCommonJS(downloadable_block_notice_exports);
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var DownloadableBlockNotice = ({ block }) => {
  const errorNotice = (0, import_data.useSelect)(
    (select) => select(import_store.store).getErrorNoticeForBlock(block.id),
    [block]
  );
  if (!errorNotice) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "block-directory-downloadable-block-notice", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "block-directory-downloadable-block-notice__content", children: [
    errorNotice.message,
    errorNotice.isFatal ? " " + (0, import_i18n.__)("Try reloading the page.") : null
  ] }) });
};
var downloadable_block_notice_default = DownloadableBlockNotice;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DownloadableBlockNotice
});
//# sourceMappingURL=index.cjs.map
