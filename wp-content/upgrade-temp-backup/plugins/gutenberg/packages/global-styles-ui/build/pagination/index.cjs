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

// packages/global-styles-ui/src/pagination/index.tsx
var pagination_exports = {};
__export(pagination_exports, {
  default: () => Pagination
});
module.exports = __toCommonJS(pagination_exports);
var import_clsx = __toESM(require("clsx"));
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_jsx_runtime = require("react/jsx-runtime");
function Pagination({
  currentPage,
  numPages,
  changePage,
  totalItems,
  className,
  disabled = false,
  buttonVariant = "tertiary",
  label = (0, import_i18n.__)("Pagination")
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.__experimentalHStack,
    {
      expanded: false,
      as: "nav",
      "aria-label": label,
      spacing: 3,
      justify: "flex-start",
      className: (0, import_clsx.default)("global-styles-ui-pagination", className),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.__experimentalText,
          {
            variant: "muted",
            className: "global-styles-ui-pagination__total",
            children: (0, import_i18n.sprintf)(
              // translators: %d: Total number of patterns.
              (0, import_i18n._n)("%d item", "%d items", totalItems),
              totalItems
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { expanded: false, spacing: 1, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              variant: buttonVariant,
              onClick: () => changePage(1),
              accessibleWhenDisabled: true,
              disabled: disabled || currentPage === 1,
              label: (0, import_i18n.__)("First page"),
              icon: (0, import_i18n.isRTL)() ? import_icons.next : import_icons.previous,
              size: "compact"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              variant: buttonVariant,
              onClick: () => changePage(currentPage - 1),
              accessibleWhenDisabled: true,
              disabled: disabled || currentPage === 1,
              label: (0, import_i18n.__)("Previous page"),
              icon: (0, import_i18n.isRTL)() ? import_icons.chevronRight : import_icons.chevronLeft,
              size: "compact"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { variant: "muted", children: (0, import_i18n.sprintf)(
          // translators: 1: Current page number. 2: Total number of pages.
          (0, import_i18n._x)("%1$d of %2$d", "paging"),
          currentPage,
          numPages
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { expanded: false, spacing: 1, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              variant: buttonVariant,
              onClick: () => changePage(currentPage + 1),
              accessibleWhenDisabled: true,
              disabled: disabled || currentPage === numPages,
              label: (0, import_i18n.__)("Next page"),
              icon: (0, import_i18n.isRTL)() ? import_icons.chevronLeft : import_icons.chevronRight,
              size: "compact"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              variant: buttonVariant,
              onClick: () => changePage(numPages),
              accessibleWhenDisabled: true,
              disabled: disabled || currentPage === numPages,
              label: (0, import_i18n.__)("Last page"),
              icon: (0, import_i18n.isRTL)() ? import_icons.previous : import_icons.next,
              size: "compact"
            }
          )
        ] })
      ]
    }
  );
}
//# sourceMappingURL=index.cjs.map
