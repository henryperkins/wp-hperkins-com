// packages/edit-site/src/components/block-editor/use-editor-iframe-props.js
import clsx from "clsx";
import { useSelect } from "@wordpress/data";
import { ENTER, SPACE } from "@wordpress/keycodes";
import { useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { store as editorStore } from "@wordpress/editor";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { addQueryArgs } from "@wordpress/url";
import { unlock } from "../../lock-unlock.mjs";
var { useLocation, useHistory } = unlock(routerPrivateApis);
function useEditorIframeProps() {
  const { query, path } = useLocation();
  const history = useHistory();
  const { canvas = "view" } = query;
  const currentPostIsTrashed = useSelect((select) => {
    return select(editorStore).getCurrentPostAttribute("status") === "trash";
  }, []);
  const [isFocused, setIsFocused] = useState(false);
  useEffect(() => {
    if (canvas === "edit") {
      setIsFocused(false);
    }
  }, [canvas]);
  const viewModeIframeProps = {
    "aria-label": __("Edit"),
    "aria-disabled": currentPostIsTrashed,
    title: null,
    role: "button",
    tabIndex: 0,
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    onKeyDown: (event) => {
      const { keyCode } = event;
      if ((keyCode === ENTER || keyCode === SPACE) && !currentPostIsTrashed) {
        event.preventDefault();
        history.navigate(addQueryArgs(path, { canvas: "edit" }), {
          transition: "canvas-mode-edit-transition"
        });
      }
    },
    onClick: () => history.navigate(addQueryArgs(path, { canvas: "edit" }), {
      transition: "canvas-mode-edit-transition"
    }),
    onClickCapture: (event) => {
      if (currentPostIsTrashed) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    readonly: true
  };
  return {
    className: clsx("edit-site-visual-editor__editor-canvas", {
      "is-focused": isFocused && canvas === "view"
    }),
    ...canvas === "view" ? viewModeIframeProps : {}
  };
}
export {
  useEditorIframeProps as default
};
//# sourceMappingURL=use-editor-iframe-props.mjs.map
