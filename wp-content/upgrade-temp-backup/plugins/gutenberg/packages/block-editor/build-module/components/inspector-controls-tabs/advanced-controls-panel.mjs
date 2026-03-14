// packages/block-editor/src/components/inspector-controls-tabs/advanced-controls-panel.js
import {
  PanelBody,
  __experimentalUseSlotFills as useSlotFills
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import {
  default as InspectorControls,
  InspectorAdvancedControls
} from "../inspector-controls/index.mjs";
import { PrivateInspectorControlsAllowedBlocks } from "../inspector-controls/groups.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var AdvancedControls = ({ initialOpen = false }) => {
  const fills = useSlotFills(InspectorAdvancedControls.slotName);
  const privateFills = useSlotFills(
    PrivateInspectorControlsAllowedBlocks.name
  );
  const hasFills = Boolean(fills && fills.length);
  const hasPrivateFills = Boolean(privateFills && privateFills.length);
  if (!hasFills && !hasPrivateFills) {
    return null;
  }
  return /* @__PURE__ */ jsxs(
    PanelBody,
    {
      className: "block-editor-block-inspector__advanced",
      title: __("Advanced"),
      initialOpen,
      children: [
        /* @__PURE__ */ jsx(InspectorControls.Slot, { group: "advanced" }),
        /* @__PURE__ */ jsx(PrivateInspectorControlsAllowedBlocks.Slot, {})
      ]
    }
  );
};
var advanced_controls_panel_default = AdvancedControls;
export {
  advanced_controls_panel_default as default
};
//# sourceMappingURL=advanced-controls-panel.mjs.map
