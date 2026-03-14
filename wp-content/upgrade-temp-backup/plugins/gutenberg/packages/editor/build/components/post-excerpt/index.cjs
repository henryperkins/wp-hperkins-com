"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/post-excerpt/index.js
var post_excerpt_exports = {};
__export(post_excerpt_exports, {
  default: () => PostExcerpt
});
module.exports = __toCommonJS(post_excerpt_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_html_entities = require("@wordpress/html-entities");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function PostExcerpt({
  hideLabelFromVision = false,
  updateOnBlur = false
}) {
  const { excerpt, shouldUseDescriptionLabel, usedAttribute } = (0, import_data.useSelect)(
    (select) => {
      const { getCurrentPostType, getEditedPostAttribute } = select(import_store.store);
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
  const { editPost } = (0, import_data.useDispatch)(import_store.store);
  const [localExcerpt, setLocalExcerpt] = (0, import_element.useState)(
    (0, import_html_entities.decodeEntities)(excerpt)
  );
  const updatePost = (value) => {
    editPost({ [usedAttribute]: value });
  };
  const label = shouldUseDescriptionLabel ? (0, import_i18n.__)("Write a description (optional)") : (0, import_i18n.__)("Write an excerpt (optional)");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-post-excerpt", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.TextareaControl,
    {
      label,
      hideLabelFromVision,
      className: "editor-post-excerpt__textarea",
      onChange: updateOnBlur ? setLocalExcerpt : updatePost,
      onBlur: updateOnBlur ? () => updatePost(localExcerpt) : void 0,
      value: updateOnBlur ? localExcerpt : excerpt,
      help: !shouldUseDescriptionLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.ExternalLink,
        {
          href: (0, import_i18n.__)(
            "https://wordpress.org/documentation/article/page-post-settings-sidebar/#excerpt"
          ),
          children: (0, import_i18n.__)("Learn more about manual excerpts")
        }
      ) : (0, import_i18n.__)("Write a description")
    }
  ) });
}
//# sourceMappingURL=index.cjs.map
