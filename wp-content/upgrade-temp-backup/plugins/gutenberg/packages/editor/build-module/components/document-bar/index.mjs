// packages/editor/src/components/document-bar/index.js
import clsx from "clsx";
import { __, isRTL } from "@wordpress/i18n";
import { useSelect, useDispatch } from "@wordpress/data";
import {
  Button,
  __experimentalText as Text,
  __unstableMotion as motion,
  __unstableAnimatePresence as AnimatePresence
} from "@wordpress/components";
import { BlockIcon, store as blockEditorStore } from "@wordpress/block-editor";
import { chevronLeftSmall, chevronRightSmall, layout } from "@wordpress/icons";
import { displayShortcut } from "@wordpress/keycodes";
import { store as coreStore } from "@wordpress/core-data";
import { store as commandsStore } from "@wordpress/commands";
import { useRef, useEffect } from "@wordpress/element";
import { useReducedMotion } from "@wordpress/compose";
import { decodeEntities } from "@wordpress/html-entities";
import { __unstableStripHTML as stripHTML } from "@wordpress/dom";
import { TEMPLATE_POST_TYPES } from "../../store/constants.mjs";
import { store as editorStore } from "../../store/index.mjs";
import usePageTypeBadge from "../../utils/pageTypeBadge.mjs";
import { getTemplateInfo } from "../../utils/get-template-info.mjs";
import { getStylesCanvasTitle } from "../styles-canvas/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import useEditedSectionDetails from "./useEditedSectionDetails.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var MotionButton = motion.create(Button);
function DocumentBar(props) {
  const { stopEditingContentOnlySection } = unlock(
    useDispatch(blockEditorStore)
  );
  const unlockedPatternInfo = useEditedSectionDetails();
  const {
    postId,
    postType,
    postTypeLabel,
    documentTitle,
    isNotFound,
    templateTitle,
    onNavigateToPreviousEntityRecord,
    isTemplatePreview,
    stylesCanvasTitle
  } = useSelect((select) => {
    const {
      getCurrentPostType,
      getCurrentPostId,
      getEditorSettings,
      getRenderingMode
    } = select(editorStore);
    const {
      getEditedEntityRecord,
      getPostType,
      getCurrentTheme,
      isResolving: isResolvingSelector
    } = select(coreStore);
    const _postType = getCurrentPostType();
    const _postId = getCurrentPostId();
    const _document = getEditedEntityRecord(
      "postType",
      _postType,
      _postId
    );
    const { default_template_types: templateTypes = [] } = getCurrentTheme() ?? {};
    const _templateInfo = getTemplateInfo({
      templateTypes,
      template: _document
    });
    const _postTypeLabel = getPostType(_postType)?.labels?.singular_name;
    const { getStylesPath, getShowStylebook } = unlock(
      select(editorStore)
    );
    const _stylesPath = getStylesPath();
    const _showStylebook = getShowStylebook();
    const _stylesCanvasTitle = getStylesCanvasTitle(
      _stylesPath,
      _showStylebook
    );
    return {
      postId: _postId,
      postType: _postType,
      postTypeLabel: _postTypeLabel,
      documentTitle: _document.title,
      isNotFound: !_document && !isResolvingSelector(
        "getEditedEntityRecord",
        "postType",
        _postType,
        _postId
      ),
      templateTitle: _templateInfo.title,
      onNavigateToPreviousEntityRecord: getEditorSettings().onNavigateToPreviousEntityRecord,
      isTemplatePreview: getRenderingMode() === "template-locked",
      stylesCanvasTitle: _stylesCanvasTitle
    };
  }, []);
  const { open: openCommandCenter } = useDispatch(commandsStore);
  const isReducedMotion = useReducedMotion();
  const isTemplate = TEMPLATE_POST_TYPES.includes(postType);
  const hasBackButton = !!onNavigateToPreviousEntityRecord || !!unlockedPatternInfo;
  const entityTitle = isTemplate ? templateTitle : documentTitle;
  const title = unlockedPatternInfo?.patternTitle || props.title || stylesCanvasTitle || entityTitle;
  const icon = props.icon;
  const handleBackClick = (event) => {
    event.stopPropagation();
    if (unlockedPatternInfo) {
      stopEditingContentOnlySection();
    } else if (onNavigateToPreviousEntityRecord) {
      onNavigateToPreviousEntityRecord();
    }
  };
  const pageTypeBadge = usePageTypeBadge(postId);
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
  }, []);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx("editor-document-bar", {
        "has-back-button": hasBackButton
      }),
      children: [
        /* @__PURE__ */ jsx(AnimatePresence, { children: hasBackButton && /* @__PURE__ */ jsx(
          MotionButton,
          {
            className: "editor-document-bar__back",
            icon: isRTL() ? chevronRightSmall : chevronLeftSmall,
            onClick: handleBackClick,
            size: "compact",
            initial: mountedRef.current ? { opacity: 0, transform: "translateX(15%)" } : false,
            animate: { opacity: 1, transform: "translateX(0%)" },
            exit: { opacity: 0, transform: "translateX(15%)" },
            transition: isReducedMotion ? { duration: 0 } : void 0,
            children: __("Back")
          }
        ) }),
        !isTemplate && isTemplatePreview && !hasBackButton && /* @__PURE__ */ jsx(
          BlockIcon,
          {
            icon: layout,
            className: "editor-document-bar__icon-layout"
          }
        ),
        isNotFound ? /* @__PURE__ */ jsx(Text, { children: __("Document not found") }) : /* @__PURE__ */ jsxs(
          Button,
          {
            className: "editor-document-bar__command",
            onClick: () => openCommandCenter(),
            size: "compact",
            children: [
              /* @__PURE__ */ jsxs(
                motion.div,
                {
                  className: "editor-document-bar__title",
                  initial: mountedRef.current ? {
                    opacity: 0,
                    transform: hasBackButton ? "translateX(15%)" : "translateX(-15%)"
                  } : false,
                  animate: {
                    opacity: 1,
                    transform: "translateX(0%)"
                  },
                  transition: isReducedMotion ? { duration: 0 } : void 0,
                  children: [
                    icon && /* @__PURE__ */ jsx(BlockIcon, { icon }),
                    /* @__PURE__ */ jsxs(Text, { size: "body", as: "h1", children: [
                      /* @__PURE__ */ jsx("span", { className: "editor-document-bar__post-title", children: title ? stripHTML(title) : __("No title") }),
                      unlockedPatternInfo && /* @__PURE__ */ jsx("span", { className: "editor-document-bar__post-type-label", children: unlockedPatternInfo.type === "template-part" ? `\xB7 ${__("Template Part")}` : `\xB7 ${__("Pattern")}` }),
                      !unlockedPatternInfo && pageTypeBadge && /* @__PURE__ */ jsx("span", { className: "editor-document-bar__post-type-label", children: `\xB7 ${pageTypeBadge}` }),
                      !unlockedPatternInfo && postTypeLabel && !props.title && !pageTypeBadge && /* @__PURE__ */ jsx("span", { className: "editor-document-bar__post-type-label", children: `\xB7 ${decodeEntities(
                        postTypeLabel
                      )}` })
                    ] })
                  ]
                },
                hasBackButton
              ),
              /* @__PURE__ */ jsx("span", { className: "editor-document-bar__shortcut", children: displayShortcut.primary("k") })
            ]
          }
        )
      ]
    }
  );
}
export {
  DocumentBar as default
};
//# sourceMappingURL=index.mjs.map
