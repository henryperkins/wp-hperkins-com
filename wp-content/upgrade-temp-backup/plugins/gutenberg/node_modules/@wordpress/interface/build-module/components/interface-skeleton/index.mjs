// packages/interface/src/components/interface-skeleton/index.js
import clsx from "clsx";
import { NavigableRegion } from "@wordpress/admin-ui";
import { forwardRef, useEffect } from "@wordpress/element";
import {
  __unstableMotion as motion,
  __unstableAnimatePresence as AnimatePresence
} from "@wordpress/components";
import { __, _x } from "@wordpress/i18n";
import {
  useReducedMotion,
  useViewportMatch,
  useResizeObserver
} from "@wordpress/compose";
import { jsx, jsxs } from "react/jsx-runtime";
var ANIMATION_DURATION = 0.25;
var commonTransition = {
  type: "tween",
  duration: ANIMATION_DURATION,
  ease: [0.6, 0, 0.4, 1]
};
function useHTMLClass(className) {
  useEffect(() => {
    const element = document && document.querySelector(`html:not(.${className})`);
    if (!element) {
      return;
    }
    element.classList.toggle(className);
    return () => {
      element.classList.toggle(className);
    };
  }, [className]);
}
var headerVariants = {
  hidden: { opacity: 1, marginTop: -60 },
  visible: { opacity: 1, marginTop: 0 },
  distractionFreeHover: {
    opacity: 1,
    marginTop: 0,
    transition: {
      ...commonTransition,
      delay: 0.2,
      delayChildren: 0.2
    }
  },
  distractionFreeHidden: {
    opacity: 0,
    marginTop: -60
  },
  distractionFreeDisabled: {
    opacity: 0,
    marginTop: 0,
    transition: {
      ...commonTransition,
      delay: 0.8,
      delayChildren: 0.8
    }
  }
};
function InterfaceSkeleton({
  isDistractionFree,
  footer,
  header,
  editorNotices,
  sidebar,
  secondarySidebar,
  content,
  actions,
  labels,
  className
}, ref) {
  const [secondarySidebarResizeListener, secondarySidebarSize] = useResizeObserver();
  const isMobileViewport = useViewportMatch("medium", "<");
  const disableMotion = useReducedMotion();
  const defaultTransition = {
    type: "tween",
    duration: disableMotion ? 0 : ANIMATION_DURATION,
    ease: [0.6, 0, 0.4, 1]
  };
  useHTMLClass("interface-interface-skeleton__html-container");
  const defaultLabels = {
    /* translators: accessibility text for the top bar landmark region. */
    header: _x("Header", "header landmark area"),
    /* translators: accessibility text for the content landmark region. */
    body: __("Content"),
    /* translators: accessibility text for the secondary sidebar landmark region. */
    secondarySidebar: __("Block Library"),
    /* translators: accessibility text for the settings landmark region. */
    sidebar: _x("Settings", "settings landmark area"),
    /* translators: accessibility text for the publish landmark region. */
    actions: __("Publish"),
    /* translators: accessibility text for the footer landmark region. */
    footer: __("Footer")
  };
  const mergedLabels = { ...defaultLabels, ...labels };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      className: clsx(
        className,
        "interface-interface-skeleton",
        !!footer && "has-footer"
      ),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "interface-interface-skeleton__editor", children: [
          /* @__PURE__ */ jsx(AnimatePresence, { initial: false, children: !!header && /* @__PURE__ */ jsx(
            NavigableRegion,
            {
              as: motion.div,
              className: "interface-interface-skeleton__header",
              ariaLabel: mergedLabels.header,
              initial: isDistractionFree && !isMobileViewport ? "distractionFreeHidden" : "hidden",
              whileHover: isDistractionFree && !isMobileViewport ? "distractionFreeHover" : "visible",
              animate: isDistractionFree && !isMobileViewport ? "distractionFreeDisabled" : "visible",
              exit: isDistractionFree && !isMobileViewport ? "distractionFreeHidden" : "hidden",
              variants: headerVariants,
              transition: defaultTransition,
              children: header
            }
          ) }),
          isDistractionFree && /* @__PURE__ */ jsx("div", { className: "interface-interface-skeleton__header", children: editorNotices }),
          /* @__PURE__ */ jsxs("div", { className: "interface-interface-skeleton__body", children: [
            /* @__PURE__ */ jsx(AnimatePresence, { initial: false, children: !!secondarySidebar && /* @__PURE__ */ jsx(
              NavigableRegion,
              {
                className: "interface-interface-skeleton__secondary-sidebar",
                ariaLabel: mergedLabels.secondarySidebar,
                as: motion.div,
                initial: "closed",
                animate: "open",
                exit: "closed",
                variants: {
                  open: { width: secondarySidebarSize.width },
                  closed: { width: 0 }
                },
                transition: defaultTransition,
                children: /* @__PURE__ */ jsxs(
                  motion.div,
                  {
                    style: {
                      position: "absolute",
                      width: isMobileViewport ? "100vw" : "fit-content",
                      height: "100%",
                      left: 0
                    },
                    variants: {
                      open: { x: 0 },
                      closed: { x: "-100%" }
                    },
                    transition: defaultTransition,
                    children: [
                      secondarySidebarResizeListener,
                      secondarySidebar
                    ]
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsx(
              NavigableRegion,
              {
                className: "interface-interface-skeleton__content",
                ariaLabel: mergedLabels.body,
                children: content
              }
            ),
            !!sidebar && /* @__PURE__ */ jsx(
              NavigableRegion,
              {
                className: "interface-interface-skeleton__sidebar",
                ariaLabel: mergedLabels.sidebar,
                children: sidebar
              }
            ),
            !!actions && /* @__PURE__ */ jsx(
              NavigableRegion,
              {
                className: "interface-interface-skeleton__actions",
                ariaLabel: mergedLabels.actions,
                children: actions
              }
            )
          ] })
        ] }),
        !!footer && /* @__PURE__ */ jsx(
          NavigableRegion,
          {
            className: "interface-interface-skeleton__footer",
            ariaLabel: mergedLabels.footer,
            children: footer
          }
        )
      ]
    }
  );
}
var interface_skeleton_default = forwardRef(InterfaceSkeleton);
export {
  interface_skeleton_default as default
};
//# sourceMappingURL=index.mjs.map
