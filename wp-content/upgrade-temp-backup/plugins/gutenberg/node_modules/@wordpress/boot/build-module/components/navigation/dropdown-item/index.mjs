// packages/boot/src/components/navigation/dropdown-item/index.tsx
import clsx from "clsx";
import {
  FlexBlock,
  __experimentalItem as Item,
  __experimentalHStack as HStack,
  Icon,
  __unstableMotion as motion,
  __unstableAnimatePresence as AnimatePresence
} from "@wordpress/components";
import { chevronDownSmall } from "@wordpress/icons";
import { useReducedMotion } from "@wordpress/compose";
import { useSelect } from "@wordpress/data";
import { STORE_NAME } from "../../../store/index.mjs";
import NavigationItem from "../navigation-item/index.mjs";
import { wrapIcon } from "../items.mjs";

// packages/boot/src/components/navigation/dropdown-item/style.scss
if (typeof document !== "undefined" && process.env.NODE_ENV !== "test" && !document.head.querySelector("style[data-wp-hash='58e2debd11']")) {
  const style = document.createElement("style");
  style.setAttribute("data-wp-hash", "58e2debd11");
  style.appendChild(document.createTextNode(".boot-dropdown-item__children{display:flex;flex-direction:column;margin-block-end:2px;margin-block-start:-2px;margin-inline-start:30px;overflow:hidden;padding:2px}.boot-dropdown-item__chevron.is-up{transform:rotate(180deg)}"));
  document.head.appendChild(style);
}

// packages/boot/src/components/navigation/dropdown-item/index.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var ANIMATION_DURATION = 0.2;
function DropdownItem({
  className,
  id,
  icon,
  children,
  isExpanded,
  onToggle
}) {
  const menuItems = useSelect(
    (select) => (
      // @ts-ignore
      select(STORE_NAME).getMenuItems()
    ),
    []
  );
  const items = menuItems.filter((item) => item.parent === id);
  const disableMotion = useReducedMotion();
  return /* @__PURE__ */ jsxs("div", { className: "boot-dropdown-item", children: [
    /* @__PURE__ */ jsx(
      Item,
      {
        className: clsx("boot-navigation-item", className),
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle();
        },
        onMouseDown: (e) => e.preventDefault(),
        children: /* @__PURE__ */ jsxs(
          HStack,
          {
            justify: "flex-start",
            spacing: 2,
            style: { flexGrow: "1" },
            children: [
              wrapIcon(icon, false),
              /* @__PURE__ */ jsx(FlexBlock, { children }),
              /* @__PURE__ */ jsx(
                Icon,
                {
                  icon: chevronDownSmall,
                  className: clsx("boot-dropdown-item__chevron", {
                    "is-up": isExpanded
                  })
                }
              )
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsx(AnimatePresence, { initial: false, children: isExpanded && /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { height: 0 },
        animate: { height: "auto" },
        exit: { height: 0 },
        transition: {
          type: "tween",
          duration: disableMotion ? 0 : ANIMATION_DURATION,
          ease: "easeOut"
        },
        className: "boot-dropdown-item__children",
        children: items.map((item, index) => /* @__PURE__ */ jsx(
          NavigationItem,
          {
            to: item.to,
            shouldShowPlaceholder: false,
            children: item.label
          },
          index
        ))
      }
    ) })
  ] });
}
export {
  DropdownItem as default
};
//# sourceMappingURL=index.mjs.map
