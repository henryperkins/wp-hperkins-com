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

// packages/edit-widgets/src/components/widget-areas-block-editor-provider/index.js
var widget_areas_block_editor_provider_exports = {};
__export(widget_areas_block_editor_provider_exports, {
  default: () => WidgetAreasBlockEditorProvider
});
module.exports = __toCommonJS(widget_areas_block_editor_provider_exports);
var import_components = require("@wordpress/components");
var import_compose = require("@wordpress/compose");
var import_media_utils = require("@wordpress/media-utils");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_element = require("@wordpress/element");
var import_block_editor = require("@wordpress/block-editor");
var import_patterns = require("@wordpress/patterns");
var import_preferences = require("@wordpress/preferences");
var import_block_library = require("@wordpress/block-library");
var import_keyboard_shortcuts = __toESM(require("../keyboard-shortcuts/index.cjs"));
var import_utils = require("../../store/utils.cjs");
var import_use_last_selected_widget_area = __toESM(require("../../hooks/use-last-selected-widget-area.cjs"));
var import_store = require("../../store/index.cjs");
var import_constants = require("../../constants.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { ExperimentalBlockEditorProvider } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
var { PatternsMenuItems } = (0, import_lock_unlock.unlock)(import_patterns.privateApis);
var { BlockKeyboardShortcuts } = (0, import_lock_unlock.unlock)(import_block_library.privateApis);
var EMPTY_ARRAY = [];
function WidgetAreasBlockEditorProvider({
  blockEditorSettings,
  children,
  ...props
}) {
  const isLargeViewport = (0, import_compose.useViewportMatch)("medium");
  const {
    hasUploadPermissions,
    reusableBlocks,
    isFixedToolbarActive,
    keepCaretInsideBlock,
    pageOnFront,
    pageForPosts
  } = (0, import_data.useSelect)((select) => {
    const { canUser, getEntityRecord, getEntityRecords } = select(import_core_data.store);
    const siteSettings = canUser("read", {
      kind: "root",
      name: "site"
    }) ? getEntityRecord("root", "site") : void 0;
    return {
      hasUploadPermissions: canUser("create", {
        kind: "postType",
        name: "attachment"
      }) ?? true,
      reusableBlocks: import_constants.ALLOW_REUSABLE_BLOCKS ? getEntityRecords("postType", "wp_block") : EMPTY_ARRAY,
      isFixedToolbarActive: !!select(import_preferences.store).get(
        "core/edit-widgets",
        "fixedToolbar"
      ),
      keepCaretInsideBlock: !!select(import_preferences.store).get(
        "core/edit-widgets",
        "keepCaretInsideBlock"
      ),
      pageOnFront: siteSettings?.page_on_front,
      pageForPosts: siteSettings?.page_for_posts
    };
  }, []);
  const { setIsInserterOpened } = (0, import_data.useDispatch)(import_store.store);
  const settings = (0, import_element.useMemo)(() => {
    let mediaUploadBlockEditor;
    if (hasUploadPermissions) {
      mediaUploadBlockEditor = ({ onError, ...argumentsObject }) => {
        (0, import_media_utils.uploadMedia)({
          wpAllowedMimeTypes: blockEditorSettings.allowedMimeTypes,
          onError: ({ message }) => onError(message),
          ...argumentsObject
        });
      };
    }
    return {
      ...blockEditorSettings,
      __experimentalReusableBlocks: reusableBlocks,
      hasFixedToolbar: isFixedToolbarActive || !isLargeViewport,
      keepCaretInsideBlock,
      mediaUpload: mediaUploadBlockEditor,
      templateLock: "all",
      __experimentalSetIsInserterOpened: setIsInserterOpened,
      pageOnFront,
      pageForPosts,
      editorTool: "edit"
    };
  }, [
    hasUploadPermissions,
    blockEditorSettings,
    isFixedToolbarActive,
    isLargeViewport,
    keepCaretInsideBlock,
    reusableBlocks,
    setIsInserterOpened,
    pageOnFront,
    pageForPosts
  ]);
  const widgetAreaId = (0, import_use_last_selected_widget_area.default)();
  const [blocks, onInput, onChange] = (0, import_core_data.useEntityBlockEditor)(
    import_utils.KIND,
    import_utils.POST_TYPE,
    { id: (0, import_utils.buildWidgetAreasPostId)() }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.SlotFillProvider, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_keyboard_shortcuts.default.Register, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockKeyboardShortcuts, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      ExperimentalBlockEditorProvider,
      {
        value: blocks,
        onInput,
        onChange,
        settings,
        useSubRegistry: false,
        ...props,
        children: [
          children,
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PatternsMenuItems, { rootClientId: widgetAreaId })
        ]
      }
    )
  ] });
}
//# sourceMappingURL=index.cjs.map
