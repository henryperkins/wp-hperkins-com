// packages/edit-widgets/src/components/header/undo-redo/redo.js
import { __, isRTL } from "@wordpress/i18n";
import { Button } from "@wordpress/components";
import { useSelect, useDispatch } from "@wordpress/data";
import { redo as redoIcon, undo as undoIcon } from "@wordpress/icons";
import { displayShortcut, isAppleOS } from "@wordpress/keycodes";
import { store as coreStore } from "@wordpress/core-data";
import { forwardRef } from "@wordpress/element";
import { jsx } from "react/jsx-runtime";
function RedoButton(props, ref) {
  const shortcut = isAppleOS() ? displayShortcut.primaryShift("z") : displayShortcut.primary("y");
  const hasRedo = useSelect(
    (select) => select(coreStore).hasRedo(),
    []
  );
  const { redo } = useDispatch(coreStore);
  return /* @__PURE__ */ jsx(
    Button,
    {
      ...props,
      ref,
      icon: !isRTL() ? redoIcon : undoIcon,
      label: __("Redo"),
      shortcut,
      "aria-disabled": !hasRedo,
      onClick: hasRedo ? redo : void 0,
      size: "compact"
    }
  );
}
var redo_default = forwardRef(RedoButton);
export {
  redo_default as default
};
//# sourceMappingURL=redo.mjs.map
