// packages/editor/src/components/styles-canvas/index.js
import { Button } from "@wordpress/components";
import { ESCAPE } from "@wordpress/keycodes";
import { __ } from "@wordpress/i18n";
import { useDispatch, useSelect } from "@wordpress/data";
import { closeSmall } from "@wordpress/icons";
import { useFocusOnMount, useFocusReturn } from "@wordpress/compose";
import { store as preferencesStore } from "@wordpress/preferences";
import { unlock } from "../../lock-unlock.mjs";
import StylesCanvasStyleBook from "./style-book.mjs";
import StylesCanvasRevisions from "./revisions.mjs";
import { store as editorStore } from "../../store/index.mjs";
import ResizableEditor from "../resizable-editor/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function getStylesCanvasTitle(path, showStylebook) {
  if (showStylebook) {
    return __("Style Book");
  }
  if (path?.startsWith("/revisions")) {
    return __("Style Revisions");
  }
  return "";
}
function StylesCanvas() {
  const { stylesPath, showStylebook, showListViewByDefault } = useSelect(
    (select) => {
      const { getStylesPath, getShowStylebook } = unlock(
        select(editorStore)
      );
      const _showListViewByDefault = select(preferencesStore).get(
        "core",
        "showListViewByDefault"
      );
      return {
        stylesPath: getStylesPath(),
        showStylebook: getShowStylebook(),
        showListViewByDefault: _showListViewByDefault
      };
    },
    []
  );
  const { resetStylesNavigation, setStylesPath } = unlock(
    useDispatch(editorStore)
  );
  const { setIsListViewOpened } = useDispatch(editorStore);
  const focusOnMountRef = useFocusOnMount("firstElement");
  const sectionFocusReturnRef = useFocusReturn();
  let content = null;
  if (showStylebook) {
    content = /* @__PURE__ */ jsx(
      StylesCanvasStyleBook,
      {
        path: stylesPath,
        onPathChange: setStylesPath,
        ref: sectionFocusReturnRef
      }
    );
  } else if (stylesPath?.startsWith("/revisions")) {
    content = /* @__PURE__ */ jsx(
      StylesCanvasRevisions,
      {
        path: stylesPath,
        ref: sectionFocusReturnRef
      }
    );
  }
  const title = getStylesCanvasTitle(stylesPath, showStylebook);
  const onCloseCanvas = () => {
    setIsListViewOpened(showListViewByDefault);
    resetStylesNavigation();
  };
  const closeOnEscape = (event) => {
    if (event.keyCode === ESCAPE && !event.defaultPrevented) {
      event.preventDefault();
      onCloseCanvas();
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "editor-styles-canvas", children: /* @__PURE__ */ jsx(ResizableEditor, { enableResizing: false, children: /* @__PURE__ */ jsxs(
    "section",
    {
      className: "editor-styles-canvas__section",
      ref: focusOnMountRef,
      onKeyDown: closeOnEscape,
      "aria-label": title,
      children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            size: "compact",
            className: "editor-styles-canvas__close-button",
            icon: closeSmall,
            label: __("Close"),
            onClick: onCloseCanvas
          }
        ),
        content
      ]
    }
  ) }) });
}
export {
  StylesCanvas as default,
  getStylesCanvasTitle
};
//# sourceMappingURL=index.mjs.map
