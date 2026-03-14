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

// packages/interface/src/store/deprecated.js
var deprecated_exports = {};
__export(deprecated_exports, {
  normalizeComplementaryAreaName: () => normalizeComplementaryAreaName,
  normalizeComplementaryAreaScope: () => normalizeComplementaryAreaScope
});
module.exports = __toCommonJS(deprecated_exports);
var import_deprecated = __toESM(require("@wordpress/deprecated"));
function normalizeComplementaryAreaScope(scope) {
  if (["core/edit-post", "core/edit-site"].includes(scope)) {
    (0, import_deprecated.default)(`${scope} interface scope`, {
      alternative: "core interface scope",
      hint: "core/edit-post and core/edit-site are merging.",
      version: "6.6"
    });
    return "core";
  }
  return scope;
}
function normalizeComplementaryAreaName(scope, name) {
  if (scope === "core" && name === "edit-site/template") {
    (0, import_deprecated.default)(`edit-site/template sidebar`, {
      alternative: "edit-post/document",
      version: "6.6"
    });
    return "edit-post/document";
  }
  if (scope === "core" && name === "edit-site/block-inspector") {
    (0, import_deprecated.default)(`edit-site/block-inspector sidebar`, {
      alternative: "edit-post/block",
      version: "6.6"
    });
    return "edit-post/block";
  }
  return name;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  normalizeComplementaryAreaName,
  normalizeComplementaryAreaScope
});
//# sourceMappingURL=deprecated.cjs.map
