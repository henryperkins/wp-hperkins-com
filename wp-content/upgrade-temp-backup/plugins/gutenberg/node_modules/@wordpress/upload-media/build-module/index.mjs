// packages/upload-media/src/index.ts
import { store as uploadStore } from "./store/index.mjs";
import { default as default2 } from "./components/provider/index.mjs";
import { UploadError } from "./upload-error.mjs";
import {
  detectClientSideMediaSupport,
  isClientSideMediaSupported,
  clearFeatureDetectionCache
} from "./feature-detection.mjs";
export {
  default2 as MediaUploadProvider,
  UploadError,
  clearFeatureDetectionCache,
  detectClientSideMediaSupport,
  isClientSideMediaSupported,
  uploadStore as store
};
//# sourceMappingURL=index.mjs.map
