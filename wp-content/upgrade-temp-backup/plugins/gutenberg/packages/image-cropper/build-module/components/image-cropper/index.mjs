// packages/image-cropper/src/components/image-cropper/index.tsx
import Cropper from "react-easy-crop";
import { useCallback } from "@wordpress/element";
import { useImageCropper } from "../../provider/index.mjs";
import { MIN_ZOOM, MAX_ZOOM } from "../../constants.mjs";
import { jsx } from "react/jsx-runtime";
function ImageCropper({
  src,
  onLoad,
  minZoom = MIN_ZOOM,
  maxZoom = MAX_ZOOM,
  ...props
}) {
  const { cropperState, setCropperState } = useImageCropper();
  const { crop, zoom, rotation, aspectRatio, flip } = cropperState;
  const setCrop = (newCrop) => setCropperState({ crop: newCrop });
  const setZoom = (newZoom) => setCropperState({ zoom: newZoom });
  const setRotation = (newRotation) => setCropperState({ rotation: newRotation });
  const setMediaSize = (newMediaSize) => setCropperState({ mediaSize: newMediaSize });
  const onCropComplete = useCallback(
    (areaPercentage, areaPixels) => {
      setCropperState({
        croppedArea: areaPercentage,
        croppedAreaPixels: areaPixels
      });
    },
    [setCropperState]
  );
  return /* @__PURE__ */ jsx(
    Cropper,
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
export {
  ImageCropper as default
};
//# sourceMappingURL=index.mjs.map
