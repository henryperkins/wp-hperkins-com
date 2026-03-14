// packages/media-utils/src/utils/sideload-media.ts
import { __, sprintf } from "@wordpress/i18n";
import { sideloadToServer } from "./sideload-to-server.mjs";
import { UploadError } from "./upload-error.mjs";
var noop = () => {
};
async function sideloadMedia({
  file,
  attachmentId,
  additionalData = {},
  signal,
  onFileChange,
  onError = noop
}) {
  try {
    const attachment = await sideloadToServer(
      file,
      attachmentId,
      additionalData,
      signal
    );
    onFileChange?.([attachment]);
  } catch (error) {
    let message;
    if (error instanceof Error) {
      message = error.message;
    } else {
      message = sprintf(
        // translators: %s: file name
        __("Error while sideloading file %s to the server."),
        file.name
      );
    }
    onError(
      new UploadError({
        code: "GENERAL",
        message,
        file,
        cause: error instanceof Error ? error : void 0
      })
    );
  }
}
export {
  sideloadMedia
};
//# sourceMappingURL=sideload-media.mjs.map
