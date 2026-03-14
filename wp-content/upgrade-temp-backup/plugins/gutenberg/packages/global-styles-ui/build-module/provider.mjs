// packages/global-styles-ui/src/provider.tsx
import { useMemo } from "@wordpress/element";
import { mergeGlobalStyles } from "@wordpress/global-styles-engine";
import { GlobalStylesContext } from "./context.mjs";
import { jsx } from "react/jsx-runtime";
function GlobalStylesProvider({
  children,
  value,
  baseValue,
  onChange,
  fontLibraryEnabled
}) {
  const merged = useMemo(() => {
    return mergeGlobalStyles(baseValue, value);
  }, [baseValue, value]);
  const contextValue = useMemo(
    () => ({
      user: value,
      base: baseValue,
      merged,
      onChange,
      fontLibraryEnabled
    }),
    [value, baseValue, merged, onChange, fontLibraryEnabled]
  );
  return /* @__PURE__ */ jsx(GlobalStylesContext.Provider, { value: contextValue, children });
}
export {
  GlobalStylesProvider
};
//# sourceMappingURL=provider.mjs.map
