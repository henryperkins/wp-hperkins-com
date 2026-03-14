// packages/interface/src/components/pinned-items/index.js
import clsx from "clsx";
import { Slot, Fill } from "@wordpress/components";
import { jsx } from "react/jsx-runtime";
function PinnedItems({ scope, ...props }) {
  return /* @__PURE__ */ jsx(Fill, { name: `PinnedItems/${scope}`, ...props });
}
function PinnedItemsSlot({ scope, className, ...props }) {
  return /* @__PURE__ */ jsx(Slot, { name: `PinnedItems/${scope}`, ...props, children: (fills) => fills?.length > 0 && /* @__PURE__ */ jsx(
    "div",
    {
      className: clsx(
        className,
        "interface-pinned-items"
      ),
      children: fills
    }
  ) });
}
PinnedItems.Slot = PinnedItemsSlot;
var pinned_items_default = PinnedItems;
export {
  pinned_items_default as default
};
//# sourceMappingURL=index.mjs.map
