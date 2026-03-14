// packages/editor/src/components/header/back-button.js
import {
  __experimentalUseSlotFills as useSlotFills,
  createSlotFill
} from "@wordpress/components";
import { jsx } from "react/jsx-runtime";
var slotName = "__experimentalMainDashboardButton";
var useHasBackButton = () => {
  const fills = useSlotFills(slotName);
  return Boolean(fills && fills.length);
};
var { Fill, Slot } = createSlotFill(slotName);
var BackButton = Fill;
var BackButtonSlot = () => {
  const fills = useSlotFills(slotName);
  return /* @__PURE__ */ jsx(
    Slot,
    {
      bubblesVirtually: true,
      fillProps: { length: !fills ? 0 : fills.length }
    }
  );
};
BackButton.Slot = BackButtonSlot;
var back_button_default = BackButton;
export {
  back_button_default as default,
  useHasBackButton
};
//# sourceMappingURL=back-button.mjs.map
