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

// packages/media-editor/src/components/media-editor-provider/index.tsx
var media_editor_provider_exports = {};
__export(media_editor_provider_exports, {
  MediaEditorProvider: () => MediaEditorProvider,
  useMediaEditorContext: () => useMediaEditorContext
});
module.exports = __toCommonJS(media_editor_provider_exports);
var import_element = require("@wordpress/element");
var import_jsx_runtime = require("react/jsx-runtime");
var MediaEditorContext = (0, import_element.createContext)(
  void 0
);
function MediaEditorProvider({
  value,
  onChange,
  settings = {},
  children
}) {
  const contextValue = {
    media: value,
    onChange,
    fields: settings.fields || []
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaEditorContext.Provider, { value: contextValue, children });
}
function useMediaEditorContext() {
  const context = (0, import_element.useContext)(MediaEditorContext);
  if (!context) {
    throw new Error(
      "useMediaEditorContext must be used within MediaEditorProvider"
    );
  }
  return context;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MediaEditorProvider,
  useMediaEditorContext
});
//# sourceMappingURL=index.cjs.map
