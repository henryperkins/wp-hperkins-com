// packages/editor/src/components/document-tools/index.js
import clsx from "clsx";
import { useViewportMatch } from "@wordpress/compose";
import { useSelect, useDispatch } from "@wordpress/data";
import { __, _x } from "@wordpress/i18n";
import { NavigableToolbar } from "@wordpress/block-editor";
import { ToolbarButton, ToolbarItem } from "@wordpress/components";
import { listView, plus } from "@wordpress/icons";
import { useCallback } from "@wordpress/element";
import { store as keyboardShortcutsStore } from "@wordpress/keyboard-shortcuts";
import { store as preferencesStore } from "@wordpress/preferences";
import { unlock } from "../../lock-unlock.mjs";
import { store as editorStore } from "../../store/index.mjs";
import EditorHistoryRedo from "../editor-history/redo.mjs";
import EditorHistoryUndo from "../editor-history/undo.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function DocumentTools({ className, disableBlockTools = false }) {
  const { setIsInserterOpened, setIsListViewOpened } = useDispatch(editorStore);
  const {
    isDistractionFree,
    isInserterOpened,
    isListViewOpen,
    listViewShortcut,
    inserterSidebarToggleRef,
    listViewToggleRef,
    showIconLabels
  } = useSelect((select) => {
    const { get } = select(preferencesStore);
    const {
      isListViewOpened,
      getEditorMode,
      getInserterSidebarToggleRef,
      getListViewToggleRef
    } = unlock(select(editorStore));
    const { getShortcutRepresentation } = select(keyboardShortcutsStore);
    return {
      isInserterOpened: select(editorStore).isInserterOpened(),
      isListViewOpen: isListViewOpened(),
      listViewShortcut: getShortcutRepresentation(
        "core/editor/toggle-list-view"
      ),
      inserterSidebarToggleRef: getInserterSidebarToggleRef(),
      listViewToggleRef: getListViewToggleRef(),
      showIconLabels: get("core", "showIconLabels"),
      isDistractionFree: get("core", "distractionFree"),
      isVisualMode: getEditorMode() === "visual"
    };
  }, []);
  const preventDefault = (event) => {
    if (isInserterOpened) {
      event.preventDefault();
    }
  };
  const isWideViewport = useViewportMatch("wide");
  const toolbarAriaLabel = __("Document tools");
  const toggleListView = useCallback(
    () => setIsListViewOpened(!isListViewOpen),
    [setIsListViewOpened, isListViewOpen]
  );
  const toggleInserter = useCallback(
    () => setIsInserterOpened(!isInserterOpened),
    [isInserterOpened, setIsInserterOpened]
  );
  const longLabel = _x(
    "Block Inserter",
    "Generic label for block inserter button"
  );
  const shortLabel = !isInserterOpened ? __("Add") : __("Close");
  return (
    // Some plugins expect and use the `edit-post-header-toolbar` CSS class to
    // find the toolbar and inject UI elements into it. This is not officially
    // supported, but we're keeping it in the list of class names for backwards
    // compatibility.
    /* @__PURE__ */ jsx(
      NavigableToolbar,
      {
        className: clsx(
          "editor-document-tools",
          "edit-post-header-toolbar",
          className
        ),
        "aria-label": toolbarAriaLabel,
        variant: "unstyled",
        children: /* @__PURE__ */ jsxs("div", { className: "editor-document-tools__left", children: [
          !isDistractionFree && /* @__PURE__ */ jsx(
            ToolbarButton,
            {
              ref: inserterSidebarToggleRef,
              className: "editor-document-tools__inserter-toggle",
              variant: "primary",
              isPressed: isInserterOpened,
              onMouseDown: preventDefault,
              onClick: toggleInserter,
              disabled: disableBlockTools,
              icon: plus,
              label: showIconLabels ? shortLabel : longLabel,
              showTooltip: !showIconLabels,
              "aria-expanded": isInserterOpened
            }
          ),
          (isWideViewport || !showIconLabels) && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              ToolbarItem,
              {
                as: EditorHistoryUndo,
                showTooltip: !showIconLabels,
                variant: showIconLabels ? "tertiary" : void 0,
                size: "compact"
              }
            ),
            /* @__PURE__ */ jsx(
              ToolbarItem,
              {
                as: EditorHistoryRedo,
                showTooltip: !showIconLabels,
                variant: showIconLabels ? "tertiary" : void 0,
                size: "compact"
              }
            ),
            !isDistractionFree && /* @__PURE__ */ jsx(
              ToolbarButton,
              {
                className: "editor-document-tools__document-overview-toggle",
                icon: listView,
                disabled: disableBlockTools,
                isPressed: isListViewOpen,
                label: __("Document Overview"),
                onClick: toggleListView,
                shortcut: listViewShortcut,
                showTooltip: !showIconLabels,
                variant: showIconLabels ? "tertiary" : void 0,
                "aria-expanded": isListViewOpen,
                ref: listViewToggleRef
              }
            )
          ] })
        ] })
      }
    )
  );
}
var document_tools_default = DocumentTools;
export {
  document_tools_default as default
};
//# sourceMappingURL=index.mjs.map
