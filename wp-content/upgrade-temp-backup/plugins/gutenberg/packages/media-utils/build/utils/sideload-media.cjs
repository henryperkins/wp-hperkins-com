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

// packages/media-utils/src/utils/sideload-media.ts
var sideload_media_exports = {};
__export(sideload_media_exports, {
  sideloadMedia: () => sideloadMedia
});
module.exports = __toCommonJS(sideload_media_exports);
var import_i18n = require("@wordpress/i18n");
var import_sideload_to_server = require("./sideload-to-server.cjs");
var import_upload_error = require("./upload-error.cjs");
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
    const attachment = await (0, import_sideload_to_server.sideloadToServer)(
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
      message = (0, import_i18n.sprintf)(
        // translators: %s: file name
        (0, import_i18n.__)("Error while sideloading file %s to the server."),
        file.name
      );
    }
    onError(
      new import_upload_error.UploadError({
        code: "GENERAL",
        message,
        file,
        cause: error instanceof Error ? error : void 0
      })
    );
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sideloadMedia
});
//# sourceMappingURL=sideload-media.cjs.map
