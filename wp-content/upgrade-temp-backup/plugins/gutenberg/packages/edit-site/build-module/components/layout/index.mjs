// packages/edit-site/src/components/layout/index.js
import clsx from "clsx";
import { NavigableRegion } from "@wordpress/admin-ui";
import {
  __unstableMotion as motion,
  __unstableAnimatePresence as AnimatePresence,
  __unstableUseNavigateRegions as useNavigateRegions,
  SlotFillProvider
} from "@wordpress/components";
import {
  useReducedMotion,
  useViewportMatch,
  useResizeObserver,
  usePrevious
} from "@wordpress/compose";
import { __, sprintf } from "@wordpress/i18n";
import { useState, useRef, useEffect } from "@wordpress/element";
import {
  UnsavedChangesWarning,
  ErrorBoundary,
  privateApis as editorPrivateApis
} from "@wordpress/editor";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { PluginArea } from "@wordpress/plugins";
import { SnackbarNotices, store as noticesStore } from "@wordpress/notices";
import { useDispatch, useSelect } from "@wordpress/data";
import { store as preferencesStore } from "@wordpress/preferences";
import { default as SiteHub, SiteHubMobile } from "../site-hub/index.mjs";
import ResizableFrame from "../resizable-frame/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import SaveKeyboardShortcut from "../save-keyboard-shortcut/index.mjs";
import { useIsSiteEditorLoading } from "./hooks.mjs";
import useMovingAnimation from "./animation.mjs";
import { SidebarContent, SidebarNavigationProvider } from "../sidebar/index.mjs";
import SaveHub from "../save-hub/index.mjs";
import SavePanel from "../save-panel/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { useLocation } = unlock(routerPrivateApis);
var { useStyle } = unlock(editorPrivateApis);
var ANIMATION_DURATION = 0.3;
function Layout() {
  const { query, name: routeKey, areas, widths } = useLocation();
  const canvas = routeKey === "notfound" ? "view" : query?.canvas ?? "view";
  const isMobileViewport = useViewportMatch("medium", "<");
  const toggleRef = useRef();
  const navigateRegionsProps = useNavigateRegions();
  const disableMotion = useReducedMotion();
  const [canvasResizer, canvasSize] = useResizeObserver();
  const isEditorLoading = useIsSiteEditorLoading();
  const [isResizableFrameOversized, setIsResizableFrameOversized] = useState(false);
  const animationRef = useMovingAnimation({
    triggerAnimationOnChange: routeKey + "-" + canvas
  });
  const { showIconLabels } = useSelect((select) => {
    return {
      showIconLabels: select(preferencesStore).get(
        "core",
        "showIconLabels"
      )
    };
  });
  const backgroundColor = useStyle("color.background");
  const gradientValue = useStyle("color.gradient");
  const previousCanvaMode = usePrevious(canvas);
  useEffect(() => {
    if (previousCanvaMode === "edit") {
      toggleRef.current?.focus();
    }
  }, [canvas]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(UnsavedChangesWarning, {}),
    canvas === "view" && /* @__PURE__ */ jsx(SaveKeyboardShortcut, {}),
    /* @__PURE__ */ jsx(
      "div",
      {
        ...navigateRegionsProps,
        ref: navigateRegionsProps.ref,
        className: clsx(
          "edit-site-layout",
          navigateRegionsProps.className,
          {
            "is-full-canvas": canvas === "edit",
            "show-icon-labels": showIconLabels
          }
        ),
        children: /* @__PURE__ */ jsxs("div", { className: "edit-site-layout__content", children: [
          (!isMobileViewport || !areas.mobile) && /* @__PURE__ */ jsx(
            NavigableRegion,
            {
              ariaLabel: __("Navigation"),
              className: "edit-site-layout__sidebar-region",
              children: /* @__PURE__ */ jsx(AnimatePresence, { children: canvas === "view" && /* @__PURE__ */ jsxs(
                motion.div,
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
                    /* @__PURE__ */ jsx(
                      SiteHub,
                      {
                        ref: toggleRef,
                        isTransparent: isResizableFrameOversized
                      }
                    ),
                    /* @__PURE__ */ jsx(SidebarNavigationProvider, { children: /* @__PURE__ */ jsx(
                      SidebarContent,
                      {
                        shouldAnimate: routeKey !== "styles" && routeKey !== "identity",
                        routeKey,
                        children: /* @__PURE__ */ jsx(ErrorBoundary, { children: areas.sidebar })
                      }
                    ) }),
                    /* @__PURE__ */ jsx(SaveHub, {}),
                    /* @__PURE__ */ jsx(SavePanel, {})
                  ]
                }
              ) })
            }
          ),
          /* @__PURE__ */ jsx(SnackbarNotices, { className: "edit-site-layout__snackbar" }),
          isMobileViewport && areas.mobile && /* @__PURE__ */ jsx("div", { className: "edit-site-layout__mobile", children: /* @__PURE__ */ jsx(SidebarNavigationProvider, { children: canvas !== "edit" ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              SiteHubMobile,
              {
                ref: toggleRef,
                isTransparent: isResizableFrameOversized
              }
            ),
            /* @__PURE__ */ jsx(SidebarContent, { routeKey, children: /* @__PURE__ */ jsx(ErrorBoundary, { children: areas.mobile }) }),
            /* @__PURE__ */ jsx(SaveHub, {}),
            /* @__PURE__ */ jsx(SavePanel, {})
          ] }) : /* @__PURE__ */ jsx(ErrorBoundary, { children: areas.mobile }) }) }),
          !isMobileViewport && areas.content && canvas !== "edit" && /* @__PURE__ */ jsx(
            "div",
            {
              className: "edit-site-layout__area",
              style: {
                maxWidth: widths?.content
              },
              children: /* @__PURE__ */ jsx(ErrorBoundary, { children: areas.content })
            }
          ),
          !isMobileViewport && areas.edit && canvas !== "edit" && /* @__PURE__ */ jsx(
            "div",
            {
              className: "edit-site-layout__area",
              style: {
                maxWidth: widths?.edit
              },
              children: /* @__PURE__ */ jsx(ErrorBoundary, { children: areas.edit })
            }
          ),
          !isMobileViewport && areas.preview && /* @__PURE__ */ jsxs("div", { className: "edit-site-layout__canvas-container", children: [
            canvasResizer,
            !!canvasSize.width && /* @__PURE__ */ jsx(
              "div",
              {
                className: clsx(
                  "edit-site-layout__canvas",
                  {
                    "is-right-aligned": isResizableFrameOversized
                  }
                ),
                ref: animationRef,
                children: /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsx(
                  ResizableFrame,
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
  const { createErrorNotice } = useDispatch(noticesStore);
  function onPluginAreaError(name) {
    createErrorNotice(
      sprintf(
        /* translators: %s: plugin name */
        __(
          'The "%s" plugin has encountered an error and cannot be rendered.'
        ),
        name
      )
    );
  }
  return /* @__PURE__ */ jsxs(SlotFillProvider, { children: [
    /* @__PURE__ */ jsx(PluginArea, { onError: onPluginAreaError }),
    /* @__PURE__ */ jsx(Layout, { ...props })
  ] });
}
export {
  LayoutWithGlobalStylesProvider as default
};
//# sourceMappingURL=index.mjs.map
