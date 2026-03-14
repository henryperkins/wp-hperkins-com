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

// packages/ui/src/collapsible-card/content.tsx
var content_exports = {};
__export(content_exports, {
  Content: () => Content2
});
module.exports = __toCommonJS(content_exports);
var import_collapsible = require("@base-ui/react/collapsible");
var import_element = require("@wordpress/element");
var Card = __toESM(require("../card/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var Content2 = (0, import_element.forwardRef)(
  function CollapsibleCardContent({ render, ...restProps }, ref) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_collapsible.Collapsible.Panel,
      {
        ref,
        render: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card.Content, { render }),
        ...restProps
      }
    );
  }
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Content
});
//# sourceMappingURL=content.cjs.map
