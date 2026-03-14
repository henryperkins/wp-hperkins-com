"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/document-bar/index.js
var document_bar_exports = {};
__export(document_bar_exports, {
  default: () => DocumentBar
});
module.exports = __toCommonJS(document_bar_exports);
var import_clsx = __toESM(require("clsx"));
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_block_editor = require("@wordpress/block-editor");
var import_icons = require("@wordpress/icons");
var import_keycodes = require("@wordpress/keycodes");
var import_core_data = require("@wordpress/core-data");
var import_commands = require("@wordpress/commands");
var import_element = require("@wordpress/element");
var import_compose = require("@wordpress/compose");
var import_html_entities = require("@wordpress/html-entities");
var import_dom = require("@wordpress/dom");
var import_constants = require("../../store/constants.cjs");
var import_store = require("../../store/index.cjs");
var import_pageTypeBadge = __toESM(require("../../utils/pageTypeBadge.cjs"));
var import_get_template_info = require("../../utils/get-template-info.cjs");
var import_styles_canvas = require("../styles-canvas/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_useEditedSectionDetails = __toESM(require("./useEditedSectionDetails.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var MotionButton = import_components.__unstableMotion.create(import_components.Button);
function DocumentBar(props) {
  const { stopEditingContentOnlySection } = (0, import_lock_unlock.unlock)(
    (0, import_data.useDispatch)(import_block_editor.store)
  );
  const unlockedPatternInfo = (0, import_useEditedSectionDetails.default)();
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
  } = (0, import_data.useSelect)((select) => {
    const {
      getCurrentPostType,
      getCurrentPostId,
      getEditorSettings,
      getRenderingMode
    } = select(import_store.store);
    const {
      getEditedEntityRecord,
      getPostType,
      getCurrentTheme,
      isResolving: isResolvingSelector
    } = select(import_core_data.store);
    const _postType = getCurrentPostType();
    const _postId = getCurrentPostId();
    const _document = getEditedEntityRecord(
      "postType",
      _postType,
      _postId
    );
    const { default_template_types: templateTypes = [] } = getCurrentTheme() ?? {};
    const _templateInfo = (0, import_get_template_info.getTemplateInfo)({
      templateTypes,
      template: _document
    });
    const _postTypeLabel = getPostType(_postType)?.labels?.singular_name;
    const { getStylesPath, getShowStylebook } = (0, import_lock_unlock.unlock)(
      select(import_store.store)
    );
    const _stylesPath = getStylesPath();
    const _showStylebook = getShowStylebook();
    const _stylesCanvasTitle = (0, import_styles_canvas.getStylesCanvasTitle)(
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
  const { open: openCommandCenter } = (0, import_data.useDispatch)(import_commands.store);
  const isReducedMotion = (0, import_compose.useReducedMotion)();
  const isTemplate = import_constants.TEMPLATE_POST_TYPES.includes(postType);
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
  const pageTypeBadge = (0, import_pageTypeBadge.default)(postId);
  const mountedRef = (0, import_element.useRef)(false);
  (0, import_element.useEffect)(() => {
    mountedRef.current = true;
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: (0, import_clsx.default)("editor-document-bar", {
        "has-back-button": hasBackButton
      }),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__unstableAnimatePresence, { children: hasBackButton && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          MotionButton,
          {
            className: "editor-document-bar__back",
            icon: (0, import_i18n.isRTL)() ? import_icons.chevronRightSmall : import_icons.chevronLeftSmall,
            onClick: handleBackClick,
            size: "compact",
            initial: mountedRef.current ? { opacity: 0, transform: "translateX(15%)" } : false,
            animate: { opacity: 1, transform: "translateX(0%)" },
            exit: { opacity: 0, transform: "translateX(15%)" },
            transition: isReducedMotion ? { duration: 0 } : void 0,
            children: (0, import_i18n.__)("Back")
          }
        ) }),
        !isTemplate && isTemplatePreview && !hasBackButton && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_block_editor.BlockIcon,
          {
            icon: import_icons.layout,
            className: "editor-document-bar__icon-layout"
          }
        ),
        isNotFound ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { children: (0, import_i18n.__)("Document not found") }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          import_components.Button,
          {
            className: "editor-document-bar__command",
            onClick: () => openCommandCenter(),
            size: "compact",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                import_components.__unstableMotion.div,
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
                    icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockIcon, { icon }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalText, { size: "body", as: "h1", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "editor-document-bar__post-title", children: title ? (0, import_dom.__unstableStripHTML)(title) : (0, import_i18n.__)("No title") }),
                      unlockedPatternInfo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "editor-document-bar__post-type-label", children: unlockedPatternInfo.type === "template-part" ? `\xB7 ${(0, import_i18n.__)("Template Part")}` : `\xB7 ${(0, import_i18n.__)("Pattern")}` }),
                      !unlockedPatternInfo && pageTypeBadge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "editor-document-bar__post-type-label", children: `\xB7 ${pageTypeBadge}` }),
                      !unlockedPatternInfo && postTypeLabel && !props.title && !pageTypeBadge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "editor-document-bar__post-type-label", children: `\xB7 ${(0, import_html_entities.decodeEntities)(
                        postTypeLabel
                      )}` })
                    ] })
                  ]
                },
                hasBackButton
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "editor-document-bar__shortcut", children: import_keycodes.displayShortcut.primary("k") })
            ]
          }
        )
      ]
    }
  );
}
//# sourceMappingURL=index.cjs.map
