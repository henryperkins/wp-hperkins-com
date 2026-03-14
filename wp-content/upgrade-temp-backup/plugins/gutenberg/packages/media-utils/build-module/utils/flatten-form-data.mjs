// packages/media-utils/src/utils/flatten-form-data.ts
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
export {
  flattenFormData
};
//# sourceMappingURL=flatten-form-data.mjs.map
