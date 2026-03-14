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

// packages/block-directory/src/store/load-assets.js
var load_assets_exports = {};
__export(load_assets_exports, {
  loadAsset: () => loadAsset,
  loadAssets: () => loadAssets
});
module.exports = __toCommonJS(load_assets_exports);
var import_api_fetch = __toESM(require("@wordpress/api-fetch"));
var loadAsset = (el) => {
  return new Promise((resolve, reject) => {
    const newNode = document.createElement(el.nodeName);
    ["id", "rel", "src", "href", "type"].forEach((attr) => {
      if (el[attr]) {
        newNode[attr] = el[attr];
      }
    });
    if (el.innerHTML) {
      newNode.appendChild(document.createTextNode(el.innerHTML));
    }
    newNode.onload = () => resolve(true);
    newNode.onerror = () => reject(new Error("Error loading asset."));
    document.body.appendChild(newNode);
    if ("link" === newNode.nodeName.toLowerCase() || "script" === newNode.nodeName.toLowerCase() && !newNode.src) {
      resolve();
    }
  });
};
async function loadAssets() {
  const response = await (0, import_api_fetch.default)({
    url: document.location.href,
    parse: false
  });
  const data = await response.text();
  const doc = new window.DOMParser().parseFromString(data, "text/html");
  const newAssets = Array.from(
    doc.querySelectorAll('link[rel="stylesheet"],script')
  ).filter((asset) => asset.id && !document.getElementById(asset.id));
  for (const newAsset of newAssets) {
    await loadAsset(newAsset);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  loadAsset,
  loadAssets
});
//# sourceMappingURL=load-assets.cjs.map
