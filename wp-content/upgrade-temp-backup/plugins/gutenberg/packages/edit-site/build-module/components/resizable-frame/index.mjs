// packages/edit-site/src/components/resizable-frame/index.js
import clsx from "clsx";
import { useState, useRef } from "@wordpress/element";
import {
  ResizableBox,
  Tooltip,
  __unstableMotion as motion
} from "@wordpress/components";
import { useInstanceId, useReducedMotion } from "@wordpress/compose";
import { __, isRTL } from "@wordpress/i18n";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { unlock } from "../../lock-unlock.mjs";
import { addQueryArgs } from "@wordpress/url";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { useLocation, useHistory } = unlock(routerPrivateApis);
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
  const disableMotion = useReducedMotion();
  const [frameSize, setFrameSize] = useState(INITIAL_FRAME_SIZE);
  const [startingWidth, setStartingWidth] = useState();
  const [isResizing, setIsResizing] = useState(false);
  const [shouldShowHandle, setShouldShowHandle] = useState(false);
  const [resizeRatio, setResizeRatio] = useState(1);
  const FRAME_TRANSITION = { type: "tween", duration: isResizing ? 0 : 0.5 };
  const frameRef = useRef(null);
  const resizableHandleHelpId = useInstanceId(
    ResizableFrame,
    "edit-site-resizable-frame-handle-help"
  );
  const defaultAspectRatio = defaultSize.width / defaultSize.height;
  const isBlockTheme = useSelect((select) => {
    const { getCurrentTheme } = select(coreStore);
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
        addQueryArgs(path, {
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
    const delta = step * (event.key === "ArrowLeft" ? 1 : -1) * (isRTL() ? -1 : 1);
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
      ...isRTL() ? { right: 0 } : { left: 0 }
    },
    visible: {
      opacity: 1,
      // Account for the handle's width.
      ...isRTL() ? { right: -14 } : { left: -14 }
    },
    active: {
      opacity: 1,
      // Account for the handle's width.
      ...isRTL() ? { right: -14 } : { left: -14 },
      scaleY: 1.3
    }
  };
  const currentResizeHandleVariant = (() => {
    if (isResizing) {
      return "active";
    }
    return shouldShowHandle ? "visible" : "hidden";
  })();
  return /* @__PURE__ */ jsx(
    ResizableBox,
    {
      as: motion.div,
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
        ...isRTL() ? { right: isReady, left: false } : { left: isReady, right: false },
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
        [isRTL() ? "right" : "left"]: canvas === "view" && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Tooltip, { text: __("Drag to resize"), children: /* @__PURE__ */ jsx(
            motion.button,
            {
              role: "separator",
              "aria-orientation": "vertical",
              className: clsx(
                "edit-site-resizable-frame__handle",
                { "is-resizing": isResizing }
              ),
              variants: resizeHandleVariants,
              animate: currentResizeHandleVariant,
              "aria-label": __("Drag to resize"),
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
          /* @__PURE__ */ jsx("div", { hidden: true, id: resizableHandleHelpId, children: __(
            "Use left and right arrow keys to resize the canvas. Hold shift to resize in larger increments."
          ) })
        ] })
      },
      onResizeStart: handleResizeStart,
      onResize: handleResize,
      onResizeStop: handleResizeStop,
      className: clsx("edit-site-resizable-frame__inner", {
        "is-resizing": isResizing
      }),
      showHandle: false,
      children: /* @__PURE__ */ jsx(
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
export {
  resizable_frame_default as default
};
//# sourceMappingURL=index.mjs.map
