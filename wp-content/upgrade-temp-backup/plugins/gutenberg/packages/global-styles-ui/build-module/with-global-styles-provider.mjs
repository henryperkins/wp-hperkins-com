// packages/global-styles-ui/src/with-global-styles-provider.tsx
import { GlobalStylesProvider } from "./provider.mjs";
import { jsx } from "react/jsx-runtime";
function withGlobalStylesProvider(Component) {
  return function WrappedComponent({
    value,
    baseValue,
    onChange,
    ...props
  }) {
    return /* @__PURE__ */ jsx(
      GlobalStylesProvider,
      {
        value,
        baseValue,
        onChange,
        children: /* @__PURE__ */ jsx(Component, { ...props })
      }
    );
  };
}
export {
  withGlobalStylesProvider
};
//# sourceMappingURL=with-global-styles-provider.mjs.map
