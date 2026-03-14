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

// packages/edit-post/src/components/meta-boxes/meta-boxes-area/index.js
var meta_boxes_area_exports = {};
__export(meta_boxes_area_exports, {
  default: () => meta_boxes_area_default
});
module.exports = __toCommonJS(meta_boxes_area_exports);
var import_clsx = __toESM(require("clsx"));
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_store = require("../../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function MetaBoxesArea({ location }) {
  const container = (0, import_element.useRef)(null);
  const formRef = (0, import_element.useRef)(null);
  (0, import_element.useEffect)(() => {
    formRef.current = document.querySelector(
      ".metabox-location-" + location
    );
    if (formRef.current) {
      container.current.appendChild(formRef.current);
    }
    return () => {
      if (formRef.current) {
        document.querySelector("#metaboxes").appendChild(formRef.current);
      }
    };
  }, [location]);
  const isSaving = (0, import_data.useSelect)((select) => {
    return select(import_store.store).isSavingMetaBoxes();
  }, []);
  const classes = (0, import_clsx.default)("edit-post-meta-boxes-area", `is-${location}`, {
    "is-loading": isSaving
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: classes, children: [
    isSaving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Spinner, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className: "edit-post-meta-boxes-area__container",
        ref: container
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "edit-post-meta-boxes-area__clear" })
  ] });
}
var meta_boxes_area_default = MetaBoxesArea;
//# sourceMappingURL=index.cjs.map
