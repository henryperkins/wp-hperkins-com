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

// packages/image-cropper/src/components/image-cropper/index.tsx
var image_cropper_exports = {};
__export(image_cropper_exports, {
  default: () => ImageCropper
});
module.exports = __toCommonJS(image_cropper_exports);
var import_react_easy_crop = __toESM(require("react-easy-crop"));
var import_element = require("@wordpress/element");
var import_provider = require("../../provider/index.cjs");
var import_constants = require("../../constants.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function ImageCropper({
  src,
  onLoad,
  minZoom = import_constants.MIN_ZOOM,
  maxZoom = import_constants.MAX_ZOOM,
  ...props
}) {
  const { cropperState, setCropperState } = (0, import_provider.useImageCropper)();
  const { crop, zoom, rotation, aspectRatio, flip } = cropperState;
  const setCrop = (newCrop) => setCropperState({ crop: newCrop });
  const setZoom = (newZoom) => setCropperState({ zoom: newZoom });
  const setRotation = (newRotation) => setCropperState({ rotation: newRotation });
  const setMediaSize = (newMediaSize) => setCropperState({ mediaSize: newMediaSize });
  const onCropComplete = (0, import_element.useCallback)(
    (areaPercentage, areaPixels) => {
      setCropperState({
        croppedArea: areaPercentage,
        croppedAreaPixels: areaPixels
      });
    },
    [setCropperState]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_react_easy_crop.default,
    {
      classes: {
        containerClassName: "image-cropper__container",
        cropAreaClassName: "image-cropper__crop-area",
        mediaClassName: "image-cropper__image"
      },
      minZoom,
      maxZoom,
      rotation,
      image: src,
      setMediaSize,
      crop,
      zoom,
      aspect: aspectRatio,
      onCropChange: setCrop,
      onZoomChange: setZoom,
      onCropComplete,
      onMediaLoaded: (loadedMediaSize) => {
        onLoad?.(loadedMediaSize);
      },
      onRotationChange: setRotation,
      transform: [
        `translate(${crop.x}px, ${crop.y}px)`,
        `rotateZ(${rotation}deg)`,
        `rotateY(${flip.horizontal ? 180 : 0}deg)`,
        `rotateX(${flip.vertical ? 180 : 0}deg)`,
        `scale(${zoom})`
      ].join(" "),
      ...props
    }
  );
}
//# sourceMappingURL=index.cjs.map
