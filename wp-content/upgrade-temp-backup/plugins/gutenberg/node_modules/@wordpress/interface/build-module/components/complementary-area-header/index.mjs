// packages/interface/src/components/complementary-area-header/index.js
import clsx from "clsx";
import { closeSmall } from "@wordpress/icons";
import ComplementaryAreaToggle from "../complementary-area-toggle/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var ComplementaryAreaHeader = ({
  children,
  className,
  toggleButtonProps
}) => {
  const toggleButton = /* @__PURE__ */ jsx(ComplementaryAreaToggle, { icon: closeSmall, ...toggleButtonProps });
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "components-panel__header",
        "interface-complementary-area-header",
        className
      ),
      tabIndex: -1,
      children: [
        children,
        toggleButton
      ]
    }
  );
};
var complementary_area_header_default = ComplementaryAreaHeader;
export {
  complementary_area_header_default as default
};
//# sourceMappingURL=index.mjs.map
