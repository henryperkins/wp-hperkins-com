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

// packages/list-reusable-blocks/src/components/import-form/index.js
var import_form_exports = {};
__export(import_form_exports, {
  default: () => import_form_default
});
module.exports = __toCommonJS(import_form_exports);
var import_element = require("@wordpress/element");
var import_compose = require("@wordpress/compose");
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_import = __toESM(require("../../utils/import.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function ImportForm({ instanceId, onUpload }) {
  const inputId = "list-reusable-blocks-import-form-" + instanceId;
  const formRef = (0, import_element.useRef)();
  const [isLoading, setIsLoading] = (0, import_element.useState)(false);
  const [error, setError] = (0, import_element.useState)(null);
  const [file, setFile] = (0, import_element.useState)(null);
  const onChangeFile = (event) => {
    setFile(event.target.files[0]);
    setError(null);
  };
  const onSubmit = (event) => {
    event.preventDefault();
    if (!file) {
      return;
    }
    setIsLoading({ isLoading: true });
    (0, import_import.default)(file).then((reusableBlock) => {
      if (!formRef) {
        return;
      }
      setIsLoading(false);
      onUpload(reusableBlock);
    }).catch((errors) => {
      if (!formRef) {
        return;
      }
      let uiMessage;
      switch (errors.message) {
        case "Invalid JSON file":
          uiMessage = (0, import_i18n.__)("Invalid JSON file");
          break;
        case "Invalid pattern JSON file":
          uiMessage = (0, import_i18n.__)("Invalid pattern JSON file");
          break;
        default:
          uiMessage = (0, import_i18n.__)("Unknown error");
      }
      setIsLoading(false);
      setError(uiMessage);
    });
  };
  const onDismissError = () => {
    setError(null);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "form",
    {
      className: "list-reusable-blocks-import-form",
      onSubmit,
      ref: formRef,
      children: [
        error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Notice, { status: "error", onRemove: () => onDismissError(), children: error }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "label",
          {
            htmlFor: inputId,
            className: "list-reusable-blocks-import-form__label",
            children: (0, import_i18n.__)("File")
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { id: inputId, type: "file", onChange: onChangeFile }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            __next40pxDefaultSize: true,
            type: "submit",
            isBusy: isLoading,
            accessibleWhenDisabled: true,
            disabled: !file || isLoading,
            variant: "secondary",
            className: "list-reusable-blocks-import-form__button",
            children: (0, import_i18n._x)("Import", "button label")
          }
        )
      ]
    }
  );
}
var import_form_default = (0, import_compose.withInstanceId)(ImportForm);
//# sourceMappingURL=index.cjs.map
