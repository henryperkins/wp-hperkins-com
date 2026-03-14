// packages/media-editor/src/components/media-editor-provider/index.tsx
import { createContext, useContext } from "@wordpress/element";
import { jsx } from "react/jsx-runtime";
var MediaEditorContext = createContext(
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
  return /* @__PURE__ */ jsx(MediaEditorContext.Provider, { value: contextValue, children });
}
function useMediaEditorContext() {
  const context = useContext(MediaEditorContext);
  if (!context) {
    throw new Error(
      "useMediaEditorContext must be used within MediaEditorProvider"
    );
  }
  return context;
}
export {
  MediaEditorProvider,
  useMediaEditorContext
};
//# sourceMappingURL=index.mjs.map
