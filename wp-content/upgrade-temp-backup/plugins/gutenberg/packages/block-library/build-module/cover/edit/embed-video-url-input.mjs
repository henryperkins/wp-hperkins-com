// packages/block-library/src/cover/edit/embed-video-url-input.js
import { useState } from "@wordpress/element";
import {
  __experimentalConfirmDialog as ConfirmDialog,
  __experimentalVStack as VStack,
  TextControl,
  Notice
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { isValidVideoEmbedUrl } from "../embed-video-utils.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function EmbedVideoUrlInput({
  onSubmit,
  onClose,
  initialUrl = ""
}) {
  const [url, setUrl] = useState(initialUrl);
  const [error, setError] = useState("");
  const handleConfirm = () => {
    if (!url) {
      setError(__("Please enter a URL."));
      return;
    }
    if (!isValidVideoEmbedUrl(url)) {
      setError(
        __(
          "This URL is not supported. Please enter a valid video link from a supported provider."
        )
      );
      return;
    }
    onSubmit(url);
    onClose();
  };
  return /* @__PURE__ */ jsx(
    ConfirmDialog,
    {
      isOpen: true,
      onConfirm: handleConfirm,
      onCancel: onClose,
      confirmButtonText: __("Add video"),
      size: "medium",
      children: /* @__PURE__ */ jsxs(VStack, { spacing: 4, children: [
        error && /* @__PURE__ */ jsx(Notice, { status: "error", isDismissible: false, children: error }),
        /* @__PURE__ */ jsx(
          TextControl,
          {
            type: "url",
            __next40pxDefaultSize: true,
            label: __("Video URL"),
            value: url,
            onChange: (value) => {
              setUrl(value);
              setError("");
            },
            placeholder: __(
              "Enter YouTube, Vimeo, or other video URL"
            ),
            help: __(
              "Add a background video to the cover block that will autoplay in a loop."
            )
          }
        )
      ] })
    }
  );
}
export {
  EmbedVideoUrlInput as default
};
//# sourceMappingURL=embed-video-url-input.mjs.map
