// packages/admin-ui/src/breadcrumbs/index.tsx
import { Link } from "@wordpress/route";
import { __ } from "@wordpress/i18n";
import {
  __experimentalHeading as Heading,
  __experimentalHStack as HStack
} from "@wordpress/components";
import { jsx } from "react/jsx-runtime";
var BreadcrumbItem = ({
  item: { label, to }
}) => {
  if (!to) {
    return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Heading, { level: 1, truncate: true, children: label }) });
  }
  return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to, children: label }) });
};
var Breadcrumbs = ({ items }) => {
  if (!items.length) {
    return null;
  }
  return /* @__PURE__ */ jsx("nav", { "aria-label": __("Breadcrumbs"), children: /* @__PURE__ */ jsx(
    HStack,
    {
      as: "ul",
      className: "admin-ui-breadcrumbs__list",
      spacing: 0,
      justify: "flex-start",
      alignment: "center",
      children: items.map((item, index) => /* @__PURE__ */ jsx(BreadcrumbItem, { item }, index))
    }
  ) });
};
var breadcrumbs_default = Breadcrumbs;
export {
  Breadcrumbs,
  breadcrumbs_default as default
};
//# sourceMappingURL=index.mjs.map
