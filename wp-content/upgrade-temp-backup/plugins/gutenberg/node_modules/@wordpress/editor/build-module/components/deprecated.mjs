// packages/editor/src/components/deprecated.js
import deprecated from "@wordpress/deprecated";
import { forwardRef } from "@wordpress/element";
import {
  Autocomplete as RootAutocomplete,
  AlignmentToolbar as RootAlignmentToolbar,
  BlockAlignmentToolbar as RootBlockAlignmentToolbar,
  BlockControls as RootBlockControls,
  BlockEdit as RootBlockEdit,
  BlockEditorKeyboardShortcuts as RootBlockEditorKeyboardShortcuts,
  BlockFormatControls as RootBlockFormatControls,
  BlockIcon as RootBlockIcon,
  BlockInspector as RootBlockInspector,
  BlockList as RootBlockList,
  BlockMover as RootBlockMover,
  BlockNavigationDropdown as RootBlockNavigationDropdown,
  BlockSelectionClearer as RootBlockSelectionClearer,
  BlockSettingsMenu as RootBlockSettingsMenu,
  BlockTitle as RootBlockTitle,
  BlockToolbar as RootBlockToolbar,
  ColorPalette as RootColorPalette,
  ContrastChecker as RootContrastChecker,
  CopyHandler as RootCopyHandler,
  createCustomColorsHOC as rootCreateCustomColorsHOC,
  DefaultBlockAppender as RootDefaultBlockAppender,
  FontSizePicker as RootFontSizePicker,
  getColorClassName as rootGetColorClassName,
  getColorObjectByAttributeValues as rootGetColorObjectByAttributeValues,
  getColorObjectByColorValue as rootGetColorObjectByColorValue,
  getFontSize as rootGetFontSize,
  getFontSizeClass as rootGetFontSizeClass,
  Inserter as RootInserter,
  InnerBlocks as RootInnerBlocks,
  InspectorAdvancedControls as RootInspectorAdvancedControls,
  InspectorControls as RootInspectorControls,
  PanelColorSettings as RootPanelColorSettings,
  PlainText as RootPlainText,
  RichText as RootRichText,
  RichTextShortcut as RootRichTextShortcut,
  RichTextToolbarButton as RootRichTextToolbarButton,
  __unstableRichTextInputEvent as __unstableRootRichTextInputEvent,
  MediaPlaceholder as RootMediaPlaceholder,
  MediaUpload as RootMediaUpload,
  MediaUploadCheck as RootMediaUploadCheck,
  MultiSelectScrollIntoView as RootMultiSelectScrollIntoView,
  NavigableToolbar as RootNavigableToolbar,
  ObserveTyping as RootObserveTyping,
  SkipToSelectedBlock as RootSkipToSelectedBlock,
  URLInput as RootURLInput,
  URLInputButton as RootURLInputButton,
  URLPopover as RootURLPopover,
  Warning as RootWarning,
  WritingFlow as RootWritingFlow,
  withColorContext as rootWithColorContext,
  withColors as rootWithColors,
  withFontSizes as rootWithFontSizes
} from "@wordpress/block-editor";
import { default as default2 } from "@wordpress/server-side-render";
import { jsx } from "react/jsx-runtime";
function deprecateComponent(name, Wrapped, staticsToHoist = []) {
  const Component = forwardRef((props, ref) => {
    deprecated("wp.editor." + name, {
      since: "5.3",
      alternative: "wp.blockEditor." + name,
      version: "6.2"
    });
    return /* @__PURE__ */ jsx(Wrapped, { ref, ...props });
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
    deprecated("wp.editor." + name, {
      since: "5.3",
      alternative: "wp.blockEditor." + name,
      version: "6.2"
    });
    return func(...args);
  };
}
var RichText = deprecateComponent("RichText", RootRichText, ["Content"]);
RichText.isEmpty = deprecateFunction(
  "RichText.isEmpty",
  RootRichText.isEmpty
);
var Autocomplete = deprecateComponent(
  "Autocomplete",
  RootAutocomplete
);
var AlignmentToolbar = deprecateComponent(
  "AlignmentToolbar",
  RootAlignmentToolbar
);
var BlockAlignmentToolbar = deprecateComponent(
  "BlockAlignmentToolbar",
  RootBlockAlignmentToolbar
);
var BlockControls = deprecateComponent(
  "BlockControls",
  RootBlockControls,
  ["Slot"]
);
var BlockEdit = deprecateComponent("BlockEdit", RootBlockEdit);
var BlockEditorKeyboardShortcuts = deprecateComponent(
  "BlockEditorKeyboardShortcuts",
  RootBlockEditorKeyboardShortcuts
);
var BlockFormatControls = deprecateComponent(
  "BlockFormatControls",
  RootBlockFormatControls,
  ["Slot"]
);
var BlockIcon = deprecateComponent("BlockIcon", RootBlockIcon);
var BlockInspector = deprecateComponent(
  "BlockInspector",
  RootBlockInspector
);
var BlockList = deprecateComponent("BlockList", RootBlockList);
var BlockMover = deprecateComponent("BlockMover", RootBlockMover);
var BlockNavigationDropdown = deprecateComponent(
  "BlockNavigationDropdown",
  RootBlockNavigationDropdown
);
var BlockSelectionClearer = deprecateComponent(
  "BlockSelectionClearer",
  RootBlockSelectionClearer
);
var BlockSettingsMenu = deprecateComponent(
  "BlockSettingsMenu",
  RootBlockSettingsMenu
);
var BlockTitle = deprecateComponent("BlockTitle", RootBlockTitle);
var BlockToolbar = deprecateComponent(
  "BlockToolbar",
  RootBlockToolbar
);
var ColorPalette = deprecateComponent(
  "ColorPalette",
  RootColorPalette
);
var ContrastChecker = deprecateComponent(
  "ContrastChecker",
  RootContrastChecker
);
var CopyHandler = deprecateComponent("CopyHandler", RootCopyHandler);
var DefaultBlockAppender = deprecateComponent(
  "DefaultBlockAppender",
  RootDefaultBlockAppender
);
var FontSizePicker = deprecateComponent(
  "FontSizePicker",
  RootFontSizePicker
);
var Inserter = deprecateComponent("Inserter", RootInserter);
var InnerBlocks = deprecateComponent("InnerBlocks", RootInnerBlocks, [
  "ButtonBlockAppender",
  "DefaultBlockAppender",
  "Content"
]);
var InspectorAdvancedControls = deprecateComponent(
  "InspectorAdvancedControls",
  RootInspectorAdvancedControls,
  ["Slot"]
);
var InspectorControls = deprecateComponent(
  "InspectorControls",
  RootInspectorControls,
  ["Slot"]
);
var PanelColorSettings = deprecateComponent(
  "PanelColorSettings",
  RootPanelColorSettings
);
var PlainText = deprecateComponent("PlainText", RootPlainText);
var RichTextShortcut = deprecateComponent(
  "RichTextShortcut",
  RootRichTextShortcut
);
var RichTextToolbarButton = deprecateComponent(
  "RichTextToolbarButton",
  RootRichTextToolbarButton
);
var __unstableRichTextInputEvent = deprecateComponent(
  "__unstableRichTextInputEvent",
  __unstableRootRichTextInputEvent
);
var MediaPlaceholder = deprecateComponent(
  "MediaPlaceholder",
  RootMediaPlaceholder
);
var MediaUpload = deprecateComponent("MediaUpload", RootMediaUpload);
var MediaUploadCheck = deprecateComponent(
  "MediaUploadCheck",
  RootMediaUploadCheck
);
var MultiSelectScrollIntoView = deprecateComponent(
  "MultiSelectScrollIntoView",
  RootMultiSelectScrollIntoView
);
var NavigableToolbar = deprecateComponent(
  "NavigableToolbar",
  RootNavigableToolbar
);
var ObserveTyping = deprecateComponent(
  "ObserveTyping",
  RootObserveTyping
);
var SkipToSelectedBlock = deprecateComponent(
  "SkipToSelectedBlock",
  RootSkipToSelectedBlock
);
var URLInput = deprecateComponent("URLInput", RootURLInput);
var URLInputButton = deprecateComponent(
  "URLInputButton",
  RootURLInputButton
);
var URLPopover = deprecateComponent("URLPopover", RootURLPopover);
var Warning = deprecateComponent("Warning", RootWarning);
var WritingFlow = deprecateComponent("WritingFlow", RootWritingFlow);
var createCustomColorsHOC = deprecateFunction(
  "createCustomColorsHOC",
  rootCreateCustomColorsHOC
);
var getColorClassName = deprecateFunction(
  "getColorClassName",
  rootGetColorClassName
);
var getColorObjectByAttributeValues = deprecateFunction(
  "getColorObjectByAttributeValues",
  rootGetColorObjectByAttributeValues
);
var getColorObjectByColorValue = deprecateFunction(
  "getColorObjectByColorValue",
  rootGetColorObjectByColorValue
);
var getFontSize = deprecateFunction("getFontSize", rootGetFontSize);
var getFontSizeClass = deprecateFunction(
  "getFontSizeClass",
  rootGetFontSizeClass
);
var withColorContext = deprecateFunction(
  "withColorContext",
  rootWithColorContext
);
var withColors = deprecateFunction("withColors", rootWithColors);
var withFontSizes = deprecateFunction(
  "withFontSizes",
  rootWithFontSizes
);
export {
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
  default2 as ServerSideRender,
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
};
//# sourceMappingURL=deprecated.mjs.map
