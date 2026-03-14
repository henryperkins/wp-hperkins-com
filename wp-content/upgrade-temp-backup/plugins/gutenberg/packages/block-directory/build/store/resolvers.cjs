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

// packages/block-directory/src/store/resolvers.js
var resolvers_exports = {};
__export(resolvers_exports, {
  getDownloadableBlocks: () => getDownloadableBlocks
});
module.exports = __toCommonJS(resolvers_exports);
var import_change_case = require("change-case");
var import_api_fetch = __toESM(require("@wordpress/api-fetch"));
var import_actions = require("./actions.cjs");
var getDownloadableBlocks = (filterValue) => async ({ dispatch }) => {
  if (!filterValue) {
    return;
  }
  try {
    dispatch((0, import_actions.fetchDownloadableBlocks)(filterValue));
    const results = await (0, import_api_fetch.default)({
      path: `wp/v2/block-directory/search?term=${filterValue}`
    });
    const blocks = results.map(
      (result) => Object.fromEntries(
        Object.entries(result).map(([key, value]) => [
          (0, import_change_case.camelCase)(key),
          value
        ])
      )
    );
    dispatch((0, import_actions.receiveDownloadableBlocks)(blocks, filterValue));
  } catch {
    dispatch((0, import_actions.receiveDownloadableBlocks)([], filterValue));
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getDownloadableBlocks
});
//# sourceMappingURL=resolvers.cjs.map
