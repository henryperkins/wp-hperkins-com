// packages/block-editor/src/components/inspector-controls/last-item.js
import { createSlotFill } from "@wordpress/components";
import {
  useBlockEditContext,
  mayDisplayControlsKey
} from "../block-edit/context.mjs";
import { jsx } from "react/jsx-runtime";
var { Fill, Slot } = createSlotFill(/* @__PURE__ */ Symbol("InspectorControlsLastItem"));
var InspectorControlsLastItem = (props) => {
  const context = useBlockEditContext();
  if (!context[mayDisplayControlsKey]) {
    return null;
  }
  return /* @__PURE__ */ jsx(Fill, { ...props });
};
InspectorControlsLastItem.Slot = function InspectorControlsLastItemSlot(props) {
  return /* @__PURE__ */ jsx(Slot, { ...props });
};
var last_item_default = InspectorControlsLastItem;
export {
  last_item_default as default
};
//# sourceMappingURL=last-item.mjs.map
