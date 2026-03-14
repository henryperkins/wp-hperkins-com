"use strict";
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

// packages/edit-site/src/components/layout/index.js
var layout_exports = {};
__export(layout_exports, {
  default: () => LayoutWithGlobalStylesProvider
});
module.exports = __toCommonJS(layout_exports);
var import_clsx = __toESM(require("clsx"));
var import_admin_ui = require("@wordpress/admin-ui");
var import_components = require("@wordpress/components");
var import_compose = require("@wordpress/compose");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_editor = require("@wordpress/editor");
var import_router = require("@wordpress/router");
var import_plugins = require("@wordpress/plugins");
var import_notices = require("@wordpress/notices");
var import_data = require("@wordpress/data");
var import_preferences = require("@wordpress/preferences");
var import_site_hub = __toESM(require("../site-hub/index.cjs"));
var import_resizable_frame = __toESM(require("../resizable-frame/index.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_save_keyboard_shortcut = __toESM(require("../save-keyboard-shortcut/index.cjs"));
var import_hooks = require("./hooks.cjs");
var import_animation = __toESM(require("./animation.cjs"));
var import_sidebar = require("../sidebar/index.cjs");
var import_save_hub = __toESM(require("../save-hub/index.cjs"));
var import_save_panel = __toESM(require("../save-panel/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var { useLocation } = (0, import_lock_unlock.unlock)(import_router.privateApis);
var { useStyle } = (0, import_lock_unlock.unlock)(import_editor.privateApis);
var ANIMATION_DURATION = 0.3;
function Layout() {
  const { query, name: routeKey, areas, widths } = useLocation();
  const canvas = routeKey === "notfound" ? "view" : query?.canvas ?? "view";
  const isMobileViewport = (0, import_compose.useViewportMatch)("medium", "<");
  const toggleRef = (0, import_element.useRef)();
  const navigateRegionsProps = (0, import_components.__unstableUseNavigateRegions)();
  const disableMotion = (0, import_compose.useReducedMotion)();
  const [canvasResizer, canvasSize] = (0, import_compose.useResizeObserver)();
  const isEditorLoading = (0, import_hooks.useIsSiteEditorLoading)();
  const [isResizableFrameOversized, setIsResizableFrameOversized] = (0, import_element.useState)(false);
  const animationRef = (0, import_animation.default)({
    triggerAnimationOnChange: routeKey + "-" + canvas
  });
  const { showIconLabels } = (0, import_data.useSelect)((select) => {
    return {
      showIconLabels: select(import_preferences.store).get(
        "core",
        "showIconLabels"
      )
    };
  });
  const backgroundColor = useStyle("color.background");
  const gradientValue = useStyle("color.gradient");
  const previousCanvaMode = (0, import_compose.usePrevious)(canvas);
  (0, import_element.useEffect)(() => {
    if (previousCanvaMode === "edit") {
      toggleRef.current?.focus();
    }
  }, [canvas]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.UnsavedChangesWarning, {}),
    canvas === "view" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_save_keyboard_shortcut.default, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        ...navigateRegionsProps,
        ref: navigateRegionsProps.ref,
        className: (0, import_clsx.default)(
          "edit-site-layout",
          navigateRegionsProps.className,
          {
            "is-full-canvas": canvas === "edit",
            "show-icon-labels": showIconLabels
          }
        ),
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "edit-site-layout__content", children: [
          (!isMobileViewport || !areas.mobile) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_admin_ui.NavigableRegion,
            {
              ariaLabel: (0, import_i18n.__)("Navigation"),
              className: "edit-site-layout__sidebar-region",
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__unstableAnimatePresence, { children: canvas === "view" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                import_components.__unstableMotion.div,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  exit: { opacity: 0 },
                  transition: {
                    type: "tween",
                    duration: (
                      // Disable transition in mobile to emulate a full page transition.
                      disableMotion || isMobileViewport ? 0 : ANIMATION_DURATION
                    ),
                    ease: "easeOut"
                  },
                  className: "edit-site-layout__sidebar",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_site_hub.default,
                      {
                        ref: toggleRef,
                        isTransparent: isResizableFrameOversized
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_sidebar.SidebarNavigationProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_sidebar.SidebarContent,
                      {
                        shouldAnimate: routeKey !== "styles" && routeKey !== "identity",
                        routeKey,
                        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.ErrorBoundary, { children: areas.sidebar })
                      }
                    ) }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_save_hub.default, {}),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_save_panel.default, {})
                  ]
                }
              ) })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_notices.SnackbarNotices, { className: "edit-site-layout__snackbar" }),
          isMobileViewport && areas.mobile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "edit-site-layout__mobile", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_sidebar.SidebarNavigationProvider, { children: canvas !== "edit" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_site_hub.SiteHubMobile,
              {
                ref: toggleRef,
                isTransparent: isResizableFrameOversized
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_sidebar.SidebarContent, { routeKey, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.ErrorBoundary, { children: areas.mobile }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_save_hub.default, {}),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_save_panel.default, {})
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.ErrorBoundary, { children: areas.mobile }) }) }),
          !isMobileViewport && areas.content && canvas !== "edit" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "div",
            {
              className: "edit-site-layout__area",
              style: {
                maxWidth: widths?.content
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.ErrorBoundary, { children: areas.content })
            }
          ),
          !isMobileViewport && areas.edit && canvas !== "edit" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "div",
            {
              className: "edit-site-layout__area",
              style: {
                maxWidth: widths?.edit
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.ErrorBoundary, { children: areas.edit })
            }
          ),
          !isMobileViewport && areas.preview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "edit-site-layout__canvas-container", children: [
            canvasResizer,
            !!canvasSize.width && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "div",
              {
                className: (0, import_clsx.default)(
                  "edit-site-layout__canvas",
                  {
                    "is-right-aligned": isResizableFrameOversized
                  }
                ),
                ref: animationRef,
                children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.ErrorBoundary, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_resizable_frame.default,
                  {
                    isReady: !isEditorLoading,
                    isFullWidth: canvas === "edit",
                    defaultSize: {
                      width: canvasSize.width - 24,
                      height: canvasSize.height
                    },
                    isOversized: isResizableFrameOversized,
                    setIsOversized: setIsResizableFrameOversized,
                    innerContentStyle: {
                      background: gradientValue ?? backgroundColor
                    },
                    children: areas.preview
                  }
                ) })
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
function LayoutWithGlobalStylesProvider(props) {
  const { createErrorNotice } = (0, import_data.useDispatch)(import_notices.store);
  function onPluginAreaError(name) {
    createErrorNotice(
      (0, import_i18n.sprintf)(
        /* translators: %s: plugin name */
        (0, import_i18n.__)(
          'The "%s" plugin has encountered an error and cannot be rendered.'
        ),
        name
      )
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.SlotFillProvider, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_plugins.PluginArea, { onError: onPluginAreaError }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout, { ...props })
  ] });
}
//# sourceMappingURL=index.cjs.map
