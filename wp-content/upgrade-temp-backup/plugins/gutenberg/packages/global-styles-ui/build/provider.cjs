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

// packages/global-styles-ui/src/provider.tsx
var provider_exports = {};
__export(provider_exports, {
  GlobalStylesProvider: () => GlobalStylesProvider
});
module.exports = __toCommonJS(provider_exports);
var import_element = require("@wordpress/element");
var import_global_styles_engine = require("@wordpress/global-styles-engine");
var import_context = require("./context.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function GlobalStylesProvider({
  children,
  value,
  baseValue,
  onChange,
  fontLibraryEnabled
}) {
  const merged = (0, import_element.useMemo)(() => {
    return (0, import_global_styles_engine.mergeGlobalStyles)(baseValue, value);
  }, [baseValue, value]);
  const contextValue = (0, import_element.useMemo)(
    () => ({
      user: value,
      base: baseValue,
      merged,
      onChange,
      fontLibraryEnabled
    }),
    [value, baseValue, merged, onChange, fontLibraryEnabled]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_context.GlobalStylesContext.Provider, { value: contextValue, children });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GlobalStylesProvider
});
//# sourceMappingURL=provider.cjs.map
