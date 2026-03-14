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

// packages/editor/src/components/error-boundary/index.js
var error_boundary_exports = {};
__export(error_boundary_exports, {
  default: () => error_boundary_default
});
module.exports = __toCommonJS(error_boundary_exports);
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_compose = require("@wordpress/compose");
var import_hooks = require("@wordpress/hooks");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function getContent() {
  try {
    return (0, import_data.select)(import_store.store).getEditedPostContent();
  } catch (error) {
  }
}
function CopyButton({ text, children, variant = "secondary" }) {
  const ref = (0, import_compose.useCopyToClipboard)(text);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Button, { __next40pxDefaultSize: true, variant, ref, children });
}
var ErrorBoundary = class extends import_element.Component {
  constructor() {
    super(...arguments);
    this.state = {
      error: null
    };
  }
  componentDidCatch(error) {
    (0, import_hooks.doAction)("editor.ErrorBoundary.errorLogged", error);
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    const { error } = this.state;
    const { canCopyContent = false } = this.props;
    if (!error) {
      return this.props.children;
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      import_components.__experimentalHStack,
      {
        className: "editor-error-boundary",
        alignment: "baseline",
        spacing: 4,
        justify: "space-between",
        expanded: false,
        wrap: true,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { as: "p", children: (0, import_i18n.__)("The editor has encountered an unexpected error.") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { expanded: false, children: [
            canCopyContent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, { text: getContent, children: (0, import_i18n.__)("Copy contents") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, { variant: "primary", text: error?.stack, children: (0, import_i18n.__)("Copy error") })
          ] })
        ]
      }
    );
  }
};
var error_boundary_default = ErrorBoundary;
//# sourceMappingURL=index.cjs.map
