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

// packages/editor/src/components/post-transform-panel/index.js
var post_transform_panel_exports = {};
__export(post_transform_panel_exports, {
  default: () => PostTransformPanel
});
module.exports = __toCommonJS(post_transform_panel_exports);
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_block_editor = require("@wordpress/block-editor");
var import_blocks = require("@wordpress/blocks");
var import_store = require("../../store/index.cjs");
var import_hooks = require("./hooks.cjs");
var import_constants = require("../../store/constants.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function TemplatesList({ availableTemplates, onSelect }) {
  if (!availableTemplates || availableTemplates?.length === 0) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_block_editor.__experimentalBlockPatternsList,
    {
      label: (0, import_i18n.__)("Templates"),
      blockPatterns: availableTemplates,
      onClickPattern: onSelect,
      showTitlesAsTooltip: true
    }
  );
}
function PostTransform() {
  const { area, name, slug, postType, postId } = (0, import_data.useSelect)((select) => {
    const { getCurrentPostType, getCurrentPostId } = select(import_store.store);
    const { getEditedEntityRecord } = select(import_core_data.store);
    const type = getCurrentPostType();
    const id = getCurrentPostId();
    const record = getEditedEntityRecord("postType", type, id);
    return {
      area: record?.area,
      name: record?.name,
      slug: record?.slug,
      postType: type,
      postId: id
    };
  }, []);
  const { editEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
  const availablePatterns = (0, import_hooks.useAvailablePatterns)({ area, name, slug });
  const onTemplateSelect = async (selectedTemplate) => {
    await editEntityRecord("postType", postType, postId, {
      blocks: selectedTemplate.blocks,
      content: (0, import_blocks.serialize)(selectedTemplate.blocks)
    });
  };
  if (!availablePatterns?.length) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.PanelBody,
    {
      title: (0, import_i18n.__)("Design"),
      initialOpen: postType === import_constants.TEMPLATE_PART_POST_TYPE,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        TemplatesList,
        {
          availableTemplates: availablePatterns,
          onSelect: onTemplateSelect
        }
      )
    }
  );
}
function PostTransformPanel() {
  const { postType } = (0, import_data.useSelect)((select) => {
    const { getCurrentPostType } = select(import_store.store);
    return {
      postType: getCurrentPostType()
    };
  }, []);
  if (![import_constants.TEMPLATE_PART_POST_TYPE, import_constants.TEMPLATE_POST_TYPE].includes(postType)) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostTransform, {});
}
//# sourceMappingURL=index.cjs.map
