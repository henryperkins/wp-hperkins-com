// packages/fields/src/fields/title/view.tsx
import clsx from "clsx";
import { __experimentalHStack as HStack } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { getItemTitle } from "../../actions/utils.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function BaseTitleView({
  item,
  className,
  children
}) {
  const renderedTitle = getItemTitle(item);
  return /* @__PURE__ */ jsxs(
    HStack,
    {
      className: clsx("fields-field__title", className),
      alignment: "center",
      justify: "flex-start",
      children: [
        /* @__PURE__ */ jsx("span", { children: renderedTitle || __("(no title)") }),
        children
      ]
    }
  );
}
function TitleView({ item }) {
  return /* @__PURE__ */ jsx(BaseTitleView, { item });
}
export {
  BaseTitleView,
  TitleView as default
};
//# sourceMappingURL=view.mjs.map
