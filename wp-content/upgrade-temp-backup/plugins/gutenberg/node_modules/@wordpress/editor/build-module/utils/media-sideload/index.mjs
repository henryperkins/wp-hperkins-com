// packages/editor/src/utils/media-sideload/index.js
import { privateApis } from "@wordpress/media-utils";
import { unlock } from "../../lock-unlock.mjs";
var { sideloadMedia: mediaSideload } = unlock(privateApis);
var media_sideload_default = mediaSideload;
export {
  media_sideload_default as default
};
//# sourceMappingURL=index.mjs.map
