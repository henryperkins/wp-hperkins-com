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

// packages/edit-post/src/components/meta-boxes/meta-box-visibility.js
var meta_box_visibility_exports = {};
__export(meta_box_visibility_exports, {
  default: () => MetaBoxVisibility
});
module.exports = __toCommonJS(meta_box_visibility_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_editor = require("@wordpress/editor");
function MetaBoxVisibility({ id }) {
  const isVisible = (0, import_data.useSelect)(
    (select) => {
      return select(import_editor.store).isEditorPanelEnabled(
        `meta-box-${id}`
      );
    },
    [id]
  );
  (0, import_element.useEffect)(() => {
    const element = document.getElementById(id);
    if (!element) {
      return;
    }
    if (isVisible) {
      element.classList.remove("is-hidden");
    } else {
      element.classList.add("is-hidden");
    }
  }, [id, isVisible]);
  return null;
}
//# sourceMappingURL=meta-box-visibility.cjs.map
