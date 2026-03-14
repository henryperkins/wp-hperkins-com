// packages/block-editor/src/components/image-editor/cropper.js
import clsx from "clsx";
import { Spinner } from "@wordpress/components";
import { useResizeObserver } from "@wordpress/compose";
import { ImageCropper as ImageCropperComponent } from "@wordpress/image-cropper";
import { useImageEditingContext } from "./context.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function ImageCropper({
  url,
  width,
  height,
  naturalHeight,
  naturalWidth,
  borderProps
}) {
  const { isInProgress, editedUrl, rotation } = useImageEditingContext();
  const [contentResizeListener, { width: clientWidth }] = useResizeObserver();
  let editedHeight = height || clientWidth * naturalHeight / naturalWidth;
  if (rotation % 180 === 90) {
    editedHeight = clientWidth * naturalWidth / naturalHeight;
  }
  const area = /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "wp-block-image__crop-area",
        borderProps?.className,
        {
          "is-applying": isInProgress
        }
      ),
      style: {
        ...borderProps?.style,
        width: width || clientWidth,
        height: editedHeight
      },
      children: [
        /* @__PURE__ */ jsx(ImageCropperComponent, { src: editedUrl || url }),
        isInProgress && /* @__PURE__ */ jsx(Spinner, {})
      ]
    }
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    contentResizeListener,
    area
  ] });
}
export {
  ImageCropper as default
};
//# sourceMappingURL=cropper.mjs.map
