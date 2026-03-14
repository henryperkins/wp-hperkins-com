// packages/edit-widgets/src/components/secondary-sidebar/list-view-sidebar.js
import { __experimentalListView as ListView } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";
import { useFocusOnMount, useMergeRefs } from "@wordpress/compose";
import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { closeSmall } from "@wordpress/icons";
import { ESCAPE } from "@wordpress/keycodes";
import { store as editWidgetsStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function ListViewSidebar() {
  const { setIsListViewOpened } = useDispatch(editWidgetsStore);
  const { getListViewToggleRef } = unlock(useSelect(editWidgetsStore));
  const [dropZoneElement, setDropZoneElement] = useState(null);
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
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "edit-widgets-editor__list-view-panel",
        onKeyDown: closeOnEscape,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "edit-widgets-editor__list-view-panel-header", children: [
            /* @__PURE__ */ jsx("strong", { children: __("List View") }),
            /* @__PURE__ */ jsx(
              Button,
              {
                icon: closeSmall,
                label: __("Close"),
                onClick: closeListView,
                size: "compact"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "edit-widgets-editor__list-view-panel-content",
              ref: useMergeRefs([focusOnMountRef, setDropZoneElement]),
              children: /* @__PURE__ */ jsx(ListView, { dropZoneElement })
            }
          )
        ]
      }
    )
  );
}
export {
  ListViewSidebar as default
};
//# sourceMappingURL=list-view-sidebar.mjs.map
