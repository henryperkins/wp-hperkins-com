// packages/editor/src/components/header/header-skeleton.js
import clsx from "clsx";
import { __unstableMotion as motion } from "@wordpress/components";
import BackButton, { useHasBackButton } from "./back-button.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var toolbarVariations = {
  distractionFreeDisabled: { y: "-50px" },
  distractionFreeHover: { y: 0 },
  distractionFreeHidden: { y: "-50px" },
  visible: { y: 0 },
  hidden: { y: 0 }
};
var backButtonVariations = {
  distractionFreeDisabled: { x: "-100%" },
  distractionFreeHover: { x: 0 },
  distractionFreeHidden: { x: "-100%" },
  visible: { x: 0 },
  hidden: { x: 0 }
};
function HeaderSkeleton({
  className,
  toolbar,
  center,
  settings
}) {
  const hasBackButton = useHasBackButton();
  return /* @__PURE__ */ jsxs("div", { className: clsx("editor-header edit-post-header", className), children: [
    hasBackButton && /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "editor-header__back-button",
        variants: backButtonVariations,
        transition: { type: "tween" },
        children: /* @__PURE__ */ jsx(BackButton.Slot, {})
      }
    ),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        variants: toolbarVariations,
        className: "editor-header__toolbar",
        transition: { type: "tween" },
        children: toolbar
      }
    ),
    center && /* @__PURE__ */ jsx(
      motion.div,
      {
        variants: toolbarVariations,
        className: "editor-header__center",
        transition: { type: "tween" },
        children: center
      }
    ),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        variants: toolbarVariations,
        transition: { type: "tween" },
        className: "editor-header__settings",
        children: settings
      }
    )
  ] });
}
export {
  HeaderSkeleton as default
};
//# sourceMappingURL=header-skeleton.mjs.map
