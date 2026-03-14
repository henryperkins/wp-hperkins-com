var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// packages/list-reusable-blocks/src/index.js
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_export = __toESM(require("./utils/export.cjs"));
var import_import_dropdown = __toESM(require("./components/import-dropdown/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
document.body.addEventListener("click", (event) => {
  if (!event.target.classList.contains("wp-list-reusable-blocks__export")) {
    return;
  }
  event.preventDefault();
  (0, import_export.default)(event.target.dataset.id);
});
document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".page-title-action");
  if (!button) {
    return;
  }
  const showNotice = () => {
    const notice = document.createElement("div");
    notice.className = "notice notice-success is-dismissible";
    notice.innerHTML = `<p>${(0, import_i18n.__)("Pattern imported successfully!")}</p>`;
    const headerEnd = document.querySelector(".wp-header-end");
    if (!headerEnd) {
      return;
    }
    headerEnd.parentNode.insertBefore(notice, headerEnd);
  };
  const container = document.createElement("div");
  container.className = "list-reusable-blocks__container";
  button.parentNode.insertBefore(container, button);
  (0, import_element.createRoot)(container).render(
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_element.StrictMode, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_import_dropdown.default, { onUpload: showNotice }) })
  );
});
//# sourceMappingURL=index.cjs.map
