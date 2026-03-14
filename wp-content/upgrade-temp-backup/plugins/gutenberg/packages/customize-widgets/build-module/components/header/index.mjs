// packages/customize-widgets/src/components/header/index.js
import clsx from "clsx";
import { ToolbarButton } from "@wordpress/components";
import { NavigableToolbar } from "@wordpress/block-editor";
import { createPortal, useEffect, useState } from "@wordpress/element";
import { displayShortcut, isAppleOS } from "@wordpress/keycodes";
import { __, _x, isRTL } from "@wordpress/i18n";
import { plus, undo as undoIcon, redo as redoIcon } from "@wordpress/icons";
import Inserter from "../inserter/index.mjs";
import MoreMenu from "../more-menu/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function Header({
  sidebar,
  inserter,
  isInserterOpened,
  setIsInserterOpened,
  isFixedToolbarActive
}) {
  const [[hasUndo, hasRedo], setUndoRedo] = useState([
    sidebar.hasUndo(),
    sidebar.hasRedo()
  ]);
  const shortcut = isAppleOS() ? displayShortcut.primaryShift("z") : displayShortcut.primary("y");
  useEffect(() => {
    return sidebar.subscribeHistory(() => {
      setUndoRedo([sidebar.hasUndo(), sidebar.hasRedo()]);
    });
  }, [sidebar]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: clsx("customize-widgets-header", {
          "is-fixed-toolbar-active": isFixedToolbarActive
        }),
        children: /* @__PURE__ */ jsxs(
          NavigableToolbar,
          {
            className: "customize-widgets-header-toolbar",
            "aria-label": __("Document tools"),
            children: [
              /* @__PURE__ */ jsx(
                ToolbarButton,
                {
                  icon: !isRTL() ? undoIcon : redoIcon,
                  label: __("Undo"),
                  shortcut: displayShortcut.primary("z"),
                  disabled: !hasUndo,
                  onClick: sidebar.undo,
                  className: "customize-widgets-editor-history-button undo-button"
                }
              ),
              /* @__PURE__ */ jsx(
                ToolbarButton,
                {
                  icon: !isRTL() ? redoIcon : undoIcon,
                  label: __("Redo"),
                  shortcut,
                  disabled: !hasRedo,
                  onClick: sidebar.redo,
                  className: "customize-widgets-editor-history-button redo-button"
                }
              ),
              /* @__PURE__ */ jsx(
                ToolbarButton,
                {
                  className: "customize-widgets-header-toolbar__inserter-toggle",
                  isPressed: isInserterOpened,
                  variant: "primary",
                  icon: plus,
                  label: _x(
                    "Add block",
                    "Generic label for block inserter button"
                  ),
                  onClick: () => {
                    setIsInserterOpened((isOpen) => !isOpen);
                  }
                }
              ),
              /* @__PURE__ */ jsx(MoreMenu, {})
            ]
          }
        )
      }
    ),
    createPortal(
      /* @__PURE__ */ jsx(Inserter, { setIsOpened: setIsInserterOpened }),
      inserter.contentContainer[0]
    )
  ] });
}
var header_default = Header;
export {
  header_default as default
};
//# sourceMappingURL=index.mjs.map
