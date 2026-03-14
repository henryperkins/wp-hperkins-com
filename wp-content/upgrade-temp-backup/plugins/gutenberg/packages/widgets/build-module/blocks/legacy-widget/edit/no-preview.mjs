// packages/widgets/src/blocks/legacy-widget/edit/no-preview.js
import { __ } from "@wordpress/i18n";
import { jsx, jsxs } from "react/jsx-runtime";
function NoPreview({ name }) {
  return /* @__PURE__ */ jsxs("div", { className: "wp-block-legacy-widget__edit-no-preview", children: [
    name && /* @__PURE__ */ jsx("h3", { children: name }),
    /* @__PURE__ */ jsx("p", { children: __("No preview available.") })
  ] });
}
export {
  NoPreview as default
};
//# sourceMappingURL=no-preview.mjs.map
