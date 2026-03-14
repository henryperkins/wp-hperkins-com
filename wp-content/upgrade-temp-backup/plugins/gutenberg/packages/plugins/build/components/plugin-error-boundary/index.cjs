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

// packages/plugins/src/components/plugin-error-boundary/index.tsx
var plugin_error_boundary_exports = {};
__export(plugin_error_boundary_exports, {
  PluginErrorBoundary: () => PluginErrorBoundary
});
module.exports = __toCommonJS(plugin_error_boundary_exports);
var import_element = require("@wordpress/element");
var PluginErrorBoundary = class extends import_element.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    const { name, onError } = this.props;
    if (onError) {
      onError(name, error);
    }
  }
  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }
    return null;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PluginErrorBoundary
});
//# sourceMappingURL=index.cjs.map
