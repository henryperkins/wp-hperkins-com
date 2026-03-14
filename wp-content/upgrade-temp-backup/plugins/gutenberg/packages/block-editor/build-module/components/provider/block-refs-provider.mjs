// packages/block-editor/src/components/provider/block-refs-provider.js
import { createContext, useMemo } from "@wordpress/element";
import { observableMap } from "@wordpress/compose";
import { jsx } from "react/jsx-runtime";
var BlockRefs = createContext({ refsMap: observableMap() });
BlockRefs.displayName = "BlockRefsContext";
function BlockRefsProvider({ children }) {
  const value = useMemo(() => ({ refsMap: observableMap() }), []);
  return /* @__PURE__ */ jsx(BlockRefs.Provider, { value, children });
}
export {
  BlockRefs,
  BlockRefsProvider
};
//# sourceMappingURL=block-refs-provider.mjs.map
