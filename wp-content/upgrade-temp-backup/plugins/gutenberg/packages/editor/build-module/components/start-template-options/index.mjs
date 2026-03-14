// packages/editor/src/components/start-template-options/index.js
import { Modal, Flex, FlexItem, Button } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useState, useMemo, useEffect } from "@wordpress/element";
import { __experimentalBlockPatternsList as BlockPatternsList } from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { parse } from "@wordpress/blocks";
import { store as coreStore, useEntityBlockEditor } from "@wordpress/core-data";
import { store as editorStore } from "../../store/index.mjs";
import { TEMPLATE_POST_TYPE } from "../../store/constants.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function useFallbackTemplateContent(slug, isCustom = false) {
  return useSelect(
    (select) => {
      const { getEntityRecord, getDefaultTemplateId } = select(coreStore);
      const templateId = getDefaultTemplateId({
        slug,
        is_custom: isCustom,
        ignore_empty: true
      });
      return templateId ? getEntityRecord("postType", TEMPLATE_POST_TYPE, templateId)?.content?.raw : void 0;
    },
    [slug, isCustom]
  );
}
function useStartPatterns(fallbackContent) {
  const { slug, patterns } = useSelect((select) => {
    const { getCurrentPostType, getCurrentPostId } = select(editorStore);
    const { getEntityRecord, getBlockPatterns } = select(coreStore);
    const postId = getCurrentPostId();
    const postType = getCurrentPostType();
    const record = getEntityRecord("postType", postType, postId);
    return {
      slug: record.slug,
      patterns: getBlockPatterns()
    };
  }, []);
  const currentThemeStylesheet = useSelect(
    (select) => select(coreStore).getCurrentTheme().stylesheet
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
  return useMemo(() => {
    return [
      {
        name: "fallback",
        blocks: parse(fallbackContent),
        title: __("Fallback content")
      },
      ...patterns.filter((pattern) => {
        return Array.isArray(pattern.templateTypes) && pattern.templateTypes.some(
          (templateType) => slug.startsWith(templateType)
        );
      }).map((pattern) => {
        return {
          ...pattern,
          blocks: parse(pattern.content).map(
            (block) => injectThemeAttributeInBlockTemplateContent(block)
          )
        };
      })
    ];
  }, [fallbackContent, slug, patterns]);
}
function PatternSelection({ fallbackContent, onChoosePattern, postType }) {
  const [, , onChange] = useEntityBlockEditor("postType", postType);
  const blockPatterns = useStartPatterns(fallbackContent);
  return /* @__PURE__ */ jsx(
    BlockPatternsList,
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
  return /* @__PURE__ */ jsxs(
    Modal,
    {
      className: "editor-start-template-options__modal",
      title: __("Choose a pattern"),
      closeLabel: __("Cancel"),
      focusOnMount: "firstElement",
      onRequestClose: onClose,
      isFullScreen: true,
      children: [
        /* @__PURE__ */ jsx("div", { className: "editor-start-template-options__modal-content", children: /* @__PURE__ */ jsx(
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
        /* @__PURE__ */ jsx(
          Flex,
          {
            className: "editor-start-template-options__modal__actions",
            justify: "flex-end",
            expanded: false,
            children: /* @__PURE__ */ jsx(FlexItem, { children: /* @__PURE__ */ jsx(
              Button,
              {
                __next40pxDefaultSize: true,
                variant: "tertiary",
                onClick: onClose,
                children: __("Skip")
              }
            ) })
          }
        )
      ]
    }
  );
}
function StartTemplateOptions() {
  const [isClosed, setIsClosed] = useState(false);
  const { shouldOpenModal, slug, isCustom, postType, postId } = useSelect(
    (select) => {
      const { getCurrentPostType, getCurrentPostId } = select(editorStore);
      const _postType = getCurrentPostType();
      const _postId = getCurrentPostId();
      const { getEditedEntityRecord, hasEditsForEntityRecord } = select(coreStore);
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
        shouldOpenModal: !hasEdits && "" === templateRecord.content && TEMPLATE_POST_TYPE === _postType,
        slug: templateRecord.slug,
        isCustom: templateRecord.is_custom,
        postType: _postType,
        postId: _postId
      };
    },
    []
  );
  useEffect(() => {
    setIsClosed(false);
  }, [postType, postId]);
  if (!shouldOpenModal || isClosed) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    StartModal,
    {
      slug,
      isCustom,
      postType,
      onClose: () => setIsClosed(true)
    }
  );
}
export {
  StartTemplateOptions as default
};
//# sourceMappingURL=index.mjs.map
