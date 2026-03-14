// packages/fields/src/fields/status/status-view.tsx
import { __experimentalHStack as HStack, Icon } from "@wordpress/components";
import STATUSES from "./status-elements.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function StatusView({ item }) {
  const status = STATUSES.find(({ value }) => value === item.status);
  const label = status?.label || item.status;
  const icon = status?.icon;
  return /* @__PURE__ */ jsxs(HStack, { alignment: "left", spacing: 0, children: [
    icon && /* @__PURE__ */ jsx("div", { className: "fields-controls__status-icon", children: /* @__PURE__ */ jsx(Icon, { icon }) }),
    /* @__PURE__ */ jsx("span", { children: label })
  ] });
}
var status_view_default = StatusView;
export {
  status_view_default as default
};
//# sourceMappingURL=status-view.mjs.map
