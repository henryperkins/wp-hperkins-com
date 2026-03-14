// packages/boot/src/components/navigation/navigation-screen/index.tsx
import {
  __experimentalHeading as Heading,
  __unstableMotion as motion,
  __unstableAnimatePresence as AnimatePresence,
  Button,
  __experimentalHStack as HStack
} from "@wordpress/components";
import { isRTL, __ } from "@wordpress/i18n";
import { chevronRight, chevronLeft } from "@wordpress/icons";
import { useReducedMotion } from "@wordpress/compose";

// packages/boot/src/components/navigation/navigation-screen/style.scss
if (typeof document !== "undefined" && process.env.NODE_ENV !== "test" && !document.head.querySelector("style[data-wp-hash='c52b1efb2f']")) {
  const style = document.createElement("style");
  style.setAttribute("data-wp-hash", "c52b1efb2f");
  style.appendChild(document.createTextNode(".boot-navigation-screen{padding-block-end:4px}.boot-navigation-screen .components-text{color:var(--wpds-color-fg-content-neutral,#1e1e1e)}.boot-navigation-screen__title-icon{padding:12px 16px 8px;position:sticky;top:0}.boot-navigation-screen__title{flex-grow:1;overflow-wrap:break-word}.boot-navigation-screen__title.boot-navigation-screen__title,.boot-navigation-screen__title.boot-navigation-screen__title .boot-navigation-screen__title{color:var(--wpds-color-fg-content-neutral,#1e1e1e);line-height:32px}.boot-navigation-screen__actions{display:flex;flex-shrink:0}"));
  document.head.appendChild(style);
}

// packages/boot/src/components/navigation/navigation-screen/index.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var ANIMATION_DURATION = 0.3;
var slideVariants = {
  initial: (direction) => ({
    x: direction === "forward" ? 100 : -100,
    opacity: 0
  }),
  animate: {
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    x: direction === "forward" ? 100 : -100,
    opacity: 0
  })
};
function NavigationScreen({
  isRoot,
  title,
  actions,
  content,
  description,
  animationDirection,
  backMenuItem,
  backButtonRef,
  navigationKey,
  onNavigate
}) {
  const icon = isRTL() ? chevronRight : chevronLeft;
  const disableMotion = useReducedMotion();
  const handleBackClick = (e) => {
    e.preventDefault();
    onNavigate({ id: backMenuItem, direction: "backward" });
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "boot-navigation-screen",
      style: {
        overflow: "hidden",
        position: "relative",
        display: "grid",
        gridTemplateColumns: "1fr",
        gridTemplateRows: "1fr"
      },
      children: /* @__PURE__ */ jsx(AnimatePresence, { initial: false, children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          custom: animationDirection,
          variants: slideVariants,
          initial: "initial",
          animate: "animate",
          exit: "exit",
          transition: {
            type: "tween",
            duration: disableMotion ? 0 : ANIMATION_DURATION,
            ease: [0.33, 0, 0, 1]
          },
          style: {
            width: "100%",
            gridColumn: "1",
            gridRow: "1"
          },
          children: [
            /* @__PURE__ */ jsxs(
              HStack,
              {
                spacing: 2,
                className: "boot-navigation-screen__title-icon",
                children: [
                  !isRoot && /* @__PURE__ */ jsx(
                    Button,
                    {
                      ref: backButtonRef,
                      icon,
                      onClick: handleBackClick,
                      label: __("Back"),
                      size: "small",
                      variant: "tertiary"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Heading,
                    {
                      className: "boot-navigation-screen__title",
                      level: 1,
                      size: "15px",
                      children: title
                    }
                  ),
                  actions && /* @__PURE__ */ jsx("div", { className: "boot-navigation-screen__actions", children: actions })
                ]
              }
            ),
            description && /* @__PURE__ */ jsx("div", { className: "boot-navigation-screen__description", children: description }),
            content
          ]
        },
        navigationKey
      ) })
    }
  );
}
export {
  NavigationScreen as default
};
//# sourceMappingURL=index.mjs.map
