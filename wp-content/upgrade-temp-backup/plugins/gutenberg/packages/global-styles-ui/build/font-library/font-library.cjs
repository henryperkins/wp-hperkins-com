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

// packages/global-styles-ui/src/font-library/font-library.tsx
var font_library_exports = {};
__export(font_library_exports, {
  FontLibrary: () => FontLibrary
});
module.exports = __toCommonJS(font_library_exports);
var import_provider = require("../provider.cjs");
var import_context = __toESM(require("./context.cjs"));
var import_installed_fonts = __toESM(require("./installed-fonts.cjs"));
var import_upload_fonts = __toESM(require("./upload-fonts.cjs"));
var import_font_collection = __toESM(require("./font-collection.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function FontLibrary({
  value,
  baseValue,
  onChange,
  activeTab = "installed-fonts"
}) {
  let content;
  switch (activeTab) {
    case "upload-fonts":
      content = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_upload_fonts.default, {});
      break;
    case "installed-fonts":
      content = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_installed_fonts.default, {});
      break;
    default:
      content = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_font_collection.default, { slug: activeTab });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_provider.GlobalStylesProvider,
    {
      value,
      baseValue,
      onChange,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_context.default, { children: content })
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FontLibrary
});
//# sourceMappingURL=font-library.cjs.map
