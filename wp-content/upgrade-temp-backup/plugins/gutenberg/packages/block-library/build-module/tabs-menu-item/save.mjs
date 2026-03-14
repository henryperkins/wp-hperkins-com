// packages/block-library/src/tabs-menu-item/save.js
import { useBlockProps } from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
function save() {
  const blockProps = useBlockProps.save({
    className: "wp-block-tabs-menu-item__template",
    type: "button",
    role: "tab"
  });
  return /* @__PURE__ */ jsx("button", { ...blockProps });
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
