// packages/image-cropper/src/provider/use-image-cropper.ts
import { dequal } from "dequal";
import { useMemo, useState, useCallback } from "@wordpress/element";
import { MIN_ZOOM } from "../constants.mjs";
import {
  getCroppedImage as getCroppedImageUtil,
  normalizeRotation
} from "../utils.mjs";
var DEFAULT_INITIAL_STATE = {
  crop: {
    x: 0,
    y: 0,
    width: 100,
    height: 100
  },
  zoom: MIN_ZOOM,
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
  const [cropperState, setInternalCropperState] = useState(
    DEFAULT_CROPPER_STATE
  );
  const [resetState, setInternalResetState] = useState(null);
  const setCropperState = useCallback(
    (newState) => {
      setInternalCropperState((prev) => {
        const updates = typeof newState === "function" ? newState(prev) : newState;
        const normalizedUpdates = { ...updates };
        if ("rotation" in normalizedUpdates && normalizedUpdates.rotation !== void 0) {
          normalizedUpdates.rotation = normalizeRotation(
            normalizedUpdates.rotation
          );
        }
        return { ...prev, ...normalizedUpdates };
      });
    },
    []
  );
  const setResetState = useCallback(
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
  const reset = useCallback(() => {
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
  const isDirty = useMemo(() => {
    if (resetState) {
      const currentState2 = {
        crop: cropperState.croppedAreaPixels || cropperState.croppedArea,
        zoom: cropperState.zoom,
        rotation: normalizeRotation(cropperState.rotation),
        aspectRatio: cropperState.aspectRatio,
        flip: cropperState.flip
      };
      return false === dequal(currentState2, resetState);
    }
    const currentState = {
      crop: cropperState.croppedArea,
      zoom: cropperState.zoom,
      rotation: normalizeRotation(cropperState.rotation),
      aspectRatio: cropperState.aspectRatio,
      flip: cropperState.flip
    };
    return false === dequal(currentState, DEFAULT_INITIAL_STATE);
  }, [cropperState, resetState]);
  const getCroppedImage = useCallback(
    async (src) => {
      if (!cropperState.croppedAreaPixels) {
        return null;
      }
      return getCroppedImageUtil(
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
  return useMemo(
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
export {
  DEFAULT_INITIAL_STATE,
  useCropper as default
};
//# sourceMappingURL=use-image-cropper.mjs.map
