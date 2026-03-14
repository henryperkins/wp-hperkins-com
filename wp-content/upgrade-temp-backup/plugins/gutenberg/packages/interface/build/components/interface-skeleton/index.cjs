var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/interface/src/components/interface-skeleton/index.js
var interface_skeleton_exports = {};
__export(interface_skeleton_exports, {
  default: () => interface_skeleton_default
});
module.exports = __toCommonJS(interface_skeleton_exports);
var import_clsx = __toESM(require("clsx"));
var import_admin_ui = require("@wordpress/admin-ui");
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_compose = require("@wordpress/compose");
var import_jsx_runtime = require("react/jsx-runtime");
var ANIMATION_DURATION = 0.25;
var commonTransition = {
  type: "tween",
  duration: ANIMATION_DURATION,
  ease: [0.6, 0, 0.4, 1]
};
function useHTMLClass(className) {
  (0, import_element.useEffect)(() => {
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
  const [secondarySidebarResizeListener, secondarySidebarSize] = (0, import_compose.useResizeObserver)();
  const isMobileViewport = (0, import_compose.useViewportMatch)("medium", "<");
  const disableMotion = (0, import_compose.useReducedMotion)();
  const defaultTransition = {
    type: "tween",
    duration: disableMotion ? 0 : ANIMATION_DURATION,
    ease: [0.6, 0, 0.4, 1]
  };
  useHTMLClass("interface-interface-skeleton__html-container");
  const defaultLabels = {
    /* translators: accessibility text for the top bar landmark region. */
    header: (0, import_i18n._x)("Header", "header landmark area"),
    /* translators: accessibility text for the content landmark region. */
    body: (0, import_i18n.__)("Content"),
    /* translators: accessibility text for the secondary sidebar landmark region. */
    secondarySidebar: (0, import_i18n.__)("Block Library"),
    /* translators: accessibility text for the settings landmark region. */
    sidebar: (0, import_i18n._x)("Settings", "settings landmark area"),
    /* translators: accessibility text for the publish landmark region. */
    actions: (0, import_i18n.__)("Publish"),
    /* translators: accessibility text for the footer landmark region. */
    footer: (0, import_i18n.__)("Footer")
  };
  const mergedLabels = { ...defaultLabels, ...labels };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      ref,
      className: (0, import_clsx.default)(
        className,
        "interface-interface-skeleton",
        !!footer && "has-footer"
      ),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "interface-interface-skeleton__editor", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__unstableAnimatePresence, { initial: false, children: !!header && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_admin_ui.NavigableRegion,
            {
              as: import_components.__unstableMotion.div,
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
          isDistractionFree && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "interface-interface-skeleton__header", children: editorNotices }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "interface-interface-skeleton__body", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__unstableAnimatePresence, { initial: false, children: !!secondarySidebar && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_admin_ui.NavigableRegion,
              {
                className: "interface-interface-skeleton__secondary-sidebar",
                ariaLabel: mergedLabels.secondarySidebar,
                as: import_components.__unstableMotion.div,
                initial: "closed",
                animate: "open",
                exit: "closed",
                variants: {
                  open: { width: secondarySidebarSize.width },
                  closed: { width: 0 }
                },
                transition: defaultTransition,
                children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  import_components.__unstableMotion.div,
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
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_admin_ui.NavigableRegion,
              {
                className: "interface-interface-skeleton__content",
                ariaLabel: mergedLabels.body,
                children: content
              }
            ),
            !!sidebar && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_admin_ui.NavigableRegion,
              {
                className: "interface-interface-skeleton__sidebar",
                ariaLabel: mergedLabels.sidebar,
                children: sidebar
              }
            ),
            !!actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_admin_ui.NavigableRegion,
              {
                className: "interface-interface-skeleton__actions",
                ariaLabel: mergedLabels.actions,
                children: actions
              }
            )
          ] })
        ] }),
        !!footer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_admin_ui.NavigableRegion,
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
var interface_skeleton_default = (0, import_element.forwardRef)(InterfaceSkeleton);
//# sourceMappingURL=index.cjs.map
