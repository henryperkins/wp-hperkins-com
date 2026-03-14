// packages/editor/src/components/post-taxonomies/panel.js
import { PanelBody } from "@wordpress/components";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as editorStore } from "../../store/index.mjs";
import PostTaxonomiesForm from "./index.mjs";
import PostTaxonomiesCheck from "./check.mjs";
import { jsx } from "react/jsx-runtime";
function TaxonomyPanel({ taxonomy, children }) {
  const slug = taxonomy?.slug;
  const panelName = slug ? `taxonomy-panel-${slug}` : "";
  const { isEnabled, isOpened } = useSelect(
    (select) => {
      const { isEditorPanelEnabled, isEditorPanelOpened } = select(editorStore);
      return {
        isEnabled: slug ? isEditorPanelEnabled(panelName) : false,
        isOpened: slug ? isEditorPanelOpened(panelName) : false
      };
    },
    [panelName, slug]
  );
  const { toggleEditorPanelOpened } = useDispatch(editorStore);
  if (!isEnabled) {
    return null;
  }
  const taxonomyMenuName = taxonomy?.labels?.menu_name;
  if (!taxonomyMenuName) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    PanelBody,
    {
      title: taxonomyMenuName,
      opened: isOpened,
      onToggle: () => toggleEditorPanelOpened(panelName),
      children
    }
  );
}
function PostTaxonomies() {
  return /* @__PURE__ */ jsx(PostTaxonomiesCheck, { children: /* @__PURE__ */ jsx(
    PostTaxonomiesForm,
    {
      taxonomyWrapper: (content, taxonomy) => {
        return /* @__PURE__ */ jsx(TaxonomyPanel, { taxonomy, children: content });
      }
    }
  ) });
}
export {
  PostTaxonomies as default
};
//# sourceMappingURL=panel.mjs.map
