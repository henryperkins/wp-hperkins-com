// packages/boot/src/components/navigation/drilldown-item/index.tsx
import clsx from "clsx";
import {
  FlexBlock,
  __experimentalItem as Item,
  __experimentalHStack as HStack,
  Icon
} from "@wordpress/components";
import { isRTL } from "@wordpress/i18n";
import { chevronRightSmall, chevronLeftSmall } from "@wordpress/icons";
import { wrapIcon } from "../items.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function DrilldownItem({
  className,
  id,
  icon,
  shouldShowPlaceholder = true,
  children,
  onNavigate
}) {
  const handleClick = (e) => {
    e.preventDefault();
    onNavigate({ id, direction: "forward" });
  };
  return /* @__PURE__ */ jsx(
    Item,
    {
      className: clsx("boot-navigation-item", className),
      onClick: handleClick,
      children: /* @__PURE__ */ jsxs(
        HStack,
        {
          justify: "flex-start",
          spacing: 2,
          style: { flexGrow: "1" },
          children: [
            wrapIcon(icon, shouldShowPlaceholder),
            /* @__PURE__ */ jsx(FlexBlock, { children }),
            /* @__PURE__ */ jsx(Icon, { icon: isRTL() ? chevronLeftSmall : chevronRightSmall })
          ]
        }
      )
    }
  );
}
export {
  DrilldownItem as default
};
//# sourceMappingURL=index.mjs.map
