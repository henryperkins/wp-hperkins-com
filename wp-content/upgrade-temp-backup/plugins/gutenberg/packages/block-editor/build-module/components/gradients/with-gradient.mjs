// packages/block-editor/src/components/gradients/with-gradient.js
import { __experimentalUseGradient } from "./use-gradient.mjs";
import { jsx } from "react/jsx-runtime";
var withGradient = (WrappedComponent) => function WithGradient(props) {
  const { gradientValue } = __experimentalUseGradient();
  return /* @__PURE__ */ jsx(WrappedComponent, { ...props, gradientValue });
};
export {
  withGradient
};
//# sourceMappingURL=with-gradient.mjs.map
