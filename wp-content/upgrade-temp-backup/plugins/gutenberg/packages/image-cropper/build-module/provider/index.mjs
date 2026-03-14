// packages/image-cropper/src/provider/index.tsx
import { createContext, useContext, useMemo } from "@wordpress/element";
import useCropper from "./use-image-cropper.mjs";
import { MIN_ZOOM } from "../constants.mjs";
import { jsx } from "react/jsx-runtime";
var ImageCropperContext = createContext({
  cropperState: {
    crop: { x: 0, y: 0 },
    croppedArea: { x: 0, y: 0, width: 100, height: 100 },
    croppedAreaPixels: null,
    zoom: MIN_ZOOM,
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
  const cropperApi = useCropper();
  const contextValue = useMemo(() => {
    return {
      ...cropperApi
    };
  }, [cropperApi]);
  return /* @__PURE__ */ jsx(ImageCropperContext.Provider, { value: contextValue, children });
}
var useImageCropper = () => {
  const context = useContext(ImageCropperContext);
  if (!context) {
    throw new Error("Missing ImageCropperContext");
  }
  return context;
};
export {
  ImageCropperContext,
  ImageCropperProvider as default,
  useImageCropper
};
//# sourceMappingURL=index.mjs.map
