// packages/widgets/src/blocks/legacy-widget/edit/inspector-card.js
import { jsx, jsxs } from "react/jsx-runtime";
function InspectorCard({ name, description }) {
  return /* @__PURE__ */ jsxs("div", { className: "wp-block-legacy-widget-inspector-card", children: [
    /* @__PURE__ */ jsx("h3", { className: "wp-block-legacy-widget-inspector-card__name", children: name }),
    /* @__PURE__ */ jsx("span", { children: description })
  ] });
}
export {
  InspectorCard as default
};
//# sourceMappingURL=inspector-card.mjs.map
