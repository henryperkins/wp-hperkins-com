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

// packages/block-library/src/cover/edit/embed-video-url-input.js
var embed_video_url_input_exports = {};
__export(embed_video_url_input_exports, {
  default: () => EmbedVideoUrlInput
});
module.exports = __toCommonJS(embed_video_url_input_exports);
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_embed_video_utils = require("../embed-video-utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function EmbedVideoUrlInput({
  onSubmit,
  onClose,
  initialUrl = ""
}) {
  const [url, setUrl] = (0, import_element.useState)(initialUrl);
  const [error, setError] = (0, import_element.useState)("");
  const handleConfirm = () => {
    if (!url) {
      setError((0, import_i18n.__)("Please enter a URL."));
      return;
    }
    if (!(0, import_embed_video_utils.isValidVideoEmbedUrl)(url)) {
      setError(
        (0, import_i18n.__)(
          "This URL is not supported. Please enter a valid video link from a supported provider."
        )
      );
      return;
    }
    onSubmit(url);
    onClose();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.__experimentalConfirmDialog,
    {
      isOpen: true,
      onConfirm: handleConfirm,
      onCancel: onClose,
      confirmButtonText: (0, import_i18n.__)("Add video"),
      size: "medium",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 4, children: [
        error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Notice, { status: "error", isDismissible: false, children: error }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.TextControl,
          {
            type: "url",
            __next40pxDefaultSize: true,
            label: (0, import_i18n.__)("Video URL"),
            value: url,
            onChange: (value) => {
              setUrl(value);
              setError("");
            },
            placeholder: (0, import_i18n.__)(
              "Enter YouTube, Vimeo, or other video URL"
            ),
            help: (0, import_i18n.__)(
              "Add a background video to the cover block that will autoplay in a loop."
            )
          }
        )
      ] })
    }
  );
}
//# sourceMappingURL=embed-video-url-input.cjs.map
