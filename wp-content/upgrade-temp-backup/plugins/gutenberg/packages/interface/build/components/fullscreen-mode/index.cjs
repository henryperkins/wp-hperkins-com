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

// packages/interface/src/components/fullscreen-mode/index.js
var fullscreen_mode_exports = {};
__export(fullscreen_mode_exports, {
  default: () => fullscreen_mode_default
});
module.exports = __toCommonJS(fullscreen_mode_exports);
var import_element = require("@wordpress/element");
var FullscreenMode = ({ isActive }) => {
  (0, import_element.useEffect)(() => {
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
  (0, import_element.useEffect)(() => {
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
//# sourceMappingURL=index.cjs.map
