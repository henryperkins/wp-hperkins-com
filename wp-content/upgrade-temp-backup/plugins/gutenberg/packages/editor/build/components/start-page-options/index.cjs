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

// packages/editor/src/components/start-page-options/index.js
var start_page_options_exports = {};
__export(start_page_options_exports, {
  default: () => StartPageOptions,
  useStartPatterns: () => useStartPatterns
});
module.exports = __toCommonJS(start_page_options_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_block_editor = require("@wordpress/block-editor");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_blocks = require("@wordpress/blocks");
var import_preferences = require("@wordpress/preferences");
var import_interface = require("@wordpress/interface");
var import_constants = require("../../store/constants.cjs");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function useStartPatterns() {
  const { blockPatternsWithPostContentBlockType, postType } = (0, import_data.useSelect)(
    (select) => {
      const { getPatternsByBlockTypes, getBlocksByName } = select(import_block_editor.store);
      const { getCurrentPostType, getRenderingMode } = select(import_store.store);
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
  return (0, import_element.useMemo)(() => {
    if (!blockPatternsWithPostContentBlockType?.length) {
      return [];
    }
    return blockPatternsWithPostContentBlockType.filter((pattern) => {
      return postType === "page" && !pattern.postTypes || Array.isArray(pattern.postTypes) && pattern.postTypes.includes(postType);
    });
  }, [postType, blockPatternsWithPostContentBlockType]);
}
function PatternSelection({ blockPatterns, onChoosePattern }) {
  const { editEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
  const { postType, postId } = (0, import_data.useSelect)((select) => {
    const { getCurrentPostType, getCurrentPostId } = select(import_store.store);
    return {
      postType: getCurrentPostType(),
      postId: getCurrentPostId()
    };
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_block_editor.__experimentalBlockPatternsList,
    {
      blockPatterns,
      onClickPattern: (_pattern, blocks) => {
        editEntityRecord("postType", postType, postId, {
          blocks,
          content: ({ blocks: blocksForSerialization = [] }) => (0, import_blocks.__unstableSerializeAndClean)(blocksForSerialization)
        });
        onChoosePattern();
      }
    }
  );
}
function StartPageOptionsModal({ onClose }) {
  const [showStartPatterns, setShowStartPatterns] = (0, import_element.useState)(true);
  const { set: setPreference } = (0, import_data.useDispatch)(import_preferences.store);
  const startPatterns = useStartPatterns();
  const hasStartPattern = startPatterns.length > 0;
  if (!hasStartPattern) {
    return null;
  }
  function handleClose() {
    onClose();
    setPreference("core", "enableChoosePatternModal", showStartPatterns);
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.Modal,
    {
      className: "editor-start-page-options__modal",
      title: (0, import_i18n.__)("Choose a pattern"),
      isFullScreen: true,
      onRequestClose: handleClose,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-start-page-options__modal-content", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          PatternSelection,
          {
            blockPatterns: startPatterns,
            onChoosePattern: handleClose
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Flex,
          {
            className: "editor-start-page-options__modal__actions",
            justify: "flex-start",
            expanded: false,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.CheckboxControl,
              {
                checked: showStartPatterns,
                label: (0, import_i18n.__)(
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
  const [isOpen, setIsOpen] = (0, import_element.useState)(false);
  const { isEditedPostDirty, isEditedPostEmpty } = (0, import_data.useSelect)(import_store.store);
  const { isModalActive } = (0, import_data.useSelect)(import_interface.store);
  const { enabled, postId } = (0, import_data.useSelect)((select) => {
    const { getCurrentPostId, getCurrentPostType } = select(import_store.store);
    const choosePatternModalEnabled = select(import_preferences.store).get(
      "core",
      "enableChoosePatternModal"
    );
    const currentPostType = getCurrentPostType();
    return {
      postId: getCurrentPostId(),
      enabled: choosePatternModalEnabled && import_constants.ATTACHMENT_POST_TYPE !== currentPostType && import_constants.TEMPLATE_POST_TYPE !== currentPostType && import_constants.TEMPLATE_PART_POST_TYPE !== currentPostType
    };
  }, []);
  (0, import_element.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartPageOptionsModal, { onClose: () => setIsOpen(false) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useStartPatterns
});
//# sourceMappingURL=index.cjs.map
