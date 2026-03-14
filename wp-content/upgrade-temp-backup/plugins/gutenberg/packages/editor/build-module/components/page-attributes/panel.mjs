// packages/editor/src/components/page-attributes/panel.js
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { store as editorStore } from "../../store/index.mjs";
import PageAttributesCheck from "./check.mjs";
import { ParentRow } from "./parent.mjs";
import { jsx } from "react/jsx-runtime";
var PANEL_NAME = "page-attributes";
function AttributesPanel() {
  const { isEnabled, postType } = useSelect((select) => {
    const { getEditedPostAttribute, isEditorPanelEnabled } = select(editorStore);
    const { getPostType } = select(coreStore);
    return {
      isEnabled: isEditorPanelEnabled(PANEL_NAME),
      postType: getPostType(getEditedPostAttribute("type"))
    };
  }, []);
  if (!isEnabled || !postType) {
    return null;
  }
  return /* @__PURE__ */ jsx(ParentRow, {});
}
function PageAttributesPanel() {
  return /* @__PURE__ */ jsx(PageAttributesCheck, { children: /* @__PURE__ */ jsx(AttributesPanel, {}) });
}
export {
  PageAttributesPanel as default
};
//# sourceMappingURL=panel.mjs.map
