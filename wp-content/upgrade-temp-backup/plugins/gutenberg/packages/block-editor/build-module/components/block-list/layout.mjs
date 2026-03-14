// packages/block-editor/src/components/block-list/layout.js
import { createContext, useContext } from "@wordpress/element";
import { getLayoutType } from "../../layouts/index.mjs";
import { useSettings } from "../use-settings/index.mjs";
import { jsx } from "react/jsx-runtime";
var defaultLayout = { type: "default" };
var Layout = createContext(defaultLayout);
Layout.displayName = "BlockLayoutContext";
var LayoutProvider = Layout.Provider;
function useLayout() {
  return useContext(Layout);
}
function LayoutStyle({ layout = {}, css, ...props }) {
  const layoutType = getLayoutType(layout.type);
  const [blockGapSupport] = useSettings("spacing.blockGap");
  const hasBlockGapSupport = blockGapSupport !== null;
  if (layoutType) {
    if (css) {
      return /* @__PURE__ */ jsx("style", { children: css });
    }
    const layoutStyle = layoutType.getLayoutStyle?.({
      hasBlockGapSupport,
      layout,
      ...props
    });
    if (layoutStyle) {
      return /* @__PURE__ */ jsx("style", { children: layoutStyle });
    }
  }
  return null;
}
export {
  LayoutProvider,
  LayoutStyle,
  defaultLayout,
  useLayout
};
//# sourceMappingURL=layout.mjs.map
