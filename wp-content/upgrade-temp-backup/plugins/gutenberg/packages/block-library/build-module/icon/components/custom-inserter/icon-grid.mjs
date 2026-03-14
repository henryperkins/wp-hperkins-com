// packages/block-library/src/icon/components/custom-inserter/icon-grid.js
import { __ } from "@wordpress/i18n";
import { Button } from "@wordpress/components";
import HtmlRenderer from "../../../utils/html-renderer.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function IconGrid({ icons, onChange, attributes }) {
  return /* @__PURE__ */ jsx("div", { className: "wp-block-icon__inserter-grid", children: !icons?.length ? /* @__PURE__ */ jsx("div", { className: "wp-block-icon__inserter-grid-no-results", children: /* @__PURE__ */ jsx("p", { children: __("No results found.") }) }) : /* @__PURE__ */ jsx(
    "div",
    {
      className: "wp-block-icon__inserter-grid-icons-list",
      "aria-label": __("Icon library"),
      children: icons.map((icon) => {
        return /* @__PURE__ */ jsxs(
          Button,
          {
            className: "wp-block-icon__inserter-grid-icons-list-item",
            onClick: () => onChange(icon.name),
            variant: icon.name === attributes?.icon ? "primary" : void 0,
            __next40pxDefaultSize: true,
            children: [
              /* @__PURE__ */ jsx("span", { className: "wp-block-icon__inserter-grid-icons-list-item-icon", children: /* @__PURE__ */ jsx(
                HtmlRenderer,
                {
                  html: icon.content,
                  wrapperProps: {
                    style: { width: "24px" }
                  }
                }
              ) }),
              /* @__PURE__ */ jsx("span", { className: "wp-block-icon__inserter-grid-icons-list-item-title", children: icon.label })
            ]
          },
          icon.name
        );
      })
    }
  ) });
}
export {
  IconGrid as default
};
//# sourceMappingURL=icon-grid.mjs.map
