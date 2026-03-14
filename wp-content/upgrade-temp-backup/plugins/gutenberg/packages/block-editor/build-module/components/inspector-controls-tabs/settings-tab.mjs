// packages/block-editor/src/components/inspector-controls-tabs/settings-tab.js
import { __experimentalUseSlotFills as useSlotFills } from "@wordpress/components";
import AdvancedControls from "./advanced-controls-panel.mjs";
import PositionControls from "./position-controls-panel.mjs";
import { default as InspectorControls } from "../inspector-controls/index.mjs";
import groups from "../inspector-controls/groups.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var SettingsTab = ({ showAdvancedControls = false }) => {
  const defaultFills = useSlotFills(groups.default.name);
  const positionFills = useSlotFills(groups.position.name);
  const bindingsFills = useSlotFills(groups.bindings.name);
  const hasOtherFills = !!defaultFills?.length || !!positionFills?.length || !!bindingsFills?.length;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(InspectorControls.Slot, {}),
    /* @__PURE__ */ jsx(PositionControls, {}),
    /* @__PURE__ */ jsx(InspectorControls.Slot, { group: "bindings" }),
    showAdvancedControls && /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(AdvancedControls, { initialOpen: !hasOtherFills }) })
  ] });
};
var settings_tab_default = SettingsTab;
export {
  settings_tab_default as default
};
//# sourceMappingURL=settings-tab.mjs.map
