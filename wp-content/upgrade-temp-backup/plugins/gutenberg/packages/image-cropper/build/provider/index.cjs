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

// packages/image-cropper/src/provider/index.tsx
var provider_exports = {};
__export(provider_exports, {
  ImageCropperContext: () => ImageCropperContext,
  default: () => ImageCropperProvider,
  useImageCropper: () => useImageCropper
});
module.exports = __toCommonJS(provider_exports);
var import_element = require("@wordpress/element");
var import_use_image_cropper = __toESM(require("./use-image-cropper.cjs"));
var import_constants = require("../constants.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var ImageCropperContext = (0, import_element.createContext)({
  cropperState: {
    crop: { x: 0, y: 0 },
    croppedArea: { x: 0, y: 0, width: 100, height: 100 },
    croppedAreaPixels: null,
    zoom: import_constants.MIN_ZOOM,
    rotation: 0,
    aspectRatio: 1,
    flip: { horizontal: false, vertical: false },
    mediaSize: null
  },
  setCropperState: () => {
  },
  resetState: null,
  setResetState: () => {
  },
  isDirty: false,
  reset: () => {
  },
  getCroppedImage: () => Promise.resolve(null)
});
function ImageCropperProvider({
  children
}) {
  const cropperApi = (0, import_use_image_cropper.default)();
  const contextValue = (0, import_element.useMemo)(() => {
    return {
      ...cropperApi
    };
  }, [cropperApi]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageCropperContext.Provider, { value: contextValue, children });
}
var useImageCropper = () => {
  const context = (0, import_element.useContext)(ImageCropperContext);
  if (!context) {
    throw new Error("Missing ImageCropperContext");
  }
  return context;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ImageCropperContext,
  useImageCropper
});
//# sourceMappingURL=index.cjs.map
