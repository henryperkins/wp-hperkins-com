// packages/editor/src/components/list-view-sidebar/index.js
import {
  __experimentalListView as ListView,
  privateApis as blockEditorPrivateApis
} from "@wordpress/block-editor";
import { useFocusOnMount, useMergeRefs } from "@wordpress/compose";
import { useDispatch, useSelect } from "@wordpress/data";
import { focus } from "@wordpress/dom";
import { useCallback, useRef, useState } from "@wordpress/element";
import { __, _x } from "@wordpress/i18n";
import { useShortcut } from "@wordpress/keyboard-shortcuts";
import { ESCAPE } from "@wordpress/keycodes";
import ListViewOutline from "./list-view-outline.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
var { TabbedSidebar } = unlock(blockEditorPrivateApis);
function ListViewSidebar() {
  const { setIsListViewOpened } = useDispatch(editorStore);
  const { getListViewToggleRef } = unlock(useSelect(editorStore));
  const focusOnMountRef = useFocusOnMount("firstElement");
  const closeListView = useCallback(() => {
    setIsListViewOpened(false);
    getListViewToggleRef().current?.focus();
  }, [getListViewToggleRef, setIsListViewOpened]);
  const closeOnEscape = useCallback(
    (event) => {
      if (event.keyCode === ESCAPE && !event.defaultPrevented) {
        event.preventDefault();
        closeListView();
      }
    },
    [closeListView]
  );
  const [dropZoneElement, setDropZoneElement] = useState(null);
  const [tab, setTab] = useState("list-view");
  const sidebarRef = useRef();
  const tabsRef = useRef();
  const listViewRef = useRef();
  const listViewContainerRef = useMergeRefs([
    focusOnMountRef,
    listViewRef,
    setDropZoneElement
  ]);
  function handleSidebarFocus(currentTab) {
    const tabPanelFocus = focus.tabbable.find(tabsRef.current)[0];
    if (currentTab === "list-view") {
      const listViewApplicationFocus = focus.tabbable.find(
        listViewRef.current
      )[0];
      const listViewFocusArea = sidebarRef.current.contains(
        listViewApplicationFocus
      ) ? listViewApplicationFocus : tabPanelFocus;
      listViewFocusArea.focus();
    } else {
      tabPanelFocus.focus();
    }
  }
  const handleToggleListViewShortcut = useCallback(() => {
    if (sidebarRef.current.contains(
      sidebarRef.current.ownerDocument.activeElement
    )) {
      closeListView();
    } else {
      handleSidebarFocus(tab);
    }
  }, [closeListView, tab]);
  useShortcut("core/editor/toggle-list-view", handleToggleListViewShortcut);
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "editor-list-view-sidebar",
        onKeyDown: closeOnEscape,
        ref: sidebarRef,
        children: /* @__PURE__ */ jsx(
          TabbedSidebar,
          {
            tabs: [
              {
                name: "list-view",
                title: _x("List View", "Post overview"),
                panel: /* @__PURE__ */ jsx("div", { className: "editor-list-view-sidebar__list-view-container", children: /* @__PURE__ */ jsx("div", { className: "editor-list-view-sidebar__list-view-panel-content", children: /* @__PURE__ */ jsx(
                  ListView,
                  {
                    dropZoneElement
                  }
                ) }) }),
                panelRef: listViewContainerRef
              },
              {
                name: "outline",
                title: _x("Outline", "Post overview"),
                panel: /* @__PURE__ */ jsx("div", { className: "editor-list-view-sidebar__list-view-container", children: /* @__PURE__ */ jsx(ListViewOutline, {}) })
              }
            ],
            onClose: closeListView,
            onSelect: (tabName) => setTab(tabName),
            defaultTabId: "list-view",
            ref: tabsRef,
            closeButtonLabel: __("Close")
          }
        )
      }
    )
  );
}
export {
  ListViewSidebar as default
};
//# sourceMappingURL=index.mjs.map
