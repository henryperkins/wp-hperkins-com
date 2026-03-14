// packages/block-editor/src/components/block-tools/empty-block-inserter.js
import clsx from "clsx";
import BlockPopoverCover from "../block-popover/cover.mjs";
import useBlockToolbarPopoverProps from "./use-block-toolbar-popover-props.mjs";
import Inserter from "../inserter/index.mjs";
import useSelectedBlockToolProps from "./use-selected-block-tool-props.mjs";
import { jsx } from "react/jsx-runtime";
function EmptyBlockInserter({
  clientId,
  __unstableContentRef
}) {
  const {
    capturingClientId,
    isInsertionPointVisible,
    lastClientId,
    rootClientId
  } = useSelectedBlockToolProps(clientId);
  const popoverProps = useBlockToolbarPopoverProps({
    contentElement: __unstableContentRef?.current,
    clientId
  });
  return /* @__PURE__ */ jsx(
    BlockPopoverCover,
    {
      clientId: capturingClientId || clientId,
      bottomClientId: lastClientId,
      className: clsx(
        "block-editor-block-list__block-side-inserter-popover",
        {
          "is-insertion-point-visible": isInsertionPointVisible
        }
      ),
      __unstableContentRef,
      ...popoverProps,
      children: /* @__PURE__ */ jsx("div", { className: "block-editor-block-list__empty-block-inserter", children: /* @__PURE__ */ jsx(
        Inserter,
        {
          position: "bottom right",
          rootClientId,
          clientId,
          __experimentalIsQuick: true
        }
      ) })
    }
  );
}
export {
  EmptyBlockInserter as default
};
//# sourceMappingURL=empty-block-inserter.mjs.map
