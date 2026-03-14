// packages/editor/src/components/post-taxonomies/index.js
import { Fragment } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import HierarchicalTermSelector from "./hierarchical-term-selector.mjs";
import FlatTermSelector from "./flat-term-selector.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
var identity = (x) => x;
function PostTaxonomies({ taxonomyWrapper = identity }) {
  const { postType, taxonomies } = useSelect((select) => {
    return {
      postType: select(editorStore).getCurrentPostType(),
      taxonomies: select(coreStore).getEntityRecords(
        "root",
        "taxonomy",
        { per_page: -1 }
      )
    };
  }, []);
  const visibleTaxonomies = (taxonomies ?? []).filter(
    (taxonomy) => (
      // In some circumstances .visibility can end up as undefined so optional chaining operator required.
      // https://github.com/WordPress/gutenberg/issues/40326
      taxonomy.types.includes(postType) && taxonomy.visibility?.show_ui
    )
  );
  return visibleTaxonomies.map((taxonomy) => {
    const TaxonomyComponent = taxonomy.hierarchical ? HierarchicalTermSelector : FlatTermSelector;
    return /* @__PURE__ */ jsx(Fragment, { children: taxonomyWrapper(
      /* @__PURE__ */ jsx(TaxonomyComponent, { slug: taxonomy.slug }),
      taxonomy
    ) }, `taxonomy-${taxonomy.slug}`);
  });
}
var post_taxonomies_default = PostTaxonomies;
export {
  PostTaxonomies,
  post_taxonomies_default as default
};
//# sourceMappingURL=index.mjs.map
