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

// packages/editor/src/components/deprecated.js
var deprecated_exports = {};
__export(deprecated_exports, {
  AlignmentToolbar: () => AlignmentToolbar,
  Autocomplete: () => Autocomplete,
  BlockAlignmentToolbar: () => BlockAlignmentToolbar,
  BlockControls: () => BlockControls,
  BlockEdit: () => BlockEdit,
  BlockEditorKeyboardShortcuts: () => BlockEditorKeyboardShortcuts,
  BlockFormatControls: () => BlockFormatControls,
  BlockIcon: () => BlockIcon,
  BlockInspector: () => BlockInspector,
  BlockList: () => BlockList,
  BlockMover: () => BlockMover,
  BlockNavigationDropdown: () => BlockNavigationDropdown,
  BlockSelectionClearer: () => BlockSelectionClearer,
  BlockSettingsMenu: () => BlockSettingsMenu,
  BlockTitle: () => BlockTitle,
  BlockToolbar: () => BlockToolbar,
  ColorPalette: () => ColorPalette,
  ContrastChecker: () => ContrastChecker,
  CopyHandler: () => CopyHandler,
  DefaultBlockAppender: () => DefaultBlockAppender,
  FontSizePicker: () => FontSizePicker,
  InnerBlocks: () => InnerBlocks,
  Inserter: () => Inserter,
  InspectorAdvancedControls: () => InspectorAdvancedControls,
  InspectorControls: () => InspectorControls,
  MediaPlaceholder: () => MediaPlaceholder,
  MediaUpload: () => MediaUpload,
  MediaUploadCheck: () => MediaUploadCheck,
  MultiSelectScrollIntoView: () => MultiSelectScrollIntoView,
  NavigableToolbar: () => NavigableToolbar,
  ObserveTyping: () => ObserveTyping,
  PanelColorSettings: () => PanelColorSettings,
  PlainText: () => PlainText,
  RichText: () => RichText,
  RichTextShortcut: () => RichTextShortcut,
  RichTextToolbarButton: () => RichTextToolbarButton,
  ServerSideRender: () => import_server_side_render.default,
  SkipToSelectedBlock: () => SkipToSelectedBlock,
  URLInput: () => URLInput,
  URLInputButton: () => URLInputButton,
  URLPopover: () => URLPopover,
  Warning: () => Warning,
  WritingFlow: () => WritingFlow,
  __unstableRichTextInputEvent: () => __unstableRichTextInputEvent,
  createCustomColorsHOC: () => createCustomColorsHOC,
  getColorClassName: () => getColorClassName,
  getColorObjectByAttributeValues: () => getColorObjectByAttributeValues,
  getColorObjectByColorValue: () => getColorObjectByColorValue,
  getFontSize: () => getFontSize,
  getFontSizeClass: () => getFontSizeClass,
  withColorContext: () => withColorContext,
  withColors: () => withColors,
  withFontSizes: () => withFontSizes
});
module.exports = __toCommonJS(deprecated_exports);
var import_deprecated = __toESM(require("@wordpress/deprecated"));
var import_element = require("@wordpress/element");
var import_block_editor = require("@wordpress/block-editor");
var import_server_side_render = __toESM(require("@wordpress/server-side-render"));
var import_jsx_runtime = require("react/jsx-runtime");
function deprecateComponent(name, Wrapped, staticsToHoist = []) {
  const Component = (0, import_element.forwardRef)((props, ref) => {
    (0, import_deprecated.default)("wp.editor." + name, {
      since: "5.3",
      alternative: "wp.blockEditor." + name,
      version: "6.2"
    });
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrapped, { ref, ...props });
  });
  staticsToHoist.forEach((staticName) => {
    Component[staticName] = deprecateComponent(
      name + "." + staticName,
      Wrapped[staticName]
    );
  });
  return Component;
}
function deprecateFunction(name, func) {
  return (...args) => {
    (0, import_deprecated.default)("wp.editor." + name, {
      since: "5.3",
      alternative: "wp.blockEditor." + name,
      version: "6.2"
    });
    return func(...args);
  };
}
var RichText = deprecateComponent("RichText", import_block_editor.RichText, ["Content"]);
RichText.isEmpty = deprecateFunction(
  "RichText.isEmpty",
  import_block_editor.RichText.isEmpty
);
var Autocomplete = deprecateComponent(
  "Autocomplete",
  import_block_editor.Autocomplete
);
var AlignmentToolbar = deprecateComponent(
  "AlignmentToolbar",
  import_block_editor.AlignmentToolbar
);
var BlockAlignmentToolbar = deprecateComponent(
  "BlockAlignmentToolbar",
  import_block_editor.BlockAlignmentToolbar
);
var BlockControls = deprecateComponent(
  "BlockControls",
  import_block_editor.BlockControls,
  ["Slot"]
);
var BlockEdit = deprecateComponent("BlockEdit", import_block_editor.BlockEdit);
var BlockEditorKeyboardShortcuts = deprecateComponent(
  "BlockEditorKeyboardShortcuts",
  import_block_editor.BlockEditorKeyboardShortcuts
);
var BlockFormatControls = deprecateComponent(
  "BlockFormatControls",
  import_block_editor.BlockFormatControls,
  ["Slot"]
);
var BlockIcon = deprecateComponent("BlockIcon", import_block_editor.BlockIcon);
var BlockInspector = deprecateComponent(
  "BlockInspector",
  import_block_editor.BlockInspector
);
var BlockList = deprecateComponent("BlockList", import_block_editor.BlockList);
var BlockMover = deprecateComponent("BlockMover", import_block_editor.BlockMover);
var BlockNavigationDropdown = deprecateComponent(
  "BlockNavigationDropdown",
  import_block_editor.BlockNavigationDropdown
);
var BlockSelectionClearer = deprecateComponent(
  "BlockSelectionClearer",
  import_block_editor.BlockSelectionClearer
);
var BlockSettingsMenu = deprecateComponent(
  "BlockSettingsMenu",
  import_block_editor.BlockSettingsMenu
);
var BlockTitle = deprecateComponent("BlockTitle", import_block_editor.BlockTitle);
var BlockToolbar = deprecateComponent(
  "BlockToolbar",
  import_block_editor.BlockToolbar
);
var ColorPalette = deprecateComponent(
  "ColorPalette",
  import_block_editor.ColorPalette
);
var ContrastChecker = deprecateComponent(
  "ContrastChecker",
  import_block_editor.ContrastChecker
);
var CopyHandler = deprecateComponent("CopyHandler", import_block_editor.CopyHandler);
var DefaultBlockAppender = deprecateComponent(
  "DefaultBlockAppender",
  import_block_editor.DefaultBlockAppender
);
var FontSizePicker = deprecateComponent(
  "FontSizePicker",
  import_block_editor.FontSizePicker
);
var Inserter = deprecateComponent("Inserter", import_block_editor.Inserter);
var InnerBlocks = deprecateComponent("InnerBlocks", import_block_editor.InnerBlocks, [
  "ButtonBlockAppender",
  "DefaultBlockAppender",
  "Content"
]);
var InspectorAdvancedControls = deprecateComponent(
  "InspectorAdvancedControls",
  import_block_editor.InspectorAdvancedControls,
  ["Slot"]
);
var InspectorControls = deprecateComponent(
  "InspectorControls",
  import_block_editor.InspectorControls,
  ["Slot"]
);
var PanelColorSettings = deprecateComponent(
  "PanelColorSettings",
  import_block_editor.PanelColorSettings
);
var PlainText = deprecateComponent("PlainText", import_block_editor.PlainText);
var RichTextShortcut = deprecateComponent(
  "RichTextShortcut",
  import_block_editor.RichTextShortcut
);
var RichTextToolbarButton = deprecateComponent(
  "RichTextToolbarButton",
  import_block_editor.RichTextToolbarButton
);
var __unstableRichTextInputEvent = deprecateComponent(
  "__unstableRichTextInputEvent",
  import_block_editor.__unstableRichTextInputEvent
);
var MediaPlaceholder = deprecateComponent(
  "MediaPlaceholder",
  import_block_editor.MediaPlaceholder
);
var MediaUpload = deprecateComponent("MediaUpload", import_block_editor.MediaUpload);
var MediaUploadCheck = deprecateComponent(
  "MediaUploadCheck",
  import_block_editor.MediaUploadCheck
);
var MultiSelectScrollIntoView = deprecateComponent(
  "MultiSelectScrollIntoView",
  import_block_editor.MultiSelectScrollIntoView
);
var NavigableToolbar = deprecateComponent(
  "NavigableToolbar",
  import_block_editor.NavigableToolbar
);
var ObserveTyping = deprecateComponent(
  "ObserveTyping",
  import_block_editor.ObserveTyping
);
var SkipToSelectedBlock = deprecateComponent(
  "SkipToSelectedBlock",
  import_block_editor.SkipToSelectedBlock
);
var URLInput = deprecateComponent("URLInput", import_block_editor.URLInput);
var URLInputButton = deprecateComponent(
  "URLInputButton",
  import_block_editor.URLInputButton
);
var URLPopover = deprecateComponent("URLPopover", import_block_editor.URLPopover);
var Warning = deprecateComponent("Warning", import_block_editor.Warning);
var WritingFlow = deprecateComponent("WritingFlow", import_block_editor.WritingFlow);
var createCustomColorsHOC = deprecateFunction(
  "createCustomColorsHOC",
  import_block_editor.createCustomColorsHOC
);
var getColorClassName = deprecateFunction(
  "getColorClassName",
  import_block_editor.getColorClassName
);
var getColorObjectByAttributeValues = deprecateFunction(
  "getColorObjectByAttributeValues",
  import_block_editor.getColorObjectByAttributeValues
);
var getColorObjectByColorValue = deprecateFunction(
  "getColorObjectByColorValue",
  import_block_editor.getColorObjectByColorValue
);
var getFontSize = deprecateFunction("getFontSize", import_block_editor.getFontSize);
var getFontSizeClass = deprecateFunction(
  "getFontSizeClass",
  import_block_editor.getFontSizeClass
);
var withColorContext = deprecateFunction(
  "withColorContext",
  import_block_editor.withColorContext
);
var withColors = deprecateFunction("withColors", import_block_editor.withColors);
var withFontSizes = deprecateFunction(
  "withFontSizes",
  import_block_editor.withFontSizes
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AlignmentToolbar,
  Autocomplete,
  BlockAlignmentToolbar,
  BlockControls,
  BlockEdit,
  BlockEditorKeyboardShortcuts,
  BlockFormatControls,
  BlockIcon,
  BlockInspector,
  BlockList,
  BlockMover,
  BlockNavigationDropdown,
  BlockSelectionClearer,
  BlockSettingsMenu,
  BlockTitle,
  BlockToolbar,
  ColorPalette,
  ContrastChecker,
  CopyHandler,
  DefaultBlockAppender,
  FontSizePicker,
  InnerBlocks,
  Inserter,
  InspectorAdvancedControls,
  InspectorControls,
  MediaPlaceholder,
  MediaUpload,
  MediaUploadCheck,
  MultiSelectScrollIntoView,
  NavigableToolbar,
  ObserveTyping,
  PanelColorSettings,
  PlainText,
  RichText,
  RichTextShortcut,
  RichTextToolbarButton,
  ServerSideRender,
  SkipToSelectedBlock,
  URLInput,
  URLInputButton,
  URLPopover,
  Warning,
  WritingFlow,
  __unstableRichTextInputEvent,
  createCustomColorsHOC,
  getColorClassName,
  getColorObjectByAttributeValues,
  getColorObjectByColorValue,
  getFontSize,
  getFontSizeClass,
  withColorContext,
  withColors,
  withFontSizes
});
//# sourceMappingURL=deprecated.cjs.map
