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

// packages/block-editor/src/components/image-editor/cropper.js
var cropper_exports = {};
__export(cropper_exports, {
  default: () => ImageCropper
});
module.exports = __toCommonJS(cropper_exports);
var import_clsx = __toESM(require("clsx"));
var import_components = require("@wordpress/components");
var import_compose = require("@wordpress/compose");
var import_image_cropper = require("@wordpress/image-cropper");
var import_context = require("./context.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function ImageCropper({
  url,
  width,
  height,
  naturalHeight,
  naturalWidth,
  borderProps
}) {
  const { isInProgress, editedUrl, rotation } = (0, import_context.useImageEditingContext)();
  const [contentResizeListener, { width: clientWidth }] = (0, import_compose.useResizeObserver)();
  let editedHeight = height || clientWidth * naturalHeight / naturalWidth;
  if (rotation % 180 === 90) {
    editedHeight = clientWidth * naturalWidth / naturalHeight;
  }
  const area = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: (0, import_clsx.default)(
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
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_image_cropper.ImageCropper, { src: editedUrl || url }),
        isInProgress && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Spinner, {})
      ]
    }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    contentResizeListener,
    area
  ] });
}
//# sourceMappingURL=cropper.cjs.map
