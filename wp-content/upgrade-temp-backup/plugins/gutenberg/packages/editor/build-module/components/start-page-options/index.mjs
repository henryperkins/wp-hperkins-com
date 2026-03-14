// packages/editor/src/components/start-page-options/index.js
import { Flex, FlexItem, Modal, CheckboxControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useState, useMemo, useEffect } from "@wordpress/element";
import {
  store as blockEditorStore,
  __experimentalBlockPatternsList as BlockPatternsList
} from "@wordpress/block-editor";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { __unstableSerializeAndClean } from "@wordpress/blocks";
import { store as preferencesStore } from "@wordpress/preferences";
import { store as interfaceStore } from "@wordpress/interface";
import {
  ATTACHMENT_POST_TYPE,
  TEMPLATE_POST_TYPE,
  TEMPLATE_PART_POST_TYPE
} from "../../store/constants.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function useStartPatterns() {
  const { blockPatternsWithPostContentBlockType, postType } = useSelect(
    (select) => {
      const { getPatternsByBlockTypes, getBlocksByName } = select(blockEditorStore);
      const { getCurrentPostType, getRenderingMode } = select(editorStore);
      const rootClientId = getRenderingMode() === "post-only" ? "" : getBlocksByName("core/post-content")?.[0];
      return {
        blockPatternsWithPostContentBlockType: getPatternsByBlockTypes(
          "core/post-content",
          rootClientId
        ),
        postType: getCurrentPostType()
      };
    },
    []
  );
  return useMemo(() => {
    if (!blockPatternsWithPostContentBlockType?.length) {
      return [];
    }
    return blockPatternsWithPostContentBlockType.filter((pattern) => {
      return postType === "page" && !pattern.postTypes || Array.isArray(pattern.postTypes) && pattern.postTypes.includes(postType);
    });
  }, [postType, blockPatternsWithPostContentBlockType]);
}
function PatternSelection({ blockPatterns, onChoosePattern }) {
  const { editEntityRecord } = useDispatch(coreStore);
  const { postType, postId } = useSelect((select) => {
    const { getCurrentPostType, getCurrentPostId } = select(editorStore);
    return {
      postType: getCurrentPostType(),
      postId: getCurrentPostId()
    };
  }, []);
  return /* @__PURE__ */ jsx(
    BlockPatternsList,
    {
      blockPatterns,
      onClickPattern: (_pattern, blocks) => {
        editEntityRecord("postType", postType, postId, {
          blocks,
          content: ({ blocks: blocksForSerialization = [] }) => __unstableSerializeAndClean(blocksForSerialization)
        });
        onChoosePattern();
      }
    }
  );
}
function StartPageOptionsModal({ onClose }) {
  const [showStartPatterns, setShowStartPatterns] = useState(true);
  const { set: setPreference } = useDispatch(preferencesStore);
  const startPatterns = useStartPatterns();
  const hasStartPattern = startPatterns.length > 0;
  if (!hasStartPattern) {
    return null;
  }
  function handleClose() {
    onClose();
    setPreference("core", "enableChoosePatternModal", showStartPatterns);
  }
  return /* @__PURE__ */ jsxs(
    Modal,
    {
      className: "editor-start-page-options__modal",
      title: __("Choose a pattern"),
      isFullScreen: true,
      onRequestClose: handleClose,
      children: [
        /* @__PURE__ */ jsx("div", { className: "editor-start-page-options__modal-content", children: /* @__PURE__ */ jsx(
          PatternSelection,
          {
            blockPatterns: startPatterns,
            onChoosePattern: handleClose
          }
        ) }),
        /* @__PURE__ */ jsx(
          Flex,
          {
            className: "editor-start-page-options__modal__actions",
            justify: "flex-start",
            expanded: false,
            children: /* @__PURE__ */ jsx(FlexItem, { children: /* @__PURE__ */ jsx(
              CheckboxControl,
              {
                checked: showStartPatterns,
                label: __(
                  "Always show starter patterns for new pages"
                ),
                onChange: (newValue) => {
                  setShowStartPatterns(newValue);
                }
              }
            ) })
          }
        )
      ]
    }
  );
}
function StartPageOptions() {
  const [isOpen, setIsOpen] = useState(false);
  const { isEditedPostDirty, isEditedPostEmpty } = useSelect(editorStore);
  const { isModalActive } = useSelect(interfaceStore);
  const { enabled, postId } = useSelect((select) => {
    const { getCurrentPostId, getCurrentPostType } = select(editorStore);
    const choosePatternModalEnabled = select(preferencesStore).get(
      "core",
      "enableChoosePatternModal"
    );
    const currentPostType = getCurrentPostType();
    return {
      postId: getCurrentPostId(),
      enabled: choosePatternModalEnabled && ATTACHMENT_POST_TYPE !== currentPostType && TEMPLATE_POST_TYPE !== currentPostType && TEMPLATE_PART_POST_TYPE !== currentPostType
    };
  }, []);
  useEffect(() => {
    const isFreshPage = !isEditedPostDirty() && isEditedPostEmpty();
    const isPreferencesModalActive = isModalActive("editor/preferences");
    if (!enabled || !isFreshPage || isPreferencesModalActive) {
      return;
    }
    setIsOpen(true);
  }, [
    enabled,
    postId,
    isEditedPostDirty,
    isEditedPostEmpty,
    isModalActive
  ]);
  if (!isOpen) {
    return null;
  }
  return /* @__PURE__ */ jsx(StartPageOptionsModal, { onClose: () => setIsOpen(false) });
}
export {
  StartPageOptions as default,
  useStartPatterns
};
//# sourceMappingURL=index.mjs.map
