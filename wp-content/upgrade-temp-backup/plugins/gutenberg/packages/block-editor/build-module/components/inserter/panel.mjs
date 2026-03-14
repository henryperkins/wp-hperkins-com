// packages/block-editor/src/components/inserter/panel.js
import { Icon } from "@wordpress/components";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function InserterPanel({ title, icon, children }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "block-editor-inserter__panel-header", children: [
      /* @__PURE__ */ jsx("h2", { className: "block-editor-inserter__panel-title", children: title }),
      /* @__PURE__ */ jsx(Icon, { icon })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "block-editor-inserter__panel-content", children })
  ] });
}
var panel_default = InserterPanel;
export {
  panel_default as default
};
//# sourceMappingURL=panel.mjs.map
