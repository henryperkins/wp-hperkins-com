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

// packages/media-utils/src/utils/flatten-form-data.ts
var flatten_form_data_exports = {};
__export(flatten_form_data_exports, {
  flattenFormData: () => flattenFormData
});
module.exports = __toCommonJS(flatten_form_data_exports);
function isPlainObject(data) {
  return data !== null && typeof data === "object" && Object.getPrototypeOf(data) === Object.prototype;
}
function flattenFormData(formData, key, data) {
  if (isPlainObject(data)) {
    for (const [name, value] of Object.entries(data)) {
      flattenFormData(formData, `${key}[${name}]`, value);
    }
  } else if (data !== void 0) {
    formData.append(key, String(data));
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  flattenFormData
});
//# sourceMappingURL=flatten-form-data.cjs.map
