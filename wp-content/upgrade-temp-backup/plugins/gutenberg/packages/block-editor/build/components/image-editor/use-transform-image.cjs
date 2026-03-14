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

// packages/block-editor/src/components/image-editor/use-transform-image.js
var use_transform_image_exports = {};
__export(use_transform_image_exports, {
  default: () => useTransformImage
});
module.exports = __toCommonJS(use_transform_image_exports);
var import_element = require("@wordpress/element");
var import_hooks = require("@wordpress/hooks");
var import_image_cropper = require("@wordpress/image-cropper");
function useTransformImage({
  url,
  naturalWidth,
  naturalHeight
}) {
  const [editedUrl, setEditedUrl] = (0, import_element.useState)();
  const { cropperState, setCropperState } = (0, import_image_cropper.useImageCropper)();
  const { zoom, aspectRatio, crop, croppedArea } = cropperState;
  const setZoom = (0, import_element.useCallback)(
    (newZoom) => {
      setCropperState({ zoom: newZoom });
    },
    [setCropperState]
  );
  const setAspectRatio = (0, import_element.useCallback)(
    (newAspect) => {
      setCropperState({ aspectRatio: newAspect });
    },
    [setCropperState]
  );
  const defaultAspect = naturalWidth / naturalHeight;
  const rotatedAspect = naturalHeight / naturalWidth;
  (0, import_element.useEffect)(() => {
    setAspectRatio(defaultAspect);
  }, []);
  const [internalRotation, setInternalRotation] = (0, import_element.useState)(0);
  const rotateClockwise = (0, import_element.useCallback)(() => {
    const angle = (internalRotation + 90) % 360;
    let naturalAspectRatio = defaultAspect;
    const isDefaultAspect = defaultAspect === aspectRatio || rotatedAspect === aspectRatio;
    const shouldResetAspect = zoom !== 1 || !isDefaultAspect;
    if (internalRotation % 180 === 90) {
      naturalAspectRatio = 1 / defaultAspect;
    }
    if (angle === 0) {
      setEditedUrl();
      setInternalRotation(angle);
      const newAspectRatio = shouldResetAspect ? aspectRatio : defaultAspect;
      setCropperState({
        aspectRatio: newAspectRatio,
        crop: {
          x: -(crop.y * naturalAspectRatio),
          y: crop.x * naturalAspectRatio
        }
      });
      return;
    }
    function editImage(event) {
      const canvas = document.createElement("canvas");
      let translateX = 0;
      let translateY = 0;
      if (angle % 180) {
        canvas.width = event.target.height;
        canvas.height = event.target.width;
      } else {
        canvas.width = event.target.width;
        canvas.height = event.target.height;
      }
      if (angle === 90 || angle === 180) {
        translateX = canvas.width;
      }
      if (angle === 270 || angle === 180) {
        translateY = canvas.height;
      }
      const context = canvas.getContext("2d");
      context.translate(translateX, translateY);
      context.rotate(angle * Math.PI / 180);
      context.drawImage(event.target, 0, 0);
      canvas.toBlob((blob) => {
        setEditedUrl(URL.createObjectURL(blob));
        setInternalRotation(angle);
        const newAspectRatio = shouldResetAspect ? aspectRatio : canvas.width / canvas.height;
        setCropperState({
          aspectRatio: newAspectRatio,
          crop: {
            x: -(crop.y * naturalAspectRatio),
            y: crop.x * naturalAspectRatio
          }
        });
      });
    }
    const el = new window.Image();
    el.src = url;
    el.onload = editImage;
    const imgCrossOrigin = (0, import_hooks.applyFilters)(
      "media.crossOrigin",
      void 0,
      url
    );
    if (typeof imgCrossOrigin === "string") {
      el.crossOrigin = imgCrossOrigin;
    }
  }, [
    internalRotation,
    defaultAspect,
    url,
    setCropperState,
    crop,
    zoom,
    aspectRatio,
    rotatedAspect,
    setInternalRotation
  ]);
  return (0, import_element.useMemo)(
    () => ({
      editedUrl,
      setEditedUrl,
      crop: croppedArea,
      zoom,
      setZoom,
      rotation: internalRotation,
      rotateClockwise,
      aspect: aspectRatio,
      setAspect: setAspectRatio,
      defaultAspect
    }),
    [
      editedUrl,
      croppedArea,
      zoom,
      setZoom,
      internalRotation,
      rotateClockwise,
      aspectRatio,
      setAspectRatio,
      defaultAspect
    ]
  );
}
//# sourceMappingURL=use-transform-image.cjs.map
