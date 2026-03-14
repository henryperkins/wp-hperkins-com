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

// packages/editor/src/components/provider/use-block-editor-settings.js
var use_block_editor_settings_exports = {};
__export(use_block_editor_settings_exports, {
  default: () => use_block_editor_settings_default
});
module.exports = __toCommonJS(use_block_editor_settings_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_i18n = require("@wordpress/i18n");
var import_preferences = require("@wordpress/preferences");
var import_compose = require("@wordpress/compose");
var import_blocks = require("@wordpress/blocks");
var import_block_editor = require("@wordpress/block-editor");
var import_media_categories = __toESM(require("../media-categories/index.cjs"));
var import_utils = require("../../utils/index.cjs");
var import_on_success = __toESM(require("../../utils/media-upload/on-success.cjs"));
var import_media_sideload = __toESM(require("../../utils/media-sideload/index.cjs"));
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_global_styles_provider = require("../global-styles-provider/index.cjs");
var EMPTY_OBJECT = {};
function __experimentalReusableBlocksSelect(select) {
  const { RECEIVE_INTERMEDIATE_RESULTS } = (0, import_lock_unlock.unlock)(import_core_data.privateApis);
  const { getEntityRecords } = select(import_core_data.store);
  return getEntityRecords("postType", "wp_block", {
    per_page: -1,
    [RECEIVE_INTERMEDIATE_RESULTS]: true
  });
}
var BLOCK_EDITOR_SETTINGS = [
  "__experimentalBlockBindingsSupportedAttributes",
  "__experimentalBlockDirectory",
  "__experimentalDiscussionSettings",
  "__experimentalFeatures",
  "__experimentalGlobalStylesBaseStyles",
  "allImageSizes",
  "alignWide",
  "blockInspectorTabs",
  "maxUploadFileSize",
  "allowedMimeTypes",
  "bodyPlaceholder",
  "canEditCSS",
  "canLockBlocks",
  "canUpdateBlockBindings",
  "capabilities",
  "clearBlockSelection",
  "codeEditingEnabled",
  "colors",
  "disableContentOnlyForUnsyncedPatterns",
  "disableCustomColors",
  "disableCustomFontSizes",
  "disableCustomSpacingSizes",
  "disableCustomGradients",
  "disableLayoutStyles",
  "enableCustomLineHeight",
  "enableCustomSpacing",
  "enableCustomUnits",
  "enableOpenverseMediaCategory",
  "fontSizes",
  "gradients",
  "generateAnchors",
  "onNavigateToEntityRecord",
  "imageDefaultSize",
  "imageDimensions",
  "imageEditing",
  "imageSizes",
  "isPreviewMode",
  "isRTL",
  "locale",
  "maxWidth",
  "postContentAttributes",
  "postsPerPage",
  "readOnly",
  "styles",
  "titlePlaceholder",
  "supportsLayout",
  "widgetTypesToHideFromLegacyWidgetBlock",
  "__unstableHasCustomAppender",
  "__unstableResolvedAssets",
  "__unstableIsBlockBasedTheme"
];
var {
  globalStylesDataKey,
  globalStylesLinksDataKey,
  selectBlockPatternsKey,
  reusableBlocksSelectKey,
  sectionRootClientIdKey,
  mediaEditKey,
  getMediaSelectKey,
  isIsolatedEditorKey,
  deviceTypeKey,
  isNavigationOverlayContextKey,
  mediaUploadOnSuccessKey
} = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
function useBlockEditorSettings(settings, postType, postId, renderingMode) {
  const isLargeViewport = (0, import_compose.useViewportMatch)("medium");
  const {
    allImageSizes,
    bigImageSizeThreshold,
    allowRightClickOverrides,
    blockTypes,
    focusMode,
    hasFixedToolbar,
    isDistractionFree,
    keepCaretInsideBlock,
    hasUploadPermissions,
    hiddenBlockTypes,
    canUseUnfilteredHTML,
    userCanCreatePages,
    pageOnFront,
    pageForPosts,
    userPatternCategories,
    restBlockPatternCategories,
    sectionRootClientId,
    deviceType,
    isNavigationOverlayContext
  } = (0, import_data.useSelect)(
    (select) => {
      const {
        canUser,
        getRawEntityRecord,
        getEntityRecord,
        getUserPatternCategories,
        getBlockPatternCategories
      } = select(import_core_data.store);
      const { get } = select(import_preferences.store);
      const { getBlockTypes } = select(import_blocks.store);
      const { getDeviceType } = (0, import_lock_unlock.unlock)(select(import_store.store));
      const { getBlocksByName, getBlockAttributes } = select(import_block_editor.store);
      const siteSettings = canUser("read", {
        kind: "root",
        name: "site"
      }) ? getEntityRecord("root", "site") : void 0;
      const baseData = getEntityRecord("root", "__unstableBase");
      function getSectionRootBlock() {
        if (renderingMode === "template-locked") {
          return getBlocksByName("core/post-content")?.[0] ?? "";
        }
        return getBlocksByName("core/group").find(
          (clientId) => getBlockAttributes(clientId)?.tagName === "main"
        ) ?? "";
      }
      return {
        allImageSizes: baseData?.image_sizes,
        bigImageSizeThreshold: baseData?.image_size_threshold,
        allowRightClickOverrides: get(
          "core",
          "allowRightClickOverrides"
        ),
        blockTypes: getBlockTypes(),
        canUseUnfilteredHTML: getRawEntityRecord(
          "postType",
          postType,
          postId
        )?._links?.hasOwnProperty("wp:action-unfiltered-html"),
        focusMode: get("core", "focusMode"),
        hasFixedToolbar: get("core", "fixedToolbar") || !isLargeViewport,
        hiddenBlockTypes: get("core", "hiddenBlockTypes"),
        isDistractionFree: get("core", "distractionFree"),
        keepCaretInsideBlock: get("core", "keepCaretInsideBlock"),
        hasUploadPermissions: canUser("create", {
          kind: "postType",
          name: "attachment"
        }) ?? true,
        userCanCreatePages: canUser("create", {
          kind: "postType",
          name: "page"
        }),
        pageOnFront: siteSettings?.page_on_front,
        pageForPosts: siteSettings?.page_for_posts,
        userPatternCategories: getUserPatternCategories(),
        restBlockPatternCategories: getBlockPatternCategories(),
        sectionRootClientId: getSectionRootBlock(),
        deviceType: getDeviceType(),
        isNavigationOverlayContext: postType === "wp_template_part" && postId ? getEntityRecord(
          "postType",
          "wp_template_part",
          postId
        )?.area === "navigation-overlay" : false
      };
    },
    [postType, postId, isLargeViewport, renderingMode]
  );
  const { merged: mergedGlobalStyles } = (0, import_global_styles_provider.useGlobalStylesContext)();
  const globalStylesData = mergedGlobalStyles.styles ?? EMPTY_OBJECT;
  const globalStylesLinksData = mergedGlobalStyles._links ?? EMPTY_OBJECT;
  const settingsBlockPatterns = settings.__experimentalAdditionalBlockPatterns ?? // WP 6.0
  settings.__experimentalBlockPatterns;
  const settingsBlockPatternCategories = settings.__experimentalAdditionalBlockPatternCategories ?? // WP 6.0
  settings.__experimentalBlockPatternCategories;
  const blockPatterns = (0, import_element.useMemo)(
    () => [...settingsBlockPatterns || []].filter(
      ({ postTypes }) => {
        return !postTypes || Array.isArray(postTypes) && postTypes.includes(postType);
      }
    ),
    [settingsBlockPatterns, postType]
  );
  const blockPatternCategories = (0, import_element.useMemo)(
    () => [
      ...settingsBlockPatternCategories || [],
      ...restBlockPatternCategories || []
    ].filter(
      (x, index, arr) => index === arr.findIndex((y) => x.name === y.name)
    ),
    [settingsBlockPatternCategories, restBlockPatternCategories]
  );
  const { undo, setIsInserterOpened } = (0, import_data.useDispatch)(import_store.store);
  const { editMediaEntity } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_core_data.store));
  const { saveEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
  const createPageEntity = (0, import_element.useCallback)(
    (options) => {
      if (!userCanCreatePages) {
        return Promise.reject({
          message: (0, import_i18n.__)(
            "You do not have permission to create Pages."
          )
        });
      }
      return saveEntityRecord("postType", "page", options);
    },
    [saveEntityRecord, userCanCreatePages]
  );
  const allowedBlockTypes = (0, import_element.useMemo)(() => {
    if (hiddenBlockTypes && hiddenBlockTypes.length > 0) {
      const defaultAllowedBlockTypes = true === settings.allowedBlockTypes ? blockTypes.map(({ name }) => name) : settings.allowedBlockTypes || [];
      return defaultAllowedBlockTypes.filter(
        (type) => !hiddenBlockTypes.includes(type)
      );
    }
    return settings.allowedBlockTypes;
  }, [settings.allowedBlockTypes, hiddenBlockTypes, blockTypes]);
  const forceDisableFocusMode = settings.focusMode === false;
  return (0, import_element.useMemo)(() => {
    const blockEditorSettings = {
      ...Object.fromEntries(
        Object.entries(settings).filter(
          ([key]) => BLOCK_EDITOR_SETTINGS.includes(key)
        ).filter(([key]) => key !== "onNavigateToEntityRecord")
      ),
      [globalStylesDataKey]: globalStylesData,
      [globalStylesLinksDataKey]: globalStylesLinksData,
      allImageSizes,
      bigImageSizeThreshold,
      allowedBlockTypes,
      allowRightClickOverrides,
      focusMode: focusMode && !forceDisableFocusMode,
      hasFixedToolbar,
      isDistractionFree,
      keepCaretInsideBlock,
      onNavigateToEntityRecord: settings.onNavigateToEntityRecord,
      [getMediaSelectKey]: (select, attachmentId) => {
        return select(import_core_data.store).getEntityRecord(
          "postType",
          "attachment",
          attachmentId
        );
      },
      [mediaEditKey]: hasUploadPermissions ? editMediaEntity : void 0,
      mediaUpload: hasUploadPermissions ? import_utils.mediaUpload : void 0,
      [mediaUploadOnSuccessKey]: hasUploadPermissions ? import_on_success.default : void 0,
      mediaSideload: hasUploadPermissions ? import_media_sideload.default : void 0,
      __experimentalBlockPatterns: blockPatterns,
      [selectBlockPatternsKey]: (select) => {
        const { hasFinishedResolution, getBlockPatternsForPostType } = (0, import_lock_unlock.unlock)(select(import_core_data.store));
        const patterns = getBlockPatternsForPostType(postType);
        return hasFinishedResolution("getBlockPatterns") ? patterns : void 0;
      },
      [reusableBlocksSelectKey]: __experimentalReusableBlocksSelect,
      __experimentalBlockPatternCategories: blockPatternCategories,
      __experimentalUserPatternCategories: userPatternCategories,
      __experimentalFetchLinkSuggestions: (search, searchOptions) => (0, import_core_data.__experimentalFetchLinkSuggestions)(search, searchOptions, settings),
      inserterMediaCategories: import_media_categories.default,
      __experimentalFetchRichUrlData: import_core_data.__experimentalFetchUrlData,
      // Todo: This only checks the top level post, not the post within a template or any other entity that can be edited.
      // This might be better as a generic "canUser" selector.
      __experimentalCanUserUseUnfilteredHTML: canUseUnfilteredHTML,
      //Todo: this is only needed for native and should probably be removed.
      __experimentalUndo: undo,
      // Check whether we want all site editor frames to have outlines
      // including the navigation / pattern / parts editors.
      outlineMode: !isDistractionFree && postType === "wp_template",
      // Check these two properties: they were not present in the site editor.
      __experimentalCreatePageEntity: createPageEntity,
      __experimentalUserCanCreatePages: userCanCreatePages,
      pageOnFront,
      pageForPosts,
      __experimentalPreferPatternsOnRoot: postType === "wp_template",
      templateLock: postType === "wp_navigation" ? "insert" : settings.templateLock,
      template: postType === "wp_navigation" ? [["core/navigation", {}, []]] : settings.template,
      __experimentalSetIsInserterOpened: setIsInserterOpened,
      [sectionRootClientIdKey]: sectionRootClientId,
      editorTool: renderingMode === "post-only" && postType !== "wp_template" ? "edit" : void 0,
      // When editing template parts, patterns, or navigation directly,
      // we're in an isolated editing context (focused on that entity alone).
      [isIsolatedEditorKey]: [
        "wp_template_part",
        "wp_block",
        "wp_navigation"
      ].includes(postType),
      ...deviceType ? { [deviceTypeKey]: deviceType } : {},
      [isNavigationOverlayContextKey]: isNavigationOverlayContext
    };
    return blockEditorSettings;
  }, [
    allowedBlockTypes,
    allowRightClickOverrides,
    focusMode,
    forceDisableFocusMode,
    hasFixedToolbar,
    isDistractionFree,
    keepCaretInsideBlock,
    settings,
    hasUploadPermissions,
    userPatternCategories,
    blockPatterns,
    blockPatternCategories,
    canUseUnfilteredHTML,
    undo,
    createPageEntity,
    userCanCreatePages,
    pageOnFront,
    pageForPosts,
    postType,
    setIsInserterOpened,
    sectionRootClientId,
    globalStylesData,
    globalStylesLinksData,
    renderingMode,
    editMediaEntity,
    settings.onNavigateToEntityRecord,
    deviceType,
    allImageSizes,
    bigImageSizeThreshold,
    isNavigationOverlayContext
  ]);
}
var use_block_editor_settings_default = useBlockEditorSettings;
//# sourceMappingURL=use-block-editor-settings.cjs.map
