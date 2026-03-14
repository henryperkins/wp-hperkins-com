// packages/edit-widgets/src/components/header/undo-redo/undo.js
import { __, isRTL } from "@wordpress/i18n";
import { Button } from "@wordpress/components";
import { useSelect, useDispatch } from "@wordpress/data";
import { undo as undoIcon, redo as redoIcon } from "@wordpress/icons";
import { displayShortcut } from "@wordpress/keycodes";
import { store as coreStore } from "@wordpress/core-data";
import { forwardRef } from "@wordpress/element";
import { jsx } from "react/jsx-runtime";
function UndoButton(props, ref) {
  const hasUndo = useSelect(
    (select) => select(coreStore).hasUndo(),
    []
  );
  const { undo } = useDispatch(coreStore);
  return /* @__PURE__ */ jsx(
    Button,
    {
      ...props,
      ref,
      icon: !isRTL() ? undoIcon : redoIcon,
      label: __("Undo"),
      shortcut: displayShortcut.primary("z"),
      "aria-disabled": !hasUndo,
      onClick: hasUndo ? undo : void 0,
      size: "compact"
    }
  );
}
var undo_default = forwardRef(UndoButton);
export {
  undo_default as default
};
//# sourceMappingURL=undo.mjs.map
