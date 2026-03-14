// packages/editor/src/components/post-excerpt/index.js
import { __ } from "@wordpress/i18n";
import { ExternalLink, TextareaControl } from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { useState } from "@wordpress/element";
import { decodeEntities } from "@wordpress/html-entities";
import { store as editorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
function PostExcerpt({
  hideLabelFromVision = false,
  updateOnBlur = false
}) {
  const { excerpt, shouldUseDescriptionLabel, usedAttribute } = useSelect(
    (select) => {
      const { getCurrentPostType, getEditedPostAttribute } = select(editorStore);
      const postType = getCurrentPostType();
      const _usedAttribute = [
        "wp_template",
        "wp_template_part"
      ].includes(postType) ? "description" : "excerpt";
      return {
        excerpt: getEditedPostAttribute(_usedAttribute),
        // There are special cases where we want to label the excerpt as a description.
        shouldUseDescriptionLabel: [
          "wp_template",
          "wp_template_part",
          "wp_block"
        ].includes(postType),
        usedAttribute: _usedAttribute
      };
    },
    []
  );
  const { editPost } = useDispatch(editorStore);
  const [localExcerpt, setLocalExcerpt] = useState(
    decodeEntities(excerpt)
  );
  const updatePost = (value) => {
    editPost({ [usedAttribute]: value });
  };
  const label = shouldUseDescriptionLabel ? __("Write a description (optional)") : __("Write an excerpt (optional)");
  return /* @__PURE__ */ jsx("div", { className: "editor-post-excerpt", children: /* @__PURE__ */ jsx(
    TextareaControl,
    {
      label,
      hideLabelFromVision,
      className: "editor-post-excerpt__textarea",
      onChange: updateOnBlur ? setLocalExcerpt : updatePost,
      onBlur: updateOnBlur ? () => updatePost(localExcerpt) : void 0,
      value: updateOnBlur ? localExcerpt : excerpt,
      help: !shouldUseDescriptionLabel ? /* @__PURE__ */ jsx(
        ExternalLink,
        {
          href: __(
            "https://wordpress.org/documentation/article/page-post-settings-sidebar/#excerpt"
          ),
          children: __("Learn more about manual excerpts")
        }
      ) : __("Write a description")
    }
  ) });
}
export {
  PostExcerpt as default
};
//# sourceMappingURL=index.mjs.map
