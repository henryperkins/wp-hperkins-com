// packages/global-styles-ui/src/pagination/index.tsx
import clsx from "clsx";
import {
  __experimentalHStack as HStack,
  __experimentalText as Text,
  Button
} from "@wordpress/components";
import { __, _x, _n, sprintf, isRTL } from "@wordpress/i18n";
import { previous, chevronLeft, chevronRight, next } from "@wordpress/icons";
import { jsx, jsxs } from "react/jsx-runtime";
function Pagination({
  currentPage,
  numPages,
  changePage,
  totalItems,
  className,
  disabled = false,
  buttonVariant = "tertiary",
  label = __("Pagination")
}) {
  return /* @__PURE__ */ jsxs(
    HStack,
    {
      expanded: false,
      as: "nav",
      "aria-label": label,
      spacing: 3,
      justify: "flex-start",
      className: clsx("global-styles-ui-pagination", className),
      children: [
        /* @__PURE__ */ jsx(
          Text,
          {
            variant: "muted",
            className: "global-styles-ui-pagination__total",
            children: sprintf(
              // translators: %d: Total number of patterns.
              _n("%d item", "%d items", totalItems),
              totalItems
            )
          }
        ),
        /* @__PURE__ */ jsxs(HStack, { expanded: false, spacing: 1, children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: buttonVariant,
              onClick: () => changePage(1),
              accessibleWhenDisabled: true,
              disabled: disabled || currentPage === 1,
              label: __("First page"),
              icon: isRTL() ? next : previous,
              size: "compact"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: buttonVariant,
              onClick: () => changePage(currentPage - 1),
              accessibleWhenDisabled: true,
              disabled: disabled || currentPage === 1,
              label: __("Previous page"),
              icon: isRTL() ? chevronRight : chevronLeft,
              size: "compact"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(Text, { variant: "muted", children: sprintf(
          // translators: 1: Current page number. 2: Total number of pages.
          _x("%1$d of %2$d", "paging"),
          currentPage,
          numPages
        ) }),
        /* @__PURE__ */ jsxs(HStack, { expanded: false, spacing: 1, children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: buttonVariant,
              onClick: () => changePage(currentPage + 1),
              accessibleWhenDisabled: true,
              disabled: disabled || currentPage === numPages,
              label: __("Next page"),
              icon: isRTL() ? chevronLeft : chevronRight,
              size: "compact"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: buttonVariant,
              onClick: () => changePage(numPages),
              accessibleWhenDisabled: true,
              disabled: disabled || currentPage === numPages,
              label: __("Last page"),
              icon: isRTL() ? previous : next,
              size: "compact"
            }
          )
        ] })
      ]
    }
  );
}
export {
  Pagination as default
};
//# sourceMappingURL=index.mjs.map
