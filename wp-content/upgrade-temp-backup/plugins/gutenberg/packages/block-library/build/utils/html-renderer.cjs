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

// packages/block-library/src/utils/html-renderer.js
var html_renderer_exports = {};
__export(html_renderer_exports, {
  default: () => html_renderer_default
});
module.exports = __toCommonJS(html_renderer_exports);
var import_clsx = __toESM(require("clsx"));
var import_html_react_parser = __toESM(require("html-react-parser"));
var import_dom = require("@wordpress/dom");
var import_jsx_runtime = require("react/jsx-runtime");
var HtmlRenderer = ({ wrapperProps = {}, html = "" }) => {
  const options = {
    replace: ({ name, type, attribs, parent, children }) => {
      if (type === "tag" && name) {
        const parsedProps = (0, import_html_react_parser.attributesToProps)(attribs || {});
        const TagName = name;
        if (!parent) {
          const mergedProps = {
            ...parsedProps,
            ...wrapperProps,
            className: (0, import_clsx.default)(
              parsedProps.className,
              wrapperProps.className
            ),
            style: {
              ...parsedProps.style || {},
              ...wrapperProps.style || {}
            }
          };
          return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TagName, { ...mergedProps, children: (0, import_html_react_parser.domToReact)(children, options) });
        }
      }
    }
  };
  const sanitizedContent = (0, import_dom.safeHTML)(html);
  const parsedContent = (0, import_html_react_parser.default)(sanitizedContent, options);
  return parsedContent;
};
var html_renderer_default = HtmlRenderer;
//# sourceMappingURL=html-renderer.cjs.map
