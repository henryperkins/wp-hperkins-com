// packages/block-editor/src/components/block-manager/checklist.js
import { CheckboxControl } from "@wordpress/components";
import BlockIcon from "../block-icon/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function BlockTypesChecklist({ blockTypes, value, onItemChange }) {
  return /* @__PURE__ */ jsx("ul", { className: "block-editor-block-manager__checklist", children: blockTypes.map((blockType) => /* @__PURE__ */ jsxs(
    "li",
    {
      className: "block-editor-block-manager__checklist-item",
      children: [
        /* @__PURE__ */ jsx(
          CheckboxControl,
          {
            label: blockType.title,
            checked: value.includes(blockType.name),
            onChange: (...args) => onItemChange(blockType, ...args)
          }
        ),
        /* @__PURE__ */ jsx(BlockIcon, { icon: blockType.icon })
      ]
    },
    blockType.name
  )) });
}
var checklist_default = BlockTypesChecklist;
export {
  checklist_default as default
};
//# sourceMappingURL=checklist.mjs.map
