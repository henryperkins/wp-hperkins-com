// packages/block-library/src/nextpage/edit.js
import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
function NextPageEdit() {
  return /* @__PURE__ */ jsx("div", { ...useBlockProps(), children: /* @__PURE__ */ jsx("span", { children: __("Page break") }) });
}
export {
  NextPageEdit as default
};
//# sourceMappingURL=edit.mjs.map
