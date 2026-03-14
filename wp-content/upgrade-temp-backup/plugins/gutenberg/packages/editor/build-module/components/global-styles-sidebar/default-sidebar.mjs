// packages/editor/src/components/global-styles-sidebar/default-sidebar.js
import {
  ComplementaryArea,
  ComplementaryAreaMoreMenuItem
} from "@wordpress/interface";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function DefaultSidebar({
  className,
  identifier,
  title,
  icon,
  children,
  closeLabel,
  header,
  headerClassName,
  panelClassName,
  isActiveByDefault
}) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      ComplementaryArea,
      {
        className,
        scope: "core",
        identifier,
        title,
        icon,
        closeLabel,
        header,
        headerClassName,
        panelClassName,
        isActiveByDefault,
        children
      }
    ),
    /* @__PURE__ */ jsx(
      ComplementaryAreaMoreMenuItem,
      {
        scope: "core",
        identifier,
        icon,
        children: title
      }
    )
  ] });
}
export {
  DefaultSidebar as default
};
//# sourceMappingURL=default-sidebar.mjs.map
