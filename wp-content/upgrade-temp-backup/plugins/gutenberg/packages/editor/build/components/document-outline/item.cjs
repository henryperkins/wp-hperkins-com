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

// packages/editor/src/components/document-outline/item.js
var item_exports = {};
__export(item_exports, {
  default: () => item_default
});
module.exports = __toCommonJS(item_exports);
var import_clsx = __toESM(require("clsx"));
var import_jsx_runtime = require("react/jsx-runtime");
var TableOfContentsItem = ({
  children,
  isValid,
  isDisabled,
  level,
  href,
  onSelect
}) => {
  function handleClick(event) {
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    onSelect();
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "li",
    {
      className: (0, import_clsx.default)(
        "document-outline__item",
        `is-${level.toLowerCase()}`,
        {
          "is-invalid": !isValid,
          "is-disabled": isDisabled
        }
      ),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        "a",
        {
          href,
          className: "document-outline__button",
          "aria-disabled": isDisabled,
          onClick: handleClick,
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "span",
              {
                className: "document-outline__emdash",
                "aria-hidden": "true"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { className: "document-outline__level", children: level }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "document-outline__item-content", children })
          ]
        }
      )
    }
  );
};
var item_default = TableOfContentsItem;
//# sourceMappingURL=item.cjs.map
