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

// packages/editor/src/components/resizable-editor/index.js
var resizable_editor_exports = {};
__export(resizable_editor_exports, {
  default: () => resizable_editor_default
});
module.exports = __toCommonJS(resizable_editor_exports);
var import_clsx = __toESM(require("clsx"));
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_resize_handle = __toESM(require("./resize-handle.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
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
  const [width, setWidth] = (0, import_element.useState)("100%");
  const resizableRef = (0, import_element.useRef)();
  const resizeWidthBy = (0, import_element.useCallback)((deltaPixels) => {
    if (resizableRef.current) {
      setWidth(resizableRef.current.offsetWidth + deltaPixels);
    }
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.ResizableBox,
    {
      className: (0, import_clsx.default)("editor-resizable-editor", className, {
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
        left: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_resize_handle.default,
          {
            direction: "left",
            resizeWidthBy
          }
        ),
        right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_resize_handle.default,
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
//# sourceMappingURL=index.cjs.map
