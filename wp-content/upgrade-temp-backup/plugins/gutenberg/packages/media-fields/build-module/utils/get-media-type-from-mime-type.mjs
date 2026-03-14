// packages/media-fields/src/utils/get-media-type-from-mime-type.ts
import { __ } from "@wordpress/i18n";
import { audio, video, image, file } from "@wordpress/icons";
function getMediaTypeFromMimeType(mimeType) {
  if (mimeType.startsWith("image/")) {
    return {
      type: "image",
      label: __("Image"),
      icon: image
    };
  }
  if (mimeType.startsWith("video/")) {
    return {
      type: "video",
      label: __("Video"),
      icon: video
    };
  }
  if (mimeType.startsWith("audio/")) {
    return {
      type: "audio",
      label: __("Audio"),
      icon: audio
    };
  }
  return {
    type: "application",
    label: __("Application"),
    icon: file
  };
}
export {
  getMediaTypeFromMimeType
};
//# sourceMappingURL=get-media-type-from-mime-type.mjs.map
