// packages/ui/src/collapsible-card/header.tsx
import { Collapsible } from "@base-ui/react/collapsible";
import clsx from "clsx";
import { forwardRef, useCallback, useRef } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { chevronDown, chevronUp } from "@wordpress/icons";
import * as Card from "../card/index.mjs";
import { IconButton } from "../icon-button/index.mjs";

// packages/ui/src/collapsible-card/style.module.css
if (typeof document !== "undefined" && process.env.NODE_ENV !== "test" && !document.head.querySelector("style[data-wp-hash='369efd7a16']")) {
  const style = document.createElement("style");
  style.setAttribute("data-wp-hash", "369efd7a16");
  style.appendChild(document.createTextNode("@layer wp-ui-utilities, wp-ui-components, wp-ui-compositions, wp-ui-overrides;@layer wp-ui-components{.cab17c7a373cb60d__header-content{flex:1;min-width:0}.bcfab5f2448bafef__header-trigger-wrapper{align-self:center;flex-shrink:0;max-height:0;overflow:visible}._3106f8d2b0330faa__header-trigger{transform:translateY(-50%)}}@layer wp-ui-compositions{._5d2dfcb4085c6d0f__header{align-items:stretch;display:flex;flex-direction:row;gap:var(--wpds-dimension-gap-sm,8px);&:has(._3106f8d2b0330faa__header-trigger:not([data-disabled])){cursor:var(--wpds-cursor-control,default)}}}"));
  document.head.appendChild(style);
}
var style_default = { "header-content": "cab17c7a373cb60d__header-content", "header-trigger-wrapper": "bcfab5f2448bafef__header-trigger-wrapper", "header-trigger": "_3106f8d2b0330faa__header-trigger", "header": "_5d2dfcb4085c6d0f__header" };

// packages/ui/src/collapsible-card/header.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var Header2 = forwardRef(
  function CollapsibleCardHeader({ children, className, onClick, ...restProps }, ref) {
    const triggerRef = useRef(null);
    const handleHeaderClick = useCallback(
      (event) => {
        const trigger = triggerRef.current;
        if (trigger && event.target instanceof Node && !trigger.contains(event.target)) {
          trigger.click();
        }
        onClick?.(event);
      },
      [onClick]
    );
    return /* @__PURE__ */ jsxs(
      Card.Header,
      {
        ref,
        className: clsx(style_default.header, className),
        onClick: handleHeaderClick,
        ...restProps,
        children: [
          /* @__PURE__ */ jsx("div", { className: style_default["header-content"], children }),
          /* @__PURE__ */ jsx("div", { className: style_default["header-trigger-wrapper"], children: /* @__PURE__ */ jsx(
            Collapsible.Trigger,
            {
              ref: triggerRef,
              render: (props, state) => /* @__PURE__ */ jsx(
                IconButton,
                {
                  ...props,
                  label: __("Expand or collapse card"),
                  icon: state.open ? chevronUp : chevronDown,
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
export {
  Header2 as Header
};
//# sourceMappingURL=header.mjs.map
