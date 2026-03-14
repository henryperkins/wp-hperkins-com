// packages/editor/src/components/post-publish-panel/maybe-tags-panel.js
import { __, sprintf } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { PanelBody } from "@wordpress/components";
import { store as coreStore } from "@wordpress/core-data";
import FlatTermSelector from "../post-taxonomies/flat-term-selector.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var TagsPanel = () => {
  const tagLabels = useSelect((select) => {
    const taxonomy = select(coreStore).getTaxonomy("post_tag");
    return taxonomy?.labels;
  }, []);
  const addNewItem = tagLabels?.add_new_item ?? __("Add tag");
  const tagLabel = tagLabels?.name ?? __("Tags");
  const panelBodyTitle = [
    __("Suggestion:"),
    /* @__PURE__ */ jsx("span", { className: "editor-post-publish-panel__link", children: addNewItem }, "label")
  ];
  return /* @__PURE__ */ jsxs(PanelBody, { initialOpen: false, title: panelBodyTitle, children: [
    /* @__PURE__ */ jsx("p", { children: sprintf(
      // translators: %s is the taxonomy name (e.g., "Tags").
      __(
        "%s help users and search engines navigate your site and find your content. Add a few keywords to describe your post."
      ),
      tagLabel
    ) }),
    /* @__PURE__ */ jsx(FlatTermSelector, { slug: "post_tag" })
  ] });
};
var MaybeTagsPanel = () => {
  const { postHasTags, siteHasTags, isPostTypeSupported } = useSelect(
    (select) => {
      const postType = select(editorStore).getCurrentPostType();
      const tagsTaxonomy = select(coreStore).getEntityRecord(
        "root",
        "taxonomy",
        "post_tag"
      );
      const _isPostTypeSupported = tagsTaxonomy?.types?.includes(postType);
      const areTagsFetched = tagsTaxonomy !== void 0;
      const tags = tagsTaxonomy && select(editorStore).getEditedPostAttribute(
        tagsTaxonomy.rest_base
      );
      const siteTags = _isPostTypeSupported ? !!select(coreStore).getEntityRecords(
        "taxonomy",
        "post_tag",
        { per_page: 1 }
      )?.length : false;
      return {
        postHasTags: !!tags?.length,
        siteHasTags: siteTags,
        isPostTypeSupported: areTagsFetched && _isPostTypeSupported
      };
    },
    []
  );
  const [hadTagsWhenOpeningThePanel] = useState(postHasTags);
  if (!isPostTypeSupported || !siteHasTags) {
    return null;
  }
  if (!hadTagsWhenOpeningThePanel) {
    return /* @__PURE__ */ jsx(TagsPanel, {});
  }
  return null;
};
var maybe_tags_panel_default = MaybeTagsPanel;
export {
  maybe_tags_panel_default as default
};
//# sourceMappingURL=maybe-tags-panel.mjs.map
