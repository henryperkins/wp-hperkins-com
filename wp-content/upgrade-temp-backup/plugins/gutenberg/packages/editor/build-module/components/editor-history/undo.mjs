// packages/editor/src/components/editor-history/undo.js
import { __, isRTL } from "@wordpress/i18n";
import { Button } from "@wordpress/components";
import { useSelect, useDispatch } from "@wordpress/data";
import { displayShortcut } from "@wordpress/keycodes";
import { undo as undoIcon, redo as redoIcon } from "@wordpress/icons";
import { forwardRef } from "@wordpress/element";
import { store as editorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
function EditorHistoryUndo(props, ref) {
  const hasUndo = useSelect(
    (select) => select(editorStore).hasEditorUndo(),
    []
  );
  const { undo } = useDispatch(editorStore);
  return /* @__PURE__ */ jsx(
    Button,
    {
      __next40pxDefaultSize: true,
      ...props,
      ref,
      icon: !isRTL() ? undoIcon : redoIcon,
      label: __("Undo"),
      shortcut: displayShortcut.primary("z"),
      "aria-disabled": !hasUndo,
      onClick: hasUndo ? undo : void 0,
      className: "editor-history__undo"
    }
  );
}
var undo_default = forwardRef(EditorHistoryUndo);
export {
  undo_default as default
};
//# sourceMappingURL=undo.mjs.map
