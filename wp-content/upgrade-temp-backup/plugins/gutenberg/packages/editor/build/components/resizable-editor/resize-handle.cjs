"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/resizable-editor/resize-handle.js
var resize_handle_exports = {};
__export(resize_handle_exports, {
  default: () => ResizeHandle
});
module.exports = __toCommonJS(resize_handle_exports);
var import_i18n = require("@wordpress/i18n");
var import_keycodes = require("@wordpress/keycodes");
var import_components = require("@wordpress/components");
var import_jsx_runtime = require("react/jsx-runtime");
var DELTA_DISTANCE = 20;
function ResizeHandle({ direction, resizeWidthBy }) {
  function handleKeyDown(event) {
    const { keyCode } = event;
    if (keyCode !== import_keycodes.LEFT && keyCode !== import_keycodes.RIGHT) {
      return;
    }
    event.preventDefault();
    if (direction === "left" && keyCode === import_keycodes.LEFT || direction === "right" && keyCode === import_keycodes.RIGHT) {
      resizeWidthBy(DELTA_DISTANCE);
    } else if (direction === "left" && keyCode === import_keycodes.RIGHT || direction === "right" && keyCode === import_keycodes.LEFT) {
      resizeWidthBy(-DELTA_DISTANCE);
    }
  }
  const resizeHandleVariants = {
    active: {
      opacity: 1,
      scaleY: 1.3
    }
  };
  const resizableHandleHelpId = `resizable-editor__resize-help-${direction}`;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Tooltip, { text: (0, import_i18n.__)("Drag to resize"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.__unstableMotion.button,
      {
        className: `editor-resizable-editor__resize-handle is-${direction}`,
        "aria-label": (0, import_i18n.__)("Drag to resize"),
        "aria-describedby": resizableHandleHelpId,
        onKeyDown: handleKeyDown,
        variants: resizeHandleVariants,
        whileFocus: "active",
        whileHover: "active",
        whileTap: "active",
        role: "separator",
        "aria-orientation": "vertical"
      },
      "handle"
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.VisuallyHidden, { id: resizableHandleHelpId, children: (0, import_i18n.__)("Use left and right arrow keys to resize the canvas.") })
  ] });
}
//# sourceMappingURL=resize-handle.cjs.map
