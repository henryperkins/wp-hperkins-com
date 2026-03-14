"use strict";
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

// packages/editor/src/components/post-taxonomies/panel.js
var panel_exports = {};
__export(panel_exports, {
  default: () => PostTaxonomies
});
module.exports = __toCommonJS(panel_exports);
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_store = require("../../store/index.cjs");
var import_index = __toESM(require("./index.cjs"));
var import_check = __toESM(require("./check.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function TaxonomyPanel({ taxonomy, children }) {
  const slug = taxonomy?.slug;
  const panelName = slug ? `taxonomy-panel-${slug}` : "";
  const { isEnabled, isOpened } = (0, import_data.useSelect)(
    (select) => {
      const { isEditorPanelEnabled, isEditorPanelOpened } = select(import_store.store);
      return {
        isEnabled: slug ? isEditorPanelEnabled(panelName) : false,
        isOpened: slug ? isEditorPanelOpened(panelName) : false
      };
    },
    [panelName, slug]
  );
  const { toggleEditorPanelOpened } = (0, import_data.useDispatch)(import_store.store);
  if (!isEnabled) {
    return null;
  }
  const taxonomyMenuName = taxonomy?.labels?.menu_name;
  if (!taxonomyMenuName) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.PanelBody,
    {
      title: taxonomyMenuName,
      opened: isOpened,
      onToggle: () => toggleEditorPanelOpened(panelName),
      children
    }
  );
}
function PostTaxonomies() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_check.default, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_index.default,
    {
      taxonomyWrapper: (content, taxonomy) => {
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaxonomyPanel, { taxonomy, children: content });
      }
    }
  ) });
}
//# sourceMappingURL=panel.cjs.map
