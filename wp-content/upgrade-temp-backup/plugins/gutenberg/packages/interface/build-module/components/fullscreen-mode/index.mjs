// packages/interface/src/components/fullscreen-mode/index.js
import { useEffect } from "@wordpress/element";
var FullscreenMode = ({ isActive }) => {
  useEffect(() => {
    let isSticky = false;
    if (document.body.classList.contains("sticky-menu")) {
      isSticky = true;
      document.body.classList.remove("sticky-menu");
    }
    return () => {
      if (isSticky) {
        document.body.classList.add("sticky-menu");
      }
    };
  }, []);
  useEffect(() => {
    if (isActive) {
      document.body.classList.add("is-fullscreen-mode");
    } else {
      document.body.classList.remove("is-fullscreen-mode");
    }
    return () => {
      if (isActive) {
        document.body.classList.remove("is-fullscreen-mode");
      }
    };
  }, [isActive]);
  return null;
};
var fullscreen_mode_default = FullscreenMode;
export {
  fullscreen_mode_default as default
};
//# sourceMappingURL=index.mjs.map
