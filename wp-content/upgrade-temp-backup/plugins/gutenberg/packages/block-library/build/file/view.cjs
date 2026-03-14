"use strict";

// packages/block-library/src/file/view.js
var import_interactivity = require("@wordpress/interactivity");
var import_utils = require("./utils/index.cjs");
(0, import_interactivity.store)(
  "core/file",
  {
    state: {
      get hasPdfPreview() {
        return (0, import_utils.browserSupportsPdfs)();
      }
    }
  },
  { lock: true }
);
//# sourceMappingURL=view.cjs.map
