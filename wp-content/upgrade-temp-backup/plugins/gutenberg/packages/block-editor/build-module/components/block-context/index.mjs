// packages/block-editor/src/components/block-context/index.js
import { createContext, useContext, useMemo } from "@wordpress/element";
import { jsx } from "react/jsx-runtime";
var Context = createContext({});
Context.displayName = "BlockContext";
function BlockContextProvider({ value, children }) {
  const context = useContext(Context);
  const nextValue = useMemo(
    () => ({ ...context, ...value }),
    [context, value]
  );
  return /* @__PURE__ */ jsx(Context.Provider, { value: nextValue, children });
}
var block_context_default = Context;
export {
  BlockContextProvider,
  block_context_default as default
};
//# sourceMappingURL=index.mjs.map
