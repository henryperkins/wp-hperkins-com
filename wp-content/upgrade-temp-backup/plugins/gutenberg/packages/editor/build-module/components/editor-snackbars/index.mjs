// packages/editor/src/components/editor-snackbars/index.js
import deprecated from "@wordpress/deprecated";
import { SnackbarNotices } from "@wordpress/notices";
import { jsx } from "react/jsx-runtime";
function EditorSnackbars() {
  deprecated("wp.editor.EditorSnackbars", {
    since: "7.0",
    version: "7.2",
    alternative: "wp.notices.SnackbarNotices"
  });
  return /* @__PURE__ */ jsx(SnackbarNotices, { className: "components-editor-notices__snackbar" });
}
export {
  EditorSnackbars as default
};
//# sourceMappingURL=index.mjs.map
