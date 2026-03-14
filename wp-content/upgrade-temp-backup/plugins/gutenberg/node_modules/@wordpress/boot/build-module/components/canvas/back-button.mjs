// packages/boot/src/components/canvas/back-button.tsx
import {
  Button,
  Icon,
  __unstableMotion as motion
} from "@wordpress/components";
import { arrowUpLeft } from "@wordpress/icons";
import { useReducedMotion } from "@wordpress/compose";
import { __ } from "@wordpress/i18n";
import SiteIcon from "../site-icon/index.mjs";

// packages/boot/src/components/canvas/back-button.scss
if (typeof document !== "undefined" && process.env.NODE_ENV !== "test" && !document.head.querySelector("style[data-wp-hash='68d99fe376']")) {
  const style = document.createElement("style");
  style.setAttribute("data-wp-hash", "68d99fe376");
  style.appendChild(document.createTextNode(".boot-canvas-back-button{height:64px;left:0;position:absolute;top:0;width:64px;z-index:100}.boot-canvas-back-button__container{height:100%;position:relative;width:100%}.boot-canvas-back-button__link.components-button{align-items:center;background:var(--wpds-color-bg-surface-neutral-weak,#f0f0f0);border-radius:0;display:inline-flex;height:64px;justify-content:center;padding:0;text-decoration:none;width:64px}@media not (prefers-reduced-motion){.boot-canvas-back-button__link.components-button{transition:outline .1s ease-out}}.boot-canvas-back-button__link.components-button:focus:not(:active){outline:var(--wpds-border-width-focus,var(--wp-admin-border-width-focus,2px)) solid var(--wpds-color-stroke-focus-brand,var(--wp-admin-theme-color,#3858e9));outline-offset:calc(var(--wpds-border-width-focus, var(--wp-admin-border-width-focus, 2px))*-1)}.boot-canvas-back-button__icon{align-items:center;background-color:#ccc;display:flex;height:64px;justify-content:center;left:0;pointer-events:none;position:absolute;top:0;width:64px}.boot-canvas-back-button__icon svg{fill:currentColor}.boot-canvas-back-button__icon.has-site-icon{-webkit-backdrop-filter:saturate(180%) blur(15px);backdrop-filter:saturate(180%) blur(15px);background-color:#fff9}.interface-interface-skeleton__header{margin-top:0!important}"));
  document.head.appendChild(style);
}

// packages/boot/src/components/canvas/back-button.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var toggleHomeIconVariants = {
  edit: {
    opacity: 0,
    scale: 0.2
  },
  hover: {
    opacity: 1,
    scale: 1,
    clipPath: "inset( 22% round 2px )"
  }
};
function BootBackButton({ length }) {
  const disableMotion = useReducedMotion();
  const handleBack = () => {
    window.history.back();
  };
  if (length > 1) {
    return null;
  }
  const transition = {
    duration: disableMotion ? 0 : 0.3
  };
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      className: "boot-canvas-back-button",
      animate: "edit",
      initial: "edit",
      whileHover: "hover",
      whileTap: "tap",
      transition,
      children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            className: "boot-canvas-back-button__link",
            onClick: handleBack,
            "aria-label": __("Go back"),
            __next40pxDefaultSize: true,
            children: /* @__PURE__ */ jsx(SiteIcon, {})
          }
        ),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            className: "boot-canvas-back-button__icon",
            variants: toggleHomeIconVariants,
            children: /* @__PURE__ */ jsx(Icon, { icon: arrowUpLeft })
          }
        )
      ]
    }
  );
}
export {
  BootBackButton as default
};
//# sourceMappingURL=back-button.mjs.map
