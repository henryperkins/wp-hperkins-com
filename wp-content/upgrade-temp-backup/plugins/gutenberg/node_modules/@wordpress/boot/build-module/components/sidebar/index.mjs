// packages/boot/src/components/sidebar/index.tsx
import SiteHub from "../site-hub/index.mjs";
import Navigation from "../navigation/index.mjs";
import SaveButton from "../save-button/index.mjs";

// packages/boot/src/components/sidebar/style.scss
if (typeof document !== "undefined" && process.env.NODE_ENV !== "test" && !document.head.querySelector("style[data-wp-hash='e5d2041211']")) {
  const style = document.createElement("style");
  style.setAttribute("data-wp-hash", "e5d2041211");
  style.appendChild(document.createTextNode(".boot-sidebar__scrollable{display:flex;flex-direction:column;height:100%;overflow:auto;position:relative}.boot-sidebar__content{contain:content;flex-grow:1;position:relative}.boot-sidebar__footer{padding:16px 8px 8px 16px}"));
  document.head.appendChild(style);
}

// packages/boot/src/components/sidebar/index.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function Sidebar() {
  return /* @__PURE__ */ jsxs("div", { className: "boot-sidebar__scrollable", children: [
    /* @__PURE__ */ jsx(SiteHub, {}),
    /* @__PURE__ */ jsx("div", { className: "boot-sidebar__content", children: /* @__PURE__ */ jsx(Navigation, {}) }),
    /* @__PURE__ */ jsx("div", { className: "boot-sidebar__footer", children: /* @__PURE__ */ jsx(SaveButton, {}) })
  ] });
}
export {
  Sidebar as default
};
//# sourceMappingURL=index.mjs.map
