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

// packages/edit-site/src/components/resizable-frame/index.js
var resizable_frame_exports = {};
__export(resizable_frame_exports, {
  default: () => resizable_frame_default
});
module.exports = __toCommonJS(resizable_frame_exports);
var import_clsx = __toESM(require("clsx"));
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_compose = require("@wordpress/compose");
var import_i18n = require("@wordpress/i18n");
var import_router = require("@wordpress/router");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_url = require("@wordpress/url");
var import_jsx_runtime = require("react/jsx-runtime");
var { useLocation, useHistory } = (0, import_lock_unlock.unlock)(import_router.privateApis);
var HANDLE_STYLES_OVERRIDE = {
  position: void 0,
  userSelect: void 0,
  cursor: void 0,
  width: void 0,
  height: void 0,
  top: void 0,
  right: void 0,
  bottom: void 0,
  left: void 0
};
var FRAME_MIN_WIDTH = 320;
var FRAME_REFERENCE_WIDTH = 1300;
var FRAME_TARGET_ASPECT_RATIO = 9 / 19.5;
var SNAP_TO_EDIT_CANVAS_MODE_THRESHOLD = 200;
var INITIAL_FRAME_SIZE = { width: "100%", height: "100%" };
function calculateNewHeight(width, initialAspectRatio) {
  const lerp = (a, b, amount) => {
    return a + (b - a) * amount;
  };
  const lerpFactor = 1 - Math.max(
    0,
    Math.min(
      1,
      (width - FRAME_MIN_WIDTH) / (FRAME_REFERENCE_WIDTH - FRAME_MIN_WIDTH)
    )
  );
  const intermediateAspectRatio = lerp(
    initialAspectRatio,
    FRAME_TARGET_ASPECT_RATIO,
    lerpFactor
  );
  return width / intermediateAspectRatio;
}
function ResizableFrame({
  isFullWidth,
  isOversized,
  setIsOversized,
  isReady,
  children,
  /** The default (unresized) width/height of the frame, based on the space available in the viewport. */
  defaultSize,
  innerContentStyle
}) {
  const history = useHistory();
  const { path, query } = useLocation();
  const { canvas = "view" } = query;
  const disableMotion = (0, import_compose.useReducedMotion)();
  const [frameSize, setFrameSize] = (0, import_element.useState)(INITIAL_FRAME_SIZE);
  const [startingWidth, setStartingWidth] = (0, import_element.useState)();
  const [isResizing, setIsResizing] = (0, import_element.useState)(false);
  const [shouldShowHandle, setShouldShowHandle] = (0, import_element.useState)(false);
  const [resizeRatio, setResizeRatio] = (0, import_element.useState)(1);
  const FRAME_TRANSITION = { type: "tween", duration: isResizing ? 0 : 0.5 };
  const frameRef = (0, import_element.useRef)(null);
  const resizableHandleHelpId = (0, import_compose.useInstanceId)(
    ResizableFrame,
    "edit-site-resizable-frame-handle-help"
  );
  const defaultAspectRatio = defaultSize.width / defaultSize.height;
  const isBlockTheme = (0, import_data.useSelect)((select) => {
    const { getCurrentTheme } = select(import_core_data.store);
    return getCurrentTheme()?.is_block_theme;
  }, []);
  const handleResizeStart = (_event, _direction, ref) => {
    setStartingWidth(ref.offsetWidth);
    setIsResizing(true);
  };
  const handleResize = (_event, _direction, _ref, delta) => {
    const normalizedDelta = delta.width / resizeRatio;
    const deltaAbs = Math.abs(normalizedDelta);
    const maxDoubledDelta = delta.width < 0 ? deltaAbs : (defaultSize.width - startingWidth) / 2;
    const deltaToDouble = Math.min(deltaAbs, maxDoubledDelta);
    const doubleSegment = deltaAbs === 0 ? 0 : deltaToDouble / deltaAbs;
    const singleSegment = 1 - doubleSegment;
    setResizeRatio(singleSegment + doubleSegment * 2);
    const updatedWidth = startingWidth + delta.width;
    setIsOversized(updatedWidth > defaultSize.width);
    setFrameSize({
      height: isOversized ? "100%" : calculateNewHeight(updatedWidth, defaultAspectRatio)
    });
  };
  const handleResizeStop = (_event, _direction, ref) => {
    setIsResizing(false);
    if (!isOversized) {
      return;
    }
    setIsOversized(false);
    const remainingWidth = ref.ownerDocument.documentElement.offsetWidth - ref.offsetWidth;
    if (remainingWidth > SNAP_TO_EDIT_CANVAS_MODE_THRESHOLD || !isBlockTheme) {
      setFrameSize(INITIAL_FRAME_SIZE);
    } else {
      history.navigate(
        (0, import_url.addQueryArgs)(path, {
          canvas: "edit"
        }),
        {
          transition: "canvas-mode-edit-transition"
        }
      );
    }
  };
  const handleResizableHandleKeyDown = (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) {
      return;
    }
    event.preventDefault();
    const step = 20 * (event.shiftKey ? 5 : 1);
    const delta = step * (event.key === "ArrowLeft" ? 1 : -1) * ((0, import_i18n.isRTL)() ? -1 : 1);
    const newWidth = Math.min(
      Math.max(
        FRAME_MIN_WIDTH,
        frameRef.current.resizable.offsetWidth + delta
      ),
      defaultSize.width
    );
    setFrameSize({
      width: newWidth,
      height: calculateNewHeight(newWidth, defaultAspectRatio)
    });
  };
  const frameAnimationVariants = {
    default: {
      flexGrow: 0,
      height: frameSize.height
    },
    fullWidth: {
      flexGrow: 1,
      height: frameSize.height
    }
  };
  const resizeHandleVariants = {
    hidden: {
      opacity: 0,
      ...(0, import_i18n.isRTL)() ? { right: 0 } : { left: 0 }
    },
    visible: {
      opacity: 1,
      // Account for the handle's width.
      ...(0, import_i18n.isRTL)() ? { right: -14 } : { left: -14 }
    },
    active: {
      opacity: 1,
      // Account for the handle's width.
      ...(0, import_i18n.isRTL)() ? { right: -14 } : { left: -14 },
      scaleY: 1.3
    }
  };
  const currentResizeHandleVariant = (() => {
    if (isResizing) {
      return "active";
    }
    return shouldShowHandle ? "visible" : "hidden";
  })();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.ResizableBox,
    {
      as: import_components.__unstableMotion.div,
      ref: frameRef,
      initial: false,
      variants: frameAnimationVariants,
      animate: isFullWidth ? "fullWidth" : "default",
      onAnimationComplete: (definition) => {
        if (definition === "fullWidth") {
          setFrameSize({ width: "100%", height: "100%" });
        }
      },
      whileHover: canvas === "view" && isBlockTheme ? {
        scale: 1.005,
        transition: {
          duration: disableMotion ? 0 : 0.5,
          ease: "easeOut"
        }
      } : {},
      transition: FRAME_TRANSITION,
      size: frameSize,
      enable: {
        top: false,
        bottom: false,
        // Resizing will be disabled until the editor content is loaded.
        ...(0, import_i18n.isRTL)() ? { right: isReady, left: false } : { left: isReady, right: false },
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false
      },
      resizeRatio,
      handleClasses: void 0,
      handleStyles: {
        left: HANDLE_STYLES_OVERRIDE,
        right: HANDLE_STYLES_OVERRIDE
      },
      minWidth: FRAME_MIN_WIDTH,
      maxWidth: isFullWidth ? "100%" : "150%",
      maxHeight: "100%",
      onFocus: () => setShouldShowHandle(true),
      onBlur: () => setShouldShowHandle(false),
      onMouseOver: () => setShouldShowHandle(true),
      onMouseOut: () => setShouldShowHandle(false),
      handleComponent: {
        [(0, import_i18n.isRTL)() ? "right" : "left"]: canvas === "view" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Tooltip, { text: (0, import_i18n.__)("Drag to resize"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.__unstableMotion.button,
            {
              role: "separator",
              "aria-orientation": "vertical",
              className: (0, import_clsx.default)(
                "edit-site-resizable-frame__handle",
                { "is-resizing": isResizing }
              ),
              variants: resizeHandleVariants,
              animate: currentResizeHandleVariant,
              "aria-label": (0, import_i18n.__)("Drag to resize"),
              "aria-describedby": resizableHandleHelpId,
              "aria-valuenow": frameRef.current?.resizable?.offsetWidth || void 0,
              "aria-valuemin": FRAME_MIN_WIDTH,
              "aria-valuemax": defaultSize.width,
              onKeyDown: handleResizableHandleKeyDown,
              initial: "hidden",
              exit: "hidden",
              whileFocus: "active",
              whileHover: "active"
            },
            "handle"
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { hidden: true, id: resizableHandleHelpId, children: (0, import_i18n.__)(
            "Use left and right arrow keys to resize the canvas. Hold shift to resize in larger increments."
          ) })
        ] })
      },
      onResizeStart: handleResizeStart,
      onResize: handleResize,
      onResizeStop: handleResizeStop,
      className: (0, import_clsx.default)("edit-site-resizable-frame__inner", {
        "is-resizing": isResizing
      }),
      showHandle: false,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "div",
        {
          className: "edit-site-resizable-frame__inner-content",
          style: innerContentStyle,
          children
        }
      )
    }
  );
}
var resizable_frame_default = ResizableFrame;
//# sourceMappingURL=index.cjs.map
