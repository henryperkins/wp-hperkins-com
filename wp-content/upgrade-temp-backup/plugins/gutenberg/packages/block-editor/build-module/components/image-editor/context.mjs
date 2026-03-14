// packages/block-editor/src/components/image-editor/context.js
import { createContext, useContext, useMemo } from "@wordpress/element";
import useSaveImage from "./use-save-image.mjs";
import useTransformImage from "./use-transform-image.mjs";
import { jsx } from "react/jsx-runtime";
var ImageEditingContext = createContext({});
ImageEditingContext.displayName = "ImageEditingContext";
var useImageEditingContext = () => useContext(ImageEditingContext);
function ImageEditingProvider({
  id,
  url,
  naturalWidth,
  naturalHeight,
  onFinishEditing,
  onSaveImage,
  children
}) {
  const transformImage = useTransformImage({
    url,
    naturalWidth,
    naturalHeight
  });
  const saveImage = useSaveImage({
    id,
    url,
    onSaveImage,
    onFinishEditing,
    ...transformImage
  });
  const providerValue = useMemo(
    () => ({
      ...transformImage,
      ...saveImage
    }),
    [transformImage, saveImage]
  );
  return /* @__PURE__ */ jsx(ImageEditingContext.Provider, { value: providerValue, children });
}
export {
  ImageEditingProvider as default,
  useImageEditingContext
};
//# sourceMappingURL=context.mjs.map
