// packages/boot/src/components/save-panel/index.tsx
import { useState } from "@wordpress/element";
import { Modal } from "@wordpress/components";
import { EntitiesSavedStates } from "@wordpress/editor";
import { __ } from "@wordpress/i18n";
import useSaveShortcut from "./use-save-shortcut.mjs";
import { jsx } from "react/jsx-runtime";
function SavePanel() {
  const [isOpen, setIsOpen] = useState(false);
  useSaveShortcut({
    openSavePanel: () => setIsOpen(true)
  });
  if (!isOpen) {
    return false;
  }
  return /* @__PURE__ */ jsx(
    Modal,
    {
      className: "edit-site-save-panel__modal",
      onRequestClose: () => setIsOpen(false),
      title: __("Review changes"),
      size: "small",
      children: /* @__PURE__ */ jsx(
        EntitiesSavedStates,
        {
          close: () => setIsOpen(false),
          variant: "inline"
        }
      )
    }
  );
}
export {
  SavePanel as default
};
//# sourceMappingURL=index.mjs.map
