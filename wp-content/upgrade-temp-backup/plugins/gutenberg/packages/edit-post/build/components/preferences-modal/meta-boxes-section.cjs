var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/edit-post/src/components/preferences-modal/meta-boxes-section.js
var meta_boxes_section_exports = {};
__export(meta_boxes_section_exports, {
  MetaBoxesSection: () => MetaBoxesSection,
  default: () => meta_boxes_section_default
});
module.exports = __toCommonJS(meta_boxes_section_exports);
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_editor = require("@wordpress/editor");
var import_preferences = require("@wordpress/preferences");
var import_enable_custom_fields = __toESM(require("./enable-custom-fields.cjs"));
var import_enable_panel = __toESM(require("./enable-panel.cjs"));
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { PreferencesModalSection } = (0, import_lock_unlock.unlock)(import_preferences.privateApis);
function MetaBoxesSection({
  areCustomFieldsRegistered,
  metaBoxes,
  ...sectionProps
}) {
  const thirdPartyMetaBoxes = metaBoxes.filter(
    ({ id }) => id !== "postcustom"
  );
  if (!areCustomFieldsRegistered && thirdPartyMetaBoxes.length === 0) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PreferencesModalSection, { ...sectionProps, children: [
    areCustomFieldsRegistered && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_enable_custom_fields.default, { label: (0, import_i18n.__)("Custom fields") }),
    thirdPartyMetaBoxes.map(({ id, title }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_enable_panel.default,
      {
        label: title,
        panelName: `meta-box-${id}`
      },
      id
    ))
  ] });
}
var meta_boxes_section_default = (0, import_data.withSelect)((select) => {
  const { getEditorSettings } = select(import_editor.store);
  const { getAllMetaBoxes } = select(import_store.store);
  return {
    // This setting should not live in the block editor's store.
    areCustomFieldsRegistered: getEditorSettings().enableCustomFields !== void 0,
    metaBoxes: getAllMetaBoxes()
  };
})(MetaBoxesSection);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MetaBoxesSection
});
//# sourceMappingURL=meta-boxes-section.cjs.map
