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

// packages/list-reusable-blocks/src/utils/import.js
var import_exports = {};
__export(import_exports, {
  default: () => import_default
});
module.exports = __toCommonJS(import_exports);
var import_api_fetch = __toESM(require("@wordpress/api-fetch"));
var import_file = require("./file.cjs");
async function importReusableBlock(file) {
  const fileContent = await (0, import_file.readTextFile)(file);
  let parsedContent;
  try {
    parsedContent = JSON.parse(fileContent);
  } catch (e) {
    throw new Error("Invalid JSON file");
  }
  if (parsedContent.__file !== "wp_block" || !parsedContent.title || !parsedContent.content || typeof parsedContent.title !== "string" || typeof parsedContent.content !== "string" || parsedContent.syncStatus && typeof parsedContent.syncStatus !== "string") {
    throw new Error("Invalid pattern JSON file");
  }
  const postType = await (0, import_api_fetch.default)({ path: `/wp/v2/types/wp_block` });
  const reusableBlock = await (0, import_api_fetch.default)({
    path: `/wp/v2/${postType.rest_base}`,
    data: {
      title: parsedContent.title,
      content: parsedContent.content,
      status: "publish",
      meta: parsedContent.syncStatus === "unsynced" ? { wp_pattern_sync_status: parsedContent.syncStatus } : void 0
    },
    method: "POST"
  });
  return reusableBlock;
}
var import_default = importReusableBlock;
//# sourceMappingURL=import.cjs.map
