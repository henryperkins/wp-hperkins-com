// packages/editor/src/components/post-publish-panel/maybe-category-panel.js
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { PanelBody } from "@wordpress/components";
import { store as coreStore } from "@wordpress/core-data";
import { useState, useEffect } from "@wordpress/element";
import HierarchicalTermSelector from "../post-taxonomies/hierarchical-term-selector.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function MaybeCategoryPanel() {
  const { hasNoCategory, hasSiteCategories } = useSelect((select) => {
    const postType = select(editorStore).getCurrentPostType();
    const { canUser, getEntityRecord } = select(coreStore);
    const categoriesTaxonomy = getEntityRecord(
      "root",
      "taxonomy",
      "category"
    );
    const defaultCategoryId = canUser("read", {
      kind: "root",
      name: "site"
    }) ? getEntityRecord("root", "site")?.default_category : void 0;
    const defaultCategory = defaultCategoryId ? getEntityRecord("taxonomy", "category", defaultCategoryId) : void 0;
    const postTypeSupportsCategories = categoriesTaxonomy && categoriesTaxonomy.types.some((type) => type === postType);
    const categories = categoriesTaxonomy && select(editorStore).getEditedPostAttribute(
      categoriesTaxonomy.rest_base
    );
    const siteCategories = postTypeSupportsCategories ? !!select(coreStore).getEntityRecords("taxonomy", "category", {
      exclude: [defaultCategoryId],
      per_page: 1
    })?.length : false;
    const noCategory = !!categoriesTaxonomy && !!defaultCategory && postTypeSupportsCategories && (categories?.length === 0 || categories?.length === 1 && defaultCategory?.id === categories[0]);
    return {
      hasNoCategory: noCategory,
      hasSiteCategories: siteCategories
    };
  }, []);
  const [shouldShowPanel, setShouldShowPanel] = useState(false);
  useEffect(() => {
    if (hasNoCategory) {
      setShouldShowPanel(true);
    }
  }, [hasNoCategory]);
  if (!shouldShowPanel || !hasSiteCategories) {
    return null;
  }
  const panelBodyTitle = [
    __("Suggestion:"),
    /* @__PURE__ */ jsx("span", { className: "editor-post-publish-panel__link", children: __("Assign a category") }, "label")
  ];
  return /* @__PURE__ */ jsxs(PanelBody, { initialOpen: false, title: panelBodyTitle, children: [
    /* @__PURE__ */ jsx("p", { children: __(
      "Categories provide a helpful way to group related posts together and to quickly tell readers what a post is about."
    ) }),
    /* @__PURE__ */ jsx(HierarchicalTermSelector, { slug: "category" })
  ] });
}
var maybe_category_panel_default = MaybeCategoryPanel;
export {
  maybe_category_panel_default as default
};
//# sourceMappingURL=maybe-category-panel.mjs.map
