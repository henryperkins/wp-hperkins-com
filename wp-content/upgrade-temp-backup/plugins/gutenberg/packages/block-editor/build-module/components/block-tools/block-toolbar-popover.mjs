// packages/block-editor/src/components/block-tools/block-toolbar-popover.js
import clsx from "clsx";
import { useDispatch } from "@wordpress/data";
import { useEffect, useRef } from "@wordpress/element";
import { useShortcut } from "@wordpress/keyboard-shortcuts";
import { PrivateBlockPopover } from "../block-popover/index.mjs";
import useBlockToolbarPopoverProps from "./use-block-toolbar-popover-props.mjs";
import useSelectedBlockToolProps from "./use-selected-block-tool-props.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import { PrivateBlockToolbar } from "../block-toolbar/index.mjs";
import { jsx } from "react/jsx-runtime";
function BlockToolbarPopover({
  clientId,
  isTyping,
  __unstableContentRef
}) {
  const { capturingClientId, isInsertionPointVisible, lastClientId } = useSelectedBlockToolProps(clientId);
  const initialToolbarItemIndexRef = useRef();
  useEffect(() => {
    initialToolbarItemIndexRef.current = void 0;
  }, [clientId]);
  const { stopTyping } = useDispatch(blockEditorStore);
  const isToolbarForcedRef = useRef(false);
  useShortcut("core/block-editor/focus-toolbar", () => {
    isToolbarForcedRef.current = true;
    stopTyping(true);
  });
  useEffect(() => {
    isToolbarForcedRef.current = false;
  });
  const clientIdToPositionOver = capturingClientId || clientId;
  const popoverProps = useBlockToolbarPopoverProps({
    contentElement: __unstableContentRef?.current,
    clientId: clientIdToPositionOver
  });
  return !isTyping && /* @__PURE__ */ jsx(
    PrivateBlockPopover,
    {
      clientId: clientIdToPositionOver,
      bottomClientId: lastClientId,
      className: clsx("block-editor-block-list__block-popover", {
        "is-insertion-point-visible": isInsertionPointVisible
      }),
      resize: false,
      ...popoverProps,
      __unstableContentRef,
      children: /* @__PURE__ */ jsx(
        PrivateBlockToolbar,
        {
          focusOnMount: isToolbarForcedRef.current,
          __experimentalInitialIndex: initialToolbarItemIndexRef.current,
          __experimentalOnIndexChange: (index) => {
            initialToolbarItemIndexRef.current = index;
          },
          variant: "toolbar"
        }
      )
    }
  );
}
export {
  BlockToolbarPopover as default
};
//# sourceMappingURL=block-toolbar-popover.mjs.map
