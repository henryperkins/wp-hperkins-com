// packages/edit-widgets/src/components/header/document-tools/index.js
import { useSelect, useDispatch } from "@wordpress/data";
import { __, _x } from "@wordpress/i18n";
import { Button, ToolbarItem } from "@wordpress/components";
import { NavigableToolbar } from "@wordpress/block-editor";
import { listView, plus } from "@wordpress/icons";
import { useCallback } from "@wordpress/element";
import { useViewportMatch } from "@wordpress/compose";
import UndoButton from "../undo-redo/undo.mjs";
import RedoButton from "../undo-redo/redo.mjs";
import { store as editWidgetsStore } from "../../../store/index.mjs";
import { unlock } from "../../../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function DocumentTools() {
  const isMediumViewport = useViewportMatch("medium");
  const {
    isInserterOpen,
    isListViewOpen,
    inserterSidebarToggleRef,
    listViewToggleRef
  } = useSelect((select) => {
    const {
      isInserterOpened,
      getInserterSidebarToggleRef,
      isListViewOpened,
      getListViewToggleRef
    } = unlock(select(editWidgetsStore));
    return {
      isInserterOpen: isInserterOpened(),
      isListViewOpen: isListViewOpened(),
      inserterSidebarToggleRef: getInserterSidebarToggleRef(),
      listViewToggleRef: getListViewToggleRef()
    };
  }, []);
  const { setIsInserterOpened, setIsListViewOpened } = useDispatch(editWidgetsStore);
  const toggleListView = useCallback(
    () => setIsListViewOpened(!isListViewOpen),
    [setIsListViewOpened, isListViewOpen]
  );
  const toggleInserterSidebar = useCallback(
    () => setIsInserterOpened(!isInserterOpen),
    [setIsInserterOpened, isInserterOpen]
  );
  return /* @__PURE__ */ jsxs(
    NavigableToolbar,
    {
      className: "edit-widgets-header-toolbar",
      "aria-label": __("Document tools"),
      variant: "unstyled",
      children: [
        /* @__PURE__ */ jsx(
          ToolbarItem,
          {
            ref: inserterSidebarToggleRef,
            as: Button,
            className: "edit-widgets-header-toolbar__inserter-toggle",
            variant: "primary",
            isPressed: isInserterOpen,
            onMouseDown: (event) => {
              event.preventDefault();
            },
            onClick: toggleInserterSidebar,
            icon: plus,
            label: _x(
              "Block Inserter",
              "Generic label for block inserter button"
            ),
            size: "compact"
          }
        ),
        isMediumViewport && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(ToolbarItem, { as: UndoButton }),
          /* @__PURE__ */ jsx(ToolbarItem, { as: RedoButton }),
          /* @__PURE__ */ jsx(
            ToolbarItem,
            {
              as: Button,
              className: "edit-widgets-header-toolbar__list-view-toggle",
              icon: listView,
              isPressed: isListViewOpen,
              label: __("List View"),
              onClick: toggleListView,
              ref: listViewToggleRef,
              size: "compact"
            }
          )
        ] })
      ]
    }
  );
}
var document_tools_default = DocumentTools;
export {
  document_tools_default as default
};
//# sourceMappingURL=index.mjs.map
