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

// packages/ui/src/collapsible-card/header.tsx
var header_exports = {};
__export(header_exports, {
  Header: () => Header2
});
module.exports = __toCommonJS(header_exports);
var import_collapsible = require("@base-ui/react/collapsible");
var import_clsx = __toESM(require("clsx"));
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var Card = __toESM(require("../card/index.cjs"));
var import_icon_button = require("../icon-button/index.cjs");

// packages/ui/src/collapsible-card/style.module.css
if (typeof document !== "undefined" && process.env.NODE_ENV !== "test" && !document.head.querySelector("style[data-wp-hash='369efd7a16']")) {
  const style = document.createElement("style");
  style.setAttribute("data-wp-hash", "369efd7a16");
  style.appendChild(document.createTextNode("@layer wp-ui-utilities, wp-ui-components, wp-ui-compositions, wp-ui-overrides;@layer wp-ui-components{.cab17c7a373cb60d__header-content{flex:1;min-width:0}.bcfab5f2448bafef__header-trigger-wrapper{align-self:center;flex-shrink:0;max-height:0;overflow:visible}._3106f8d2b0330faa__header-trigger{transform:translateY(-50%)}}@layer wp-ui-compositions{._5d2dfcb4085c6d0f__header{align-items:stretch;display:flex;flex-direction:row;gap:var(--wpds-dimension-gap-sm,8px);&:has(._3106f8d2b0330faa__header-trigger:not([data-disabled])){cursor:var(--wpds-cursor-control,default)}}}"));
  document.head.appendChild(style);
}
var style_default = { "header-content": "cab17c7a373cb60d__header-content", "header-trigger-wrapper": "bcfab5f2448bafef__header-trigger-wrapper", "header-trigger": "_3106f8d2b0330faa__header-trigger", "header": "_5d2dfcb4085c6d0f__header" };

// packages/ui/src/collapsible-card/header.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var Header2 = (0, import_element.forwardRef)(
  function CollapsibleCardHeader({ children, className, onClick, ...restProps }, ref) {
    const triggerRef = (0, import_element.useRef)(null);
    const handleHeaderClick = (0, import_element.useCallback)(
      (event) => {
        const trigger = triggerRef.current;
        if (trigger && event.target instanceof Node && !trigger.contains(event.target)) {
          trigger.click();
        }
        onClick?.(event);
      },
      [onClick]
    );
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      Card.Header,
      {
        ref,
        className: (0, import_clsx.default)(style_default.header, className),
        onClick: handleHeaderClick,
        ...restProps,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: style_default["header-content"], children }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: style_default["header-trigger-wrapper"], children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_collapsible.Collapsible.Trigger,
            {
              ref: triggerRef,
              render: (props, state) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_icon_button.IconButton,
                {
                  ...props,
                  label: (0, import_i18n.__)("Expand or collapse card"),
                  icon: state.open ? import_icons.chevronUp : import_icons.chevronDown,
                  variant: "minimal",
                  tone: "neutral",
                  size: "compact"
                }
              ),
              className: style_default["header-trigger"]
            }
          ) })
        ]
      }
    );
  }
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Header
});
//# sourceMappingURL=header.cjs.map
