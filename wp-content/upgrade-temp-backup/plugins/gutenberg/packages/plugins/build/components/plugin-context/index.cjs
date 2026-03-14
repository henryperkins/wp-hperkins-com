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

// packages/plugins/src/components/plugin-context/index.tsx
var plugin_context_exports = {};
__export(plugin_context_exports, {
  PluginContextProvider: () => PluginContextProvider,
  usePluginContext: () => usePluginContext,
  withPluginContext: () => withPluginContext
});
module.exports = __toCommonJS(plugin_context_exports);
var import_element = require("@wordpress/element");
var import_compose = require("@wordpress/compose");
var import_deprecated = __toESM(require("@wordpress/deprecated"));
var import_jsx_runtime = require("react/jsx-runtime");
var Context = (0, import_element.createContext)({
  name: null,
  icon: null
});
Context.displayName = "PluginContext";
var PluginContextProvider = Context.Provider;
function usePluginContext() {
  return (0, import_element.useContext)(Context);
}
var withPluginContext = (mapContextToProps) => (0, import_compose.createHigherOrderComponent)((OriginalComponent) => {
  (0, import_deprecated.default)("wp.plugins.withPluginContext", {
    since: "6.8.0",
    alternative: "wp.plugins.usePluginContext"
  });
  return (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Context.Consumer, { children: (context) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    OriginalComponent,
    {
      ...props,
      ...mapContextToProps(context, props)
    }
  ) });
}, "withPluginContext");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PluginContextProvider,
  usePluginContext,
  withPluginContext
});
//# sourceMappingURL=index.cjs.map
