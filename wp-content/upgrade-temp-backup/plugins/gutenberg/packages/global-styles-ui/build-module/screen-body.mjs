// packages/global-styles-ui/src/screen-body.tsx
import { __experimentalSpacer as Spacer } from "@wordpress/components";
import clsx from "clsx";
import { jsx } from "react/jsx-runtime";
function ScreenBody({ children, className }) {
  return /* @__PURE__ */ jsx(
    Spacer,
    {
      className: clsx("global-styles-ui-screen-body", className),
      padding: 4,
      children
    }
  );
}
export {
  ScreenBody
};
//# sourceMappingURL=screen-body.mjs.map
