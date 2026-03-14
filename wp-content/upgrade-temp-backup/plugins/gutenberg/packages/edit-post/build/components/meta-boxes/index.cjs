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

// packages/edit-post/src/components/meta-boxes/index.js
var meta_boxes_exports = {};
__export(meta_boxes_exports, {
  default: () => MetaBoxes
});
module.exports = __toCommonJS(meta_boxes_exports);
var import_data = require("@wordpress/data");
var import_meta_boxes_area = __toESM(require("./meta-boxes-area/index.cjs"));
var import_meta_box_visibility = __toESM(require("./meta-box-visibility.cjs"));
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function MetaBoxes({ location }) {
  const metaBoxes = (0, import_data.useSelect)(
    (select) => select(import_store.store).getMetaBoxesPerLocation(location),
    [location]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    (metaBoxes ?? []).map(({ id }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_meta_box_visibility.default, { id }, id)),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_meta_boxes_area.default, { location })
  ] });
}
//# sourceMappingURL=index.cjs.map
