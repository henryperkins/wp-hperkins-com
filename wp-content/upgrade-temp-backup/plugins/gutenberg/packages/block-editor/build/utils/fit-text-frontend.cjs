"use strict";

// packages/block-editor/src/utils/fit-text-frontend.js
var import_interactivity = require("@wordpress/interactivity");
var import_fit_text_utils = require("./fit-text-utils.cjs");
(0, import_interactivity.store)("core/fit-text", {
  callbacks: {
    init() {
      const context = (0, import_interactivity.getContext)();
      const { ref } = (0, import_interactivity.getElement)();
      const applyFontSize = (fontSize) => {
        if (fontSize === 0) {
          ref.style.fontSize = "";
        } else {
          ref.style.fontSize = `${fontSize}px`;
        }
      };
      context.fontSize = (0, import_fit_text_utils.optimizeFitText)(ref, applyFontSize);
      if (window.ResizeObserver && ref.parentElement) {
        const resizeObserver = new window.ResizeObserver(() => {
          context.fontSize = (0, import_fit_text_utils.optimizeFitText)(ref, applyFontSize);
        });
        resizeObserver.observe(ref.parentElement);
        resizeObserver.observe(ref);
        return () => {
          if (resizeObserver) {
            resizeObserver.disconnect();
          }
        };
      }
    }
  }
});
//# sourceMappingURL=fit-text-frontend.cjs.map
