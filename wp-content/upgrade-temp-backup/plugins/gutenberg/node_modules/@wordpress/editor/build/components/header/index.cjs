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

// packages/editor/src/components/header/index.js
var header_exports = {};
__export(header_exports, {
  default: () => header_default
});
module.exports = __toCommonJS(header_exports);
var import_block_editor = require("@wordpress/block-editor");
var import_data = require("@wordpress/data");
var import_compose = require("@wordpress/compose");
var import_preferences = require("@wordpress/preferences");
var import_element = require("@wordpress/element");
var import_interface = require("@wordpress/interface");
var import_collapsible_block_toolbar = __toESM(require("../collapsible-block-toolbar/index.cjs"));
var import_document_bar = __toESM(require("../document-bar/index.cjs"));
var import_document_tools = __toESM(require("../document-tools/index.cjs"));
var import_header_skeleton = __toESM(require("./header-skeleton.cjs"));
var import_more_menu = __toESM(require("../more-menu/index.cjs"));
var import_post_preview_button = __toESM(require("../post-preview-button/index.cjs"));
var import_post_publish_button_or_toggle = __toESM(require("../post-publish-button/post-publish-button-or-toggle.cjs"));
var import_post_saved_state = __toESM(require("../post-saved-state/index.cjs"));
var import_post_view_link = __toESM(require("../post-view-link/index.cjs"));
var import_preview_dropdown = __toESM(require("../preview-dropdown/index.cjs"));
var import_zoom_out_toggle = __toESM(require("../zoom-out-toggle/index.cjs"));
var import_store = require("../../store/index.cjs");
var import_constants = require("../../store/constants.cjs");
var import_collaborators_presence = require("../collaborators-presence/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function Header({
  customSaveButton,
  forceIsDirty,
  setEntitiesSavedStatesCallback
}) {
  const isWideViewport = (0, import_compose.useViewportMatch)("large");
  const isLargeViewport = (0, import_compose.useViewportMatch)("medium");
  const isTooNarrowForDocumentBar = (0, import_compose.useMediaQuery)("(max-width: 403px)");
  const {
    postId,
    postType,
    isTextEditor,
    isPublishSidebarOpened,
    showIconLabels,
    hasFixedToolbar,
    hasBlockSelection,
    hasSectionRootClientId,
    isStylesCanvasActive,
    isAttachment
  } = (0, import_data.useSelect)((select) => {
    const { get: getPreference } = select(import_preferences.store);
    const {
      getEditorMode,
      getCurrentPostType,
      getCurrentPostId,
      isPublishSidebarOpened: _isPublishSidebarOpened
    } = select(import_store.store);
    const { getStylesPath, getShowStylebook } = (0, import_lock_unlock.unlock)(
      select(import_store.store)
    );
    const { getBlockSelectionStart, getSectionRootClientId } = (0, import_lock_unlock.unlock)(
      select(import_block_editor.store)
    );
    return {
      postId: getCurrentPostId(),
      postType: getCurrentPostType(),
      isTextEditor: getEditorMode() === "text",
      isPublishSidebarOpened: _isPublishSidebarOpened(),
      showIconLabels: getPreference("core", "showIconLabels"),
      hasFixedToolbar: getPreference("core", "fixedToolbar"),
      hasBlockSelection: !!getBlockSelectionStart(),
      hasSectionRootClientId: !!getSectionRootClientId(),
      isStylesCanvasActive: !!getStylesPath()?.startsWith("/revisions") || getShowStylebook(),
      isAttachment: getCurrentPostType() === import_constants.ATTACHMENT_POST_TYPE && window?.__experimentalMediaEditor
    };
  }, []);
  const canBeZoomedOut = ["post", "page", "wp_template"].includes(postType) && hasSectionRootClientId;
  const disablePreviewOption = [
    import_constants.ATTACHMENT_POST_TYPE,
    import_constants.NAVIGATION_POST_TYPE,
    import_constants.TEMPLATE_PART_POST_TYPE,
    import_constants.PATTERN_POST_TYPE
  ].includes(postType) || isStylesCanvasActive;
  const [isBlockToolsCollapsed, setIsBlockToolsCollapsed] = (0, import_element.useState)(true);
  const hasCenter = !isTooNarrowForDocumentBar && (!hasFixedToolbar || hasFixedToolbar && (!hasBlockSelection || isBlockToolsCollapsed));
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_header_skeleton.default,
    {
      toolbar: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        !isAttachment && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_document_tools.default,
          {
            disableBlockTools: isStylesCanvasActive || isTextEditor
          }
        ),
        hasFixedToolbar && isLargeViewport && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_collapsible_block_toolbar.default,
          {
            isCollapsed: isBlockToolsCollapsed,
            onToggle: setIsBlockToolsCollapsed
          }
        )
      ] }),
      center: hasCenter ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_collaborators_presence.CollaboratorsPresence,
          {
            postType,
            postId
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_document_bar.default, {})
      ] }) : void 0,
      settings: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        !customSaveButton && !isPublishSidebarOpened && /*
         * This button isn't completely hidden by the publish sidebar.
         * We can't hide the whole toolbar when the publish sidebar is open because
         * we want to prevent mounting/unmounting the PostPublishButtonOrToggle DOM node.
         * We track that DOM node to return focus to the PostPublishButtonOrToggle
         * when the publish sidebar has been closed.
         */
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_saved_state.default, { forceIsDirty }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_view_link.default, {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_preview_dropdown.default,
          {
            forceIsAutosaveable: forceIsDirty,
            disabled: disablePreviewOption
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_post_preview_button.default,
          {
            className: "editor-header__post-preview-button",
            forceIsAutosaveable: forceIsDirty
          }
        ),
        isWideViewport && canBeZoomedOut && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_zoom_out_toggle.default, { disabled: isStylesCanvasActive }),
        (isWideViewport || !showIconLabels) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_interface.PinnedItems.Slot, { scope: "core" }),
        !customSaveButton && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_post_publish_button_or_toggle.default,
          {
            forceIsDirty,
            setEntitiesSavedStatesCallback
          }
        ),
        customSaveButton,
        !isAttachment && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_more_menu.default, {})
      ] })
    }
  );
}
var header_default = Header;
//# sourceMappingURL=index.cjs.map
