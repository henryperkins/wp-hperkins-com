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

// packages/editor/src/components/post-title/use-post-title-focus.js
var use_post_title_focus_exports = {};
__export(use_post_title_focus_exports, {
  default: () => usePostTitleFocus
});
module.exports = __toCommonJS(use_post_title_focus_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_store = require("../../store/index.cjs");
function usePostTitleFocus(forwardedRef) {
  const ref = (0, import_element.useRef)();
  const { isCleanNewPost } = (0, import_data.useSelect)((select) => {
    const { isCleanNewPost: _isCleanNewPost } = select(import_store.store);
    return {
      isCleanNewPost: _isCleanNewPost()
    };
  }, []);
  (0, import_element.useImperativeHandle)(forwardedRef, () => ({
    focus: () => {
      ref?.current?.focus();
    }
  }));
  (0, import_element.useEffect)(() => {
    if (!ref.current) {
      return;
    }
    const { defaultView } = ref.current.ownerDocument;
    const { name, parent } = defaultView;
    const ownerDocument = name === "editor-canvas" ? parent.document : defaultView.document;
    const { activeElement, body } = ownerDocument;
    if (isCleanNewPost && (!activeElement || body === activeElement)) {
      ref.current.focus();
    }
  }, [isCleanNewPost]);
  return { ref };
}
//# sourceMappingURL=use-post-title-focus.cjs.map
