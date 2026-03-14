// packages/media-utils/src/private-apis.ts
import { sideloadMedia } from "./utils/sideload-media.mjs";
import { MediaUploadModal } from "./components/media-upload-modal/index.mjs";
import { lock } from "./lock-unlock.mjs";
var privateApis = {};
lock(privateApis, {
  sideloadMedia,
  MediaUploadModal
});
export {
  privateApis
};
//# sourceMappingURL=private-apis.mjs.map
