// packages/block-editor/src/components/inspector-controls/slot.js
import { __experimentalUseSlotFills as useSlotFills } from "@wordpress/components";
import { forwardRef } from "@wordpress/element";
import warning from "@wordpress/warning";
import deprecated from "@wordpress/deprecated";
import BlockSupportToolsPanel from "./block-support-tools-panel.mjs";
import BlockSupportSlotContainer from "./block-support-slot-container.mjs";
import groups from "./groups.mjs";
import { jsx } from "react/jsx-runtime";
function InspectorControlsSlot({ __experimentalGroup, group = "default", label, fillProps, ...props }, ref) {
  if (__experimentalGroup) {
    deprecated(
      "`__experimentalGroup` property in `InspectorControlsSlot`",
      {
        since: "6.2",
        version: "6.4",
        alternative: "`group`"
      }
    );
    group = __experimentalGroup;
  }
  const slotFill = groups[group];
  const fills = useSlotFills(slotFill?.name);
  if (!slotFill) {
    warning(`Unknown InspectorControls group "${group}" provided.`);
    return null;
  }
  if (!fills?.length) {
    return null;
  }
  const { Slot } = slotFill;
  if (label) {
    return /* @__PURE__ */ jsx(BlockSupportToolsPanel, { group, label, children: /* @__PURE__ */ jsx(
      BlockSupportSlotContainer,
      {
        ...props,
        fillProps,
        Slot
      }
    ) });
  }
  return /* @__PURE__ */ jsx(
    Slot,
    {
      ...props,
      ref,
      fillProps,
      bubblesVirtually: true
    }
  );
}
var slot_default = forwardRef(InspectorControlsSlot);
export {
  slot_default as default
};
//# sourceMappingURL=slot.mjs.map
