// packages/block-editor/src/components/inserter-listbox/index.js
import { Composite } from "@wordpress/components";
import { Fragment } from "@wordpress/element";
import { default as default2 } from "./group.mjs";
import { default as default3 } from "./row.mjs";
import { default as default4 } from "./item.mjs";
import { jsx } from "react/jsx-runtime";
function InserterListBoxWrapper({ key, children }) {
  return /* @__PURE__ */ jsx(Fragment, { children }, key);
}
function InserterListbox({ children }) {
  return /* @__PURE__ */ jsx(
    Composite,
    {
      focusShift: true,
      focusWrap: "horizontal",
      render: InserterListBoxWrapper,
      children
    }
  );
}
var inserter_listbox_default = InserterListbox;
export {
  default2 as InserterListboxGroup,
  default4 as InserterListboxItem,
  default3 as InserterListboxRow,
  inserter_listbox_default as default
};
//# sourceMappingURL=index.mjs.map
