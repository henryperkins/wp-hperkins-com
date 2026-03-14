// packages/editor/src/components/document-outline/item.js
import clsx from "clsx";
import { jsx, jsxs } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx(
    "li",
    {
      className: clsx(
        "document-outline__item",
        `is-${level.toLowerCase()}`,
        {
          "is-invalid": !isValid,
          "is-disabled": isDisabled
        }
      ),
      children: /* @__PURE__ */ jsxs(
        "a",
        {
          href,
          className: "document-outline__button",
          "aria-disabled": isDisabled,
          onClick: handleClick,
          children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: "document-outline__emdash",
                "aria-hidden": "true"
              }
            ),
            /* @__PURE__ */ jsx("strong", { className: "document-outline__level", children: level }),
            /* @__PURE__ */ jsx("span", { className: "document-outline__item-content", children })
          ]
        }
      )
    }
  );
};
var item_default = TableOfContentsItem;
export {
  item_default as default
};
//# sourceMappingURL=item.mjs.map
