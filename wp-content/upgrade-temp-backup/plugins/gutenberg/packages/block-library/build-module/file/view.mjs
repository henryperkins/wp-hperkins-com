// packages/block-library/src/file/view.js
import { store } from "@wordpress/interactivity";
import { browserSupportsPdfs } from "./utils/index.mjs";
store(
  "core/file",
  {
    state: {
      get hasPdfPreview() {
        return browserSupportsPdfs();
      }
    }
  },
  { lock: true }
);
//# sourceMappingURL=view.mjs.map
