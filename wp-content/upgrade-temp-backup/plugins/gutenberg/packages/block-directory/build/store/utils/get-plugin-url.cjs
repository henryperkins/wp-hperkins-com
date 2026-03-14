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

// packages/block-directory/src/store/utils/get-plugin-url.js
var get_plugin_url_exports = {};
__export(get_plugin_url_exports, {
  default: () => getPluginUrl
});
module.exports = __toCommonJS(get_plugin_url_exports);
function getPluginUrl(block) {
  if (!block) {
    return false;
  }
  const link = block.links["wp:plugin"] || block.links.self;
  if (link && link.length) {
    return link[0].href;
  }
  return false;
}
//# sourceMappingURL=get-plugin-url.cjs.map
