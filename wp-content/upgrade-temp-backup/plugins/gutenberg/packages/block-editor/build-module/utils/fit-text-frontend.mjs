// packages/block-editor/src/utils/fit-text-frontend.js
import { store, getElement, getContext } from "@wordpress/interactivity";
import { optimizeFitText } from "./fit-text-utils.mjs";
store("core/fit-text", {
  callbacks: {
    init() {
      const context = getContext();
      const { ref } = getElement();
      const applyFontSize = (fontSize) => {
        if (fontSize === 0) {
          ref.style.fontSize = "";
        } else {
          ref.style.fontSize = `${fontSize}px`;
        }
      };
      context.fontSize = optimizeFitText(ref, applyFontSize);
      if (window.ResizeObserver && ref.parentElement) {
        const resizeObserver = new window.ResizeObserver(() => {
          context.fontSize = optimizeFitText(ref, applyFontSize);
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
//# sourceMappingURL=fit-text-frontend.mjs.map
