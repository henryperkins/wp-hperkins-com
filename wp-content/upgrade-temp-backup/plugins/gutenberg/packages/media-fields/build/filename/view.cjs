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

// packages/media-fields/src/filename/view.tsx
var view_exports = {};
__export(view_exports, {
  default: () => FileNameView
});
module.exports = __toCommonJS(view_exports);
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_url = require("@wordpress/url");
var import_jsx_runtime = require("react/jsx-runtime");
var TRUNCATE_LENGTH = 15;
function FileNameView({
  item
}) {
  const fileName = (0, import_element.useMemo)(
    () => item?.source_url ? (0, import_url.getFilename)(item.source_url) : null,
    [item?.source_url]
  );
  if (!fileName) {
    return "";
  }
  return fileName.length > TRUNCATE_LENGTH ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Tooltip, { text: fileName, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalTruncate, { limit: TRUNCATE_LENGTH, ellipsizeMode: "tail", children: fileName }) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: fileName });
}
//# sourceMappingURL=view.cjs.map
