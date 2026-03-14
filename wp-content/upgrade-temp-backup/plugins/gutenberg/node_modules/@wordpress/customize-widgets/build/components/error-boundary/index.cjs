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

// packages/customize-widgets/src/components/error-boundary/index.js
var error_boundary_exports = {};
__export(error_boundary_exports, {
  default: () => ErrorBoundary
});
module.exports = __toCommonJS(error_boundary_exports);
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_block_editor = require("@wordpress/block-editor");
var import_compose = require("@wordpress/compose");
var import_hooks = require("@wordpress/hooks");
var import_jsx_runtime = require("react/jsx-runtime");
function CopyButton({ text, children }) {
  const ref = (0, import_compose.useCopyToClipboard)(text);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Button, { size: "compact", variant: "secondary", ref, children });
}
var ErrorBoundary = class extends import_element.Component {
  constructor() {
    super(...arguments);
    this.state = {
      error: null
    };
  }
  componentDidCatch(error) {
    this.setState({ error });
    (0, import_hooks.doAction)("editor.ErrorBoundary.errorLogged", error);
  }
  render() {
    const { error } = this.state;
    if (!error) {
      return this.props.children;
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_editor.Warning,
      {
        className: "customize-widgets-error-boundary",
        actions: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, { text: error.stack, children: (0, import_i18n.__)("Copy Error") }, "copy-error")
        ],
        children: (0, import_i18n.__)("The editor has encountered an unexpected error.")
      }
    );
  }
};
//# sourceMappingURL=index.cjs.map
