// packages/block-editor/src/components/inspector-controls/index.js
import InspectorControlsFill from "./fill.mjs";
import InspectorControlsSlot from "./slot.mjs";
import { jsx } from "react/jsx-runtime";
var InspectorControls = InspectorControlsFill;
InspectorControls.Slot = InspectorControlsSlot;
var InspectorAdvancedControls = (props) => {
  return /* @__PURE__ */ jsx(InspectorControlsFill, { ...props, group: "advanced" });
};
InspectorAdvancedControls.Slot = function Slot(props) {
  return /* @__PURE__ */ jsx(InspectorControlsSlot, { ...props, group: "advanced" });
};
InspectorAdvancedControls.slotName = "InspectorAdvancedControls";
var inspector_controls_default = InspectorControls;
export {
  InspectorAdvancedControls,
  inspector_controls_default as default
};
//# sourceMappingURL=index.mjs.map
