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

// packages/image-cropper/src/provider/use-image-cropper.ts
var use_image_cropper_exports = {};
__export(use_image_cropper_exports, {
  DEFAULT_INITIAL_STATE: () => DEFAULT_INITIAL_STATE,
  default: () => useCropper
});
module.exports = __toCommonJS(use_image_cropper_exports);
var import_dequal = require("dequal");
var import_element = require("@wordpress/element");
var import_constants = require("../constants.cjs");
var import_utils = require("../utils.cjs");
var DEFAULT_INITIAL_STATE = {
  crop: {
    x: 0,
    y: 0,
    width: 100,
    height: 100
  },
  zoom: import_constants.MIN_ZOOM,
  rotation: 0,
  aspectRatio: 1,
  flip: {
    horizontal: false,
    vertical: false
  }
};
var DEFAULT_CROP_MEDIA_POSITION = {
  x: 0,
  y: 0
};
var DEFAULT_CROPPER_STATE = {
  crop: DEFAULT_CROP_MEDIA_POSITION,
  croppedArea: DEFAULT_INITIAL_STATE.crop,
  croppedAreaPixels: null,
  zoom: DEFAULT_INITIAL_STATE.zoom,
  rotation: DEFAULT_INITIAL_STATE.rotation,
  flip: DEFAULT_INITIAL_STATE.flip,
  aspectRatio: DEFAULT_INITIAL_STATE.aspectRatio,
  mediaSize: null
};
function useCropper() {
  const [cropperState, setInternalCropperState] = (0, import_element.useState)(
    DEFAULT_CROPPER_STATE
  );
  const [resetState, setInternalResetState] = (0, import_element.useState)(null);
  const setCropperState = (0, import_element.useCallback)(
    (newState) => {
      setInternalCropperState((prev) => {
        const updates = typeof newState === "function" ? newState(prev) : newState;
        const normalizedUpdates = { ...updates };
        if ("rotation" in normalizedUpdates && normalizedUpdates.rotation !== void 0) {
          normalizedUpdates.rotation = (0, import_utils.normalizeRotation)(
            normalizedUpdates.rotation
          );
        }
        return { ...prev, ...normalizedUpdates };
      });
    },
    []
  );
  const setResetState = (0, import_element.useCallback)(
    (newResetState = null) => {
      if (!newResetState) {
        setInternalResetState(null);
        setCropperState(DEFAULT_CROPPER_STATE);
        return;
      }
      if (typeof newResetState === "object") {
        const initialState = {
          ...DEFAULT_INITIAL_STATE,
          ...newResetState
        };
        setInternalResetState(initialState);
        setCropperState(initialState);
      }
    },
    [setCropperState, setInternalResetState]
  );
  const reset = (0, import_element.useCallback)(() => {
    if (resetState) {
      const resetUpdates = {
        // Reset media position to center
        crop: { x: 0, y: 0 },
        // Reset cropped area pixels (will be recalculated)
        croppedAreaPixels: null
      };
      if (resetState.crop) {
        resetUpdates.croppedArea = resetState.crop;
      }
      if (resetState.zoom !== void 0) {
        resetUpdates.zoom = resetState.zoom;
      }
      if (resetState.rotation !== void 0) {
        resetUpdates.rotation = resetState.rotation;
      }
      if (resetState.aspectRatio !== void 0) {
        resetUpdates.aspectRatio = resetState.aspectRatio;
      }
      if (resetState.flip !== void 0) {
        resetUpdates.flip = resetState.flip;
      }
      setCropperState(resetUpdates);
    } else {
      setCropperState({ ...DEFAULT_CROPPER_STATE });
    }
  }, [resetState, setCropperState]);
  const isDirty = (0, import_element.useMemo)(() => {
    if (resetState) {
      const currentState2 = {
        crop: cropperState.croppedAreaPixels || cropperState.croppedArea,
        zoom: cropperState.zoom,
        rotation: (0, import_utils.normalizeRotation)(cropperState.rotation),
        aspectRatio: cropperState.aspectRatio,
        flip: cropperState.flip
      };
      return false === (0, import_dequal.dequal)(currentState2, resetState);
    }
    const currentState = {
      crop: cropperState.croppedArea,
      zoom: cropperState.zoom,
      rotation: (0, import_utils.normalizeRotation)(cropperState.rotation),
      aspectRatio: cropperState.aspectRatio,
      flip: cropperState.flip
    };
    return false === (0, import_dequal.dequal)(currentState, DEFAULT_INITIAL_STATE);
  }, [cropperState, resetState]);
  const getCroppedImage = (0, import_element.useCallback)(
    async (src) => {
      if (!cropperState.croppedAreaPixels) {
        return null;
      }
      return (0, import_utils.getCroppedImage)(
        src,
        cropperState.croppedAreaPixels,
        cropperState.rotation,
        cropperState.flip
      );
    },
    [
      cropperState.croppedAreaPixels,
      cropperState.rotation,
      cropperState.flip
    ]
  );
  return (0, import_element.useMemo)(
    () => ({
      cropperState,
      setCropperState,
      resetState,
      setResetState,
      isDirty,
      reset,
      getCroppedImage
    }),
    [
      cropperState,
      setCropperState,
      resetState,
      setResetState,
      isDirty,
      reset,
      getCroppedImage
    ]
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DEFAULT_INITIAL_STATE
});
//# sourceMappingURL=use-image-cropper.cjs.map
