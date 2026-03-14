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

// packages/edit-post/src/components/meta-boxes/use-meta-box-initialization.js
var use_meta_box_initialization_exports = {};
__export(use_meta_box_initialization_exports, {
  useMetaBoxInitialization: () => useMetaBoxInitialization
});
module.exports = __toCommonJS(use_meta_box_initialization_exports);
var import_data = require("@wordpress/data");
var import_editor = require("@wordpress/editor");
var import_core_data = require("@wordpress/core-data");
var import_element = require("@wordpress/element");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var useMetaBoxInitialization = (enabled) => {
  const { isEnabledAndEditorReady, isCollaborationEnabled } = (0, import_data.useSelect)(
    (select) => ({
      isEnabledAndEditorReady: enabled && select(import_editor.store).__unstableIsEditorReady(),
      isCollaborationEnabled: select(import_editor.store).isCollaborationEnabledForCurrentPost()
    }),
    [enabled]
  );
  const { setCollaborationSupported } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_core_data.store));
  const { initializeMetaBoxes } = (0, import_data.useDispatch)(import_store.store);
  (0, import_element.useEffect)(() => {
    if (isEnabledAndEditorReady) {
      initializeMetaBoxes();
      if (isCollaborationEnabled) {
        setCollaborationSupported(false);
      }
    }
  }, [
    isEnabledAndEditorReady,
    initializeMetaBoxes,
    isCollaborationEnabled,
    setCollaborationSupported
  ]);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useMetaBoxInitialization
});
//# sourceMappingURL=use-meta-box-initialization.cjs.map
