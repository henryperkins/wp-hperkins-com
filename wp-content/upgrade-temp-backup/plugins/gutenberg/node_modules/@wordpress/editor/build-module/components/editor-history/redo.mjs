// packages/editor/src/components/editor-history/redo.js
import { __, isRTL } from "@wordpress/i18n";
import { Button } from "@wordpress/components";
import { useSelect, useDispatch } from "@wordpress/data";
import { displayShortcut, isAppleOS } from "@wordpress/keycodes";
import { redo as redoIcon, undo as undoIcon } from "@wordpress/icons";
import { forwardRef } from "@wordpress/element";
import { store as editorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
function EditorHistoryRedo(props, ref) {
  const shortcut = isAppleOS() ? displayShortcut.primaryShift("z") : displayShortcut.primary("y");
  const hasRedo = useSelect(
    (select) => select(editorStore).hasEditorRedo(),
    []
  );
  const { redo } = useDispatch(editorStore);
  return /* @__PURE__ */ jsx(
    Button,
    {
      __next40pxDefaultSize: true,
      ...props,
      ref,
      icon: !isRTL() ? redoIcon : undoIcon,
      label: __("Redo"),
      shortcut,
      "aria-disabled": !hasRedo,
      onClick: hasRedo ? redo : void 0,
      className: "editor-history__redo"
    }
  );
}
var redo_default = forwardRef(EditorHistoryRedo);
export {
  redo_default as default
};
//# sourceMappingURL=redo.mjs.map
