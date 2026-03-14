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

// packages/list-reusable-blocks/src/utils/file.js
var file_exports = {};
__export(file_exports, {
  readTextFile: () => readTextFile
});
module.exports = __toCommonJS(file_exports);
function readTextFile(file) {
  const reader = new window.FileReader();
  return new Promise((resolve) => {
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsText(file);
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  readTextFile
});
//# sourceMappingURL=file.cjs.map
