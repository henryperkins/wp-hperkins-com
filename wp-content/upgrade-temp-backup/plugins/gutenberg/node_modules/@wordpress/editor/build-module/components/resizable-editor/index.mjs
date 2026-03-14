// packages/editor/src/components/resizable-editor/index.js
import clsx from "clsx";
import { useState, useRef, useCallback } from "@wordpress/element";
import { ResizableBox } from "@wordpress/components";
import ResizeHandle from "./resize-handle.mjs";
import { jsx } from "react/jsx-runtime";
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
function ResizableEditor({ className, enableResizing, height, children }) {
  const [width, setWidth] = useState("100%");
  const resizableRef = useRef();
  const resizeWidthBy = useCallback((deltaPixels) => {
    if (resizableRef.current) {
      setWidth(resizableRef.current.offsetWidth + deltaPixels);
    }
  }, []);
  return /* @__PURE__ */ jsx(
    ResizableBox,
    {
      className: clsx("editor-resizable-editor", className, {
        "is-resizable": enableResizing
      }),
      ref: (api) => {
        resizableRef.current = api?.resizable;
      },
      size: {
        width: enableResizing ? width : "100%",
        height: enableResizing && height ? height : "100%"
      },
      onResizeStop: (event, direction, element) => {
        setWidth(element.style.width);
      },
      minWidth: 300,
      maxWidth: "100%",
      maxHeight: "100%",
      enable: {
        left: enableResizing,
        right: enableResizing
      },
      showHandle: enableResizing,
      resizeRatio: 2,
      handleComponent: {
        left: /* @__PURE__ */ jsx(
          ResizeHandle,
          {
            direction: "left",
            resizeWidthBy
          }
        ),
        right: /* @__PURE__ */ jsx(
          ResizeHandle,
          {
            direction: "right",
            resizeWidthBy
          }
        )
      },
      handleClasses: void 0,
      handleStyles: {
        left: HANDLE_STYLES_OVERRIDE,
        right: HANDLE_STYLES_OVERRIDE
      },
      children
    }
  );
}
var resizable_editor_default = ResizableEditor;
export {
  resizable_editor_default as default
};
//# sourceMappingURL=index.mjs.map
