// packages/editor/src/components/more-menu/copy-content-menu-item.js
import { MenuItem } from "@wordpress/components";
import { useSelect, useDispatch } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { useCopyToClipboard } from "@wordpress/compose";
import { store as noticesStore } from "@wordpress/notices";
import { store as editorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
function CopyContentMenuItem() {
  const { createNotice } = useDispatch(noticesStore);
  const { getEditedPostContent } = useSelect(editorStore);
  function getText() {
    return getEditedPostContent();
  }
  function onSuccess() {
    createNotice("info", __("All content copied."), {
      isDismissible: true,
      type: "snackbar"
    });
  }
  const ref = useCopyToClipboard(getText, onSuccess);
  return /* @__PURE__ */ jsx(MenuItem, { ref, children: __("Copy all blocks") });
}
export {
  CopyContentMenuItem as default
};
//# sourceMappingURL=copy-content-menu-item.mjs.map
