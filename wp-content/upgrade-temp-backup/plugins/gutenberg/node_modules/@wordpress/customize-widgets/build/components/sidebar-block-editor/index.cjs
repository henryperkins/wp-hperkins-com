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

// packages/customize-widgets/src/components/sidebar-block-editor/index.js
var sidebar_block_editor_exports = {};
__export(sidebar_block_editor_exports, {
  default: () => SidebarBlockEditor
});
module.exports = __toCommonJS(sidebar_block_editor_exports);
var import_compose = require("@wordpress/compose");
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_block_editor = require("@wordpress/block-editor");
var import_media_utils = require("@wordpress/media-utils");
var import_preferences = require("@wordpress/preferences");
var import_block_library = require("@wordpress/block-library");
var import_block_inspector_button = __toESM(require("../block-inspector-button/index.cjs"));
var import_header = __toESM(require("../header/index.cjs"));
var import_use_inserter = __toESM(require("../inserter/use-inserter.cjs"));
var import_sidebar_editor_provider = __toESM(require("./sidebar-editor-provider.cjs"));
var import_welcome_guide = __toESM(require("../welcome-guide/index.cjs"));
var import_keyboard_shortcuts = __toESM(require("../keyboard-shortcuts/index.cjs"));
var import_block_appender = __toESM(require("../block-appender/index.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { ExperimentalBlockCanvas: BlockCanvas } = (0, import_lock_unlock.unlock)(
  import_block_editor.privateApis
);
var { BlockKeyboardShortcuts } = (0, import_lock_unlock.unlock)(import_block_library.privateApis);
function SidebarBlockEditor({
  blockEditorSettings,
  sidebar,
  inserter,
  inspector
}) {
  const [isInserterOpened, setIsInserterOpened] = (0, import_use_inserter.default)(inserter);
  const isMediumViewport = (0, import_compose.useViewportMatch)("small");
  const {
    hasUploadPermissions,
    isFixedToolbarActive,
    keepCaretInsideBlock,
    isWelcomeGuideActive
  } = (0, import_data.useSelect)((select) => {
    const { get } = select(import_preferences.store);
    return {
      hasUploadPermissions: select(import_core_data.store).canUser("create", {
        kind: "postType",
        name: "attachment"
      }) ?? true,
      isFixedToolbarActive: !!get(
        "core/customize-widgets",
        "fixedToolbar"
      ),
      keepCaretInsideBlock: !!get(
        "core/customize-widgets",
        "keepCaretInsideBlock"
      ),
      isWelcomeGuideActive: !!get(
        "core/customize-widgets",
        "welcomeGuide"
      )
    };
  }, []);
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
      __experimentalSetIsInserterOpened: setIsInserterOpened,
      mediaUpload: mediaUploadBlockEditor,
      hasFixedToolbar: isFixedToolbarActive || !isMediumViewport,
      keepCaretInsideBlock,
      editorTool: "edit",
      __unstableHasCustomAppender: true
    };
  }, [
    hasUploadPermissions,
    blockEditorSettings,
    isFixedToolbarActive,
    isMediumViewport,
    keepCaretInsideBlock,
    setIsInserterOpened
  ]);
  if (isWelcomeGuideActive) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_welcome_guide.default, { sidebar });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_keyboard_shortcuts.default.Register, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockKeyboardShortcuts, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_sidebar_editor_provider.default, { sidebar, settings, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_keyboard_shortcuts.default,
        {
          undo: sidebar.undo,
          redo: sidebar.redo,
          save: sidebar.save
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_header.default,
        {
          sidebar,
          inserter,
          isInserterOpened,
          setIsInserterOpened,
          isFixedToolbarActive: isFixedToolbarActive || !isMediumViewport
        }
      ),
      (isFixedToolbarActive || !isMediumViewport) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockToolbar, { hideDragHandle: true }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        BlockCanvas,
        {
          shouldIframe: false,
          styles: settings.defaultEditorStyles,
          height: "100%",
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockList, { renderAppender: import_block_appender.default })
        }
      ),
      (0, import_element.createPortal)(
        // This is a temporary hack to prevent button component inside <BlockInspector>
        // from submitting form when type="button" is not specified.
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", { onSubmit: (event) => event.preventDefault(), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockInspector, {}) }),
        inspector.contentContainer[0]
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.__unstableBlockSettingsMenuFirstItem, { children: ({ onClose }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_inspector_button.default,
      {
        inspector,
        closeMenu: onClose
      }
    ) })
  ] });
}
//# sourceMappingURL=index.cjs.map
