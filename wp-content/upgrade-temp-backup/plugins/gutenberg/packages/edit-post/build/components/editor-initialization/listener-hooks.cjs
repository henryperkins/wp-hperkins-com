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

// packages/edit-post/src/components/editor-initialization/listener-hooks.js
var listener_hooks_exports = {};
__export(listener_hooks_exports, {
  useUpdatePostLinkListener: () => useUpdatePostLinkListener
});
module.exports = __toCommonJS(listener_hooks_exports);
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_editor = require("@wordpress/editor");
var import_core_data = require("@wordpress/core-data");
var import_constants = require("../../store/constants.cjs");
var useUpdatePostLinkListener = () => {
  const { isViewable, newPermalink } = (0, import_data.useSelect)((select) => {
    const { getPostType } = select(import_core_data.store);
    const { getCurrentPost, getEditedPostAttribute } = select(import_editor.store);
    const postType = getPostType(getEditedPostAttribute("type"));
    return {
      isViewable: postType?.viewable,
      newPermalink: getCurrentPost().link
    };
  }, []);
  const nodeToUpdateRef = (0, import_element.useRef)();
  (0, import_element.useEffect)(() => {
    nodeToUpdateRef.current = document.querySelector(import_constants.VIEW_AS_PREVIEW_LINK_SELECTOR) || document.querySelector(import_constants.VIEW_AS_LINK_SELECTOR);
  }, []);
  (0, import_element.useEffect)(() => {
    if (!newPermalink || !nodeToUpdateRef.current) {
      return;
    }
    if (!isViewable) {
      nodeToUpdateRef.current.style.display = "none";
      return;
    }
    nodeToUpdateRef.current.style.display = "";
    nodeToUpdateRef.current.setAttribute("href", newPermalink);
  }, [newPermalink, isViewable]);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useUpdatePostLinkListener
});
//# sourceMappingURL=listener-hooks.cjs.map
