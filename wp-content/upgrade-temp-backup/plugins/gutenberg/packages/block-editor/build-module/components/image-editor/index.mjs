// packages/block-editor/src/components/image-editor/index.js
import { ToolbarGroup, ToolbarItem } from "@wordpress/components";
import { ImageCropperProvider } from "@wordpress/image-cropper";
import AspectRatioDropdown from "./aspect-ratio-dropdown.mjs";
import BlockControls from "../block-controls/index.mjs";
import ImageEditingProvider from "./context.mjs";
import Cropper from "./cropper.mjs";
import ZoomDropdown from "./zoom-dropdown.mjs";
import RotationButton from "./rotation-button.mjs";
import FormControls from "./form-controls.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function ImageEditor({
  id,
  url,
  width,
  height,
  naturalHeight,
  naturalWidth,
  onSaveImage,
  onFinishEditing,
  borderProps
}) {
  return /* @__PURE__ */ jsx(ImageCropperProvider, { children: /* @__PURE__ */ jsxs(
    ImageEditingProvider,
    {
      id,
      url,
      naturalWidth,
      naturalHeight,
      onSaveImage,
      onFinishEditing,
      children: [
        /* @__PURE__ */ jsx(
          Cropper,
          {
            borderProps,
            url,
            width,
            height,
            naturalHeight,
            naturalWidth
          }
        ),
        /* @__PURE__ */ jsxs(BlockControls, { children: [
          /* @__PURE__ */ jsxs(ToolbarGroup, { children: [
            /* @__PURE__ */ jsx(ZoomDropdown, {}),
            /* @__PURE__ */ jsx(ToolbarItem, { children: (toggleProps) => /* @__PURE__ */ jsx(
              AspectRatioDropdown,
              {
                toggleProps
              }
            ) }),
            /* @__PURE__ */ jsx(RotationButton, {})
          ] }),
          /* @__PURE__ */ jsx(ToolbarGroup, { children: /* @__PURE__ */ jsx(FormControls, {}) })
        ] })
      ]
    }
  ) });
}
export {
  ImageEditor as default
};
//# sourceMappingURL=index.mjs.map
