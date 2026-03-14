// packages/block-editor/src/components/inspector-controls/block-support-slot-container.js
import { __experimentalToolsPanelContext as ToolsPanelContext } from "@wordpress/components";
import { useContext, useMemo } from "@wordpress/element";
import { jsx } from "react/jsx-runtime";
function BlockSupportSlotContainer({
  Slot,
  fillProps,
  ...props
}) {
  const toolsPanelContext = useContext(ToolsPanelContext);
  const computedFillProps = useMemo(
    () => ({
      ...fillProps ?? {},
      forwardedContext: [
        ...fillProps?.forwardedContext ?? [],
        [ToolsPanelContext.Provider, { value: toolsPanelContext }]
      ]
    }),
    [toolsPanelContext, fillProps]
  );
  return /* @__PURE__ */ jsx(Slot, { ...props, fillProps: computedFillProps, bubblesVirtually: true });
}
export {
  BlockSupportSlotContainer as default
};
//# sourceMappingURL=block-support-slot-container.mjs.map
