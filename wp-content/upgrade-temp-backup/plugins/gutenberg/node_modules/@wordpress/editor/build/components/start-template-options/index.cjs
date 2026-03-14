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

// packages/editor/src/components/start-template-options/index.js
var start_template_options_exports = {};
__export(start_template_options_exports, {
  default: () => StartTemplateOptions
});
module.exports = __toCommonJS(start_template_options_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_block_editor = require("@wordpress/block-editor");
var import_data = require("@wordpress/data");
var import_blocks = require("@wordpress/blocks");
var import_core_data = require("@wordpress/core-data");
var import_store = require("../../store/index.cjs");
var import_constants = require("../../store/constants.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function useFallbackTemplateContent(slug, isCustom = false) {
  return (0, import_data.useSelect)(
    (select) => {
      const { getEntityRecord, getDefaultTemplateId } = select(import_core_data.store);
      const templateId = getDefaultTemplateId({
        slug,
        is_custom: isCustom,
        ignore_empty: true
      });
      return templateId ? getEntityRecord("postType", import_constants.TEMPLATE_POST_TYPE, templateId)?.content?.raw : void 0;
    },
    [slug, isCustom]
  );
}
function useStartPatterns(fallbackContent) {
  const { slug, patterns } = (0, import_data.useSelect)((select) => {
    const { getCurrentPostType, getCurrentPostId } = select(import_store.store);
    const { getEntityRecord, getBlockPatterns } = select(import_core_data.store);
    const postId = getCurrentPostId();
    const postType = getCurrentPostType();
    const record = getEntityRecord("postType", postType, postId);
    return {
      slug: record.slug,
      patterns: getBlockPatterns()
    };
  }, []);
  const currentThemeStylesheet = (0, import_data.useSelect)(
    (select) => select(import_core_data.store).getCurrentTheme().stylesheet
  );
  function injectThemeAttributeInBlockTemplateContent(block) {
    if (block.innerBlocks.find(
      (innerBlock) => innerBlock.name === "core/template-part"
    )) {
      block.innerBlocks = block.innerBlocks.map((innerBlock) => {
        if (innerBlock.name === "core/template-part" && innerBlock.attributes.theme === void 0) {
          innerBlock.attributes.theme = currentThemeStylesheet;
        }
        return innerBlock;
      });
    }
    if (block.name === "core/template-part" && block.attributes.theme === void 0) {
      block.attributes.theme = currentThemeStylesheet;
    }
    return block;
  }
  return (0, import_element.useMemo)(() => {
    return [
      {
        name: "fallback",
        blocks: (0, import_blocks.parse)(fallbackContent),
        title: (0, import_i18n.__)("Fallback content")
      },
      ...patterns.filter((pattern) => {
        return Array.isArray(pattern.templateTypes) && pattern.templateTypes.some(
          (templateType) => slug.startsWith(templateType)
        );
      }).map((pattern) => {
        return {
          ...pattern,
          blocks: (0, import_blocks.parse)(pattern.content).map(
            (block) => injectThemeAttributeInBlockTemplateContent(block)
          )
        };
      })
    ];
  }, [fallbackContent, slug, patterns]);
}
function PatternSelection({ fallbackContent, onChoosePattern, postType }) {
  const [, , onChange] = (0, import_core_data.useEntityBlockEditor)("postType", postType);
  const blockPatterns = useStartPatterns(fallbackContent);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_block_editor.__experimentalBlockPatternsList,
    {
      blockPatterns,
      onClickPattern: (pattern, blocks) => {
        onChange(blocks, { selection: void 0 });
        onChoosePattern();
      }
    }
  );
}
function StartModal({ slug, isCustom, onClose, postType }) {
  const fallbackContent = useFallbackTemplateContent(slug, isCustom);
  if (!fallbackContent) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.Modal,
    {
      className: "editor-start-template-options__modal",
      title: (0, import_i18n.__)("Choose a pattern"),
      closeLabel: (0, import_i18n.__)("Cancel"),
      focusOnMount: "firstElement",
      onRequestClose: onClose,
      isFullScreen: true,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-start-template-options__modal-content", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          PatternSelection,
          {
            fallbackContent,
            slug,
            isCustom,
            postType,
            onChoosePattern: () => {
              onClose();
            }
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Flex,
          {
            className: "editor-start-template-options__modal__actions",
            justify: "flex-end",
            expanded: false,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.Button,
              {
                __next40pxDefaultSize: true,
                variant: "tertiary",
                onClick: onClose,
                children: (0, import_i18n.__)("Skip")
              }
            ) })
          }
        )
      ]
    }
  );
}
function StartTemplateOptions() {
  const [isClosed, setIsClosed] = (0, import_element.useState)(false);
  const { shouldOpenModal, slug, isCustom, postType, postId } = (0, import_data.useSelect)(
    (select) => {
      const { getCurrentPostType, getCurrentPostId } = select(import_store.store);
      const _postType = getCurrentPostType();
      const _postId = getCurrentPostId();
      const { getEditedEntityRecord, hasEditsForEntityRecord } = select(import_core_data.store);
      const templateRecord = getEditedEntityRecord(
        "postType",
        _postType,
        _postId
      );
      const hasEdits = hasEditsForEntityRecord(
        "postType",
        _postType,
        _postId
      );
      return {
        shouldOpenModal: !hasEdits && "" === templateRecord.content && import_constants.TEMPLATE_POST_TYPE === _postType,
        slug: templateRecord.slug,
        isCustom: templateRecord.is_custom,
        postType: _postType,
        postId: _postId
      };
    },
    []
  );
  (0, import_element.useEffect)(() => {
    setIsClosed(false);
  }, [postType, postId]);
  if (!shouldOpenModal || isClosed) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    StartModal,
    {
      slug,
      isCustom,
      postType,
      onClose: () => setIsClosed(true)
    }
  );
}
//# sourceMappingURL=index.cjs.map
