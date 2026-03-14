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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-editor/src/components/index.js
var components_exports = {};
__export(components_exports, {
  AlignmentControl: () => import_alignment_control.AlignmentControl,
  AlignmentToolbar: () => import_alignment_control.AlignmentToolbar,
  Autocomplete: () => import_autocomplete.default,
  BlockAlignmentControl: () => import_block_alignment_control.BlockAlignmentControl,
  BlockAlignmentToolbar: () => import_block_alignment_control.BlockAlignmentToolbar,
  BlockBindingsAttributeControl: () => import_block_bindings.BlockBindingsAttributeControl,
  BlockBindingsSourceFieldsList: () => import_block_bindings.BlockBindingsSourceFieldsList,
  BlockBreadcrumb: () => import_block_breadcrumb.default,
  BlockCanvas: () => import_block_canvas.default,
  BlockColorsStyleSelector: () => import_color_style_selector.default,
  BlockContextProvider: () => import_block_context.BlockContextProvider,
  BlockControls: () => import_block_controls.default,
  BlockEdit: () => import_block_edit.default,
  BlockEditorKeyboardShortcuts: () => import_keyboard_shortcuts.default,
  BlockEditorProvider: () => import_provider.default,
  BlockFormatControls: () => import_block_controls.BlockFormatControls,
  BlockIcon: () => import_block_icon.default,
  BlockInspector: () => import_block_inspector.default,
  BlockList: () => import_block_list.default,
  BlockMover: () => import_block_mover.default,
  BlockNavigationDropdown: () => import_dropdown.default,
  BlockPopover: () => import_block_popover.default,
  BlockPreview: () => import_block_preview.default,
  BlockSelectionClearer: () => import_block_selection_clearer.default,
  BlockSettingsMenu: () => import_block_settings_menu.default,
  BlockSettingsMenuControls: () => import_block_settings_menu_controls.default,
  BlockStyles: () => import_block_styles.default,
  BlockTitle: () => import_block_title.default,
  BlockToolbar: () => import_block_toolbar.default,
  BlockTools: () => import_block_tools.default,
  BlockVerticalAlignmentControl: () => import_block_vertical_alignment_control.BlockVerticalAlignmentControl,
  BlockVerticalAlignmentToolbar: () => import_block_vertical_alignment_control.BlockVerticalAlignmentToolbar,
  ButtonBlockAppender: () => import_button_block_appender.default,
  ButtonBlockerAppender: () => import_button_block_appender.ButtonBlockerAppender,
  ColorPalette: () => import_color_palette.default,
  ColorPaletteControl: () => import_control.default,
  ContrastChecker: () => import_contrast_checker.default,
  CopyHandler: () => import_copy_handler.default,
  DefaultBlockAppender: () => import_default_block_appender.default,
  DimensionControl: () => import_dimension_control.default,
  HeadingLevelDropdown: () => import_block_heading_level_dropdown.default,
  HeightControl: () => import_height_control.default,
  InnerBlocks: () => import_inner_blocks.default,
  Inserter: () => import_inserter.default,
  InspectorAdvancedControls: () => import_inspector_controls.InspectorAdvancedControls,
  InspectorControls: () => import_inspector_controls.default,
  JustifyContentControl: () => import_justify_content_control.JustifyContentControl,
  JustifyToolbar: () => import_justify_content_control.JustifyToolbar,
  LineHeightControl: () => import_line_height_control.default,
  LinkControl: () => import_link_control.default,
  MediaPlaceholder: () => import_media_placeholder.default,
  MediaReplaceFlow: () => import_media_replace_flow.default,
  MediaUpload: () => import_media_upload.default,
  MediaUploadCheck: () => import_check.default,
  MultiSelectScrollIntoView: () => import_selection_scroll_into_view.MultiSelectScrollIntoView,
  NavigableToolbar: () => import_navigable_toolbar.default,
  ObserveTyping: () => import_observe_typing.default,
  PanelColorSettings: () => import_panel_color_settings.default,
  PlainText: () => import_plain_text.default,
  RecursionProvider: () => import_recursion_provider.RecursionProvider,
  RichText: () => import_rich_text.default,
  RichTextShortcut: () => import_rich_text.RichTextShortcut,
  RichTextToolbarButton: () => import_rich_text.RichTextToolbarButton,
  SkipToSelectedBlock: () => import_skip_to_selected_block.default,
  ToolSelector: () => import_tool_selector.default,
  Typewriter: () => import_typewriter.default,
  URLInput: () => import_url_input.default,
  URLInputButton: () => import_button.default,
  URLPopover: () => import_url_popover.default,
  Warning: () => import_warning.default,
  WritingFlow: () => import_writing_flow.default,
  __experimentalBlockAlignmentMatrixControl: () => import_block_alignment_matrix_control.default,
  __experimentalBlockFullHeightAligmentControl: () => import_block_full_height_alignment_control.default,
  __experimentalBlockPatternSetup: () => import_block_pattern_setup.default,
  __experimentalBlockPatternsList: () => import_block_patterns_list.default,
  __experimentalBlockVariationPicker: () => import_block_variation_picker.default,
  __experimentalBlockVariationTransforms: () => import_block_variation_transforms.default,
  __experimentalBorderRadiusControl: () => import_border_radius_control.default,
  __experimentalColorGradientControl: () => import_control2.default,
  __experimentalColorGradientSettingsDropdown: () => import_dropdown2.default,
  __experimentalDateFormatPicker: () => import_date_format_picker.default,
  __experimentalDuotoneControl: () => import_duotone_control.default,
  __experimentalFontAppearanceControl: () => import_font_appearance_control.default,
  __experimentalFontFamilyControl: () => import_font_family.default,
  __experimentalImageEditor: () => import_image_editor.default,
  __experimentalImageSizeControl: () => import_image_size_control.default,
  __experimentalImageURLInputUI: () => import_image_url_input_ui.__experimentalImageURLInputUI,
  __experimentalInspectorPopoverHeader: () => import_inspector_popover_header.default,
  __experimentalLetterSpacingControl: () => import_letter_spacing_control.default,
  __experimentalLibrary: () => import_library.default,
  __experimentalLinkControl: () => import_link_control.DeprecatedExperimentalLinkControl,
  __experimentalLinkControlSearchInput: () => import_search_input.__experimentalLinkControlSearchInput,
  __experimentalLinkControlSearchItem: () => import_search_item.__experimentalLinkControlSearchItem,
  __experimentalLinkControlSearchResults: () => import_search_results.__experimentalLinkControlSearchResults,
  __experimentalListView: () => import_list_view.default,
  __experimentalPanelColorGradientSettings: () => import_panel_color_gradient_settings.default,
  __experimentalPreviewOptions: () => import_preview_options.default,
  __experimentalPublishDateTimePicker: () => import_publish_date_time_picker.default,
  __experimentalRecursionProvider: () => import_recursion_provider.DeprecatedExperimentalRecursionProvider,
  __experimentalResponsiveBlockControl: () => import_responsive_block_control.default,
  __experimentalSpacingSizesControl: () => import_spacing_sizes_control.default,
  __experimentalTextDecorationControl: () => import_text_decoration_control.default,
  __experimentalTextTransformControl: () => import_text_transform_control.default,
  __experimentalUnitControl: () => import_unit_control.default,
  __experimentalUseBlockOverlayActive: () => import_block_content_overlay.default,
  __experimentalUseBlockPreview: () => import_block_preview.useBlockPreview,
  __experimentalUseHasRecursion: () => import_recursion_provider.DeprecatedExperimentalUseHasRecursion,
  __experimentalUseMultipleOriginColorsAndGradients: () => import_use_multiple_origin_colors_and_gradients.default,
  __experimentalUseResizeCanvas: () => import_use_resize_canvas.default,
  __experimentalWritingModeControl: () => import_writing_mode_control.default,
  __unstableBlockSettingsMenuFirstItem: () => import_block_settings_menu_first_item.default,
  __unstableBlockToolbarLastItem: () => import_block_toolbar_last_item.default,
  __unstableEditorStyles: () => import_editor_styles.default,
  __unstableIframe: () => import_iframe.default,
  __unstableInserterMenuExtension: () => import_inserter_menu_extension.default,
  __unstableRichTextInputEvent: () => import_rich_text.__unstableRichTextInputEvent,
  __unstableUseBlockSelectionClearer: () => import_block_selection_clearer.useBlockSelectionClearer,
  __unstableUseClipboardHandler: () => import_copy_handler.__unstableUseClipboardHandler,
  __unstableUseMouseMoveTypingReset: () => import_observe_typing.useMouseMoveTypingReset,
  __unstableUseTypewriter: () => import_typewriter.useTypewriter,
  __unstableUseTypingObserver: () => import_observe_typing.useTypingObserver,
  getCustomValueFromPreset: () => import_utils.getCustomValueFromPreset,
  getSpacingPresetCssVar: () => import_utils.getSpacingPresetCssVar,
  isValueSpacingPreset: () => import_utils.isValueSpacingPreset,
  useBlockBindingsUtils: () => import_block_bindings.useBlockBindingsUtils,
  useBlockCommands: () => import_use_block_commands.useBlockCommands,
  useBlockDisplayInformation: () => import_use_block_display_information.default,
  useBlockEditContext: () => import_block_edit.useBlockEditContext,
  useBlockEditingMode: () => import_block_editing_mode.useBlockEditingMode,
  useBlockProps: () => import_use_block_props.useBlockProps,
  useHasRecursion: () => import_recursion_provider.useHasRecursion,
  useInnerBlocksProps: () => import_inner_blocks.useInnerBlocksProps,
  useSetting: () => import_use_settings.useSetting,
  useSettings: () => import_use_settings.useSettings,
  withColorContext: () => import_with_color_context.default
});
module.exports = __toCommonJS(components_exports);
__reExport(components_exports, require("./colors/index.cjs"), module.exports);
__reExport(components_exports, require("./gradients/index.cjs"), module.exports);
__reExport(components_exports, require("./font-sizes/index.cjs"), module.exports);
var import_alignment_control = require("./alignment-control/index.cjs");
var import_autocomplete = __toESM(require("./autocomplete/index.cjs"));
var import_block_alignment_control = require("./block-alignment-control/index.cjs");
var import_block_bindings = require("./block-bindings/index.cjs");
var import_block_full_height_alignment_control = __toESM(require("./block-full-height-alignment-control/index.cjs"));
var import_block_alignment_matrix_control = __toESM(require("./block-alignment-matrix-control/index.cjs"));
var import_block_breadcrumb = __toESM(require("./block-breadcrumb/index.cjs"));
var import_block_content_overlay = __toESM(require("./block-content-overlay/index.cjs"));
var import_block_context = require("./block-context/index.cjs");
var import_block_canvas = __toESM(require("./block-canvas/index.cjs"));
var import_block_controls = __toESM(require("./block-controls/index.cjs"));
var import_color_style_selector = __toESM(require("./color-style-selector/index.cjs"));
var import_block_edit = __toESM(require("./block-edit/index.cjs"));
var import_block_icon = __toESM(require("./block-icon/index.cjs"));
var import_dropdown = __toESM(require("./block-navigation/dropdown.cjs"));
var import_block_styles = __toESM(require("./block-styles/index.cjs"));
var import_block_heading_level_dropdown = __toESM(require("./block-heading-level-dropdown/index.cjs"));
var import_block_variation_picker = __toESM(require("./block-variation-picker/index.cjs"));
var import_block_pattern_setup = __toESM(require("./block-pattern-setup/index.cjs"));
var import_block_variation_transforms = __toESM(require("./block-variation-transforms/index.cjs"));
var import_block_vertical_alignment_control = require("./block-vertical-alignment-control/index.cjs");
var import_border_radius_control = __toESM(require("./border-radius-control/index.cjs"));
var import_button_block_appender = __toESM(require("./button-block-appender/index.cjs"));
var import_color_palette = __toESM(require("./color-palette/index.cjs"));
var import_control = __toESM(require("./color-palette/control.cjs"));
var import_contrast_checker = __toESM(require("./contrast-checker/index.cjs"));
var import_date_format_picker = __toESM(require("./date-format-picker/index.cjs"));
var import_duotone_control = __toESM(require("./duotone-control/index.cjs"));
var import_font_appearance_control = __toESM(require("./font-appearance-control/index.cjs"));
var import_font_family = __toESM(require("./font-family/index.cjs"));
var import_letter_spacing_control = __toESM(require("./letter-spacing-control/index.cjs"));
var import_text_decoration_control = __toESM(require("./text-decoration-control/index.cjs"));
var import_text_transform_control = __toESM(require("./text-transform-control/index.cjs"));
var import_writing_mode_control = __toESM(require("./writing-mode-control/index.cjs"));
var import_control2 = __toESM(require("./colors-gradients/control.cjs"));
var import_dropdown2 = __toESM(require("./colors-gradients/dropdown.cjs"));
var import_panel_color_gradient_settings = __toESM(require("./colors-gradients/panel-color-gradient-settings.cjs"));
var import_use_multiple_origin_colors_and_gradients = __toESM(require("./colors-gradients/use-multiple-origin-colors-and-gradients.cjs"));
var import_dimension_control = __toESM(require("./dimension-control/index.cjs"));
var import_height_control = __toESM(require("./height-control/index.cjs"));
var import_image_editor = __toESM(require("./image-editor/index.cjs"));
var import_image_size_control = __toESM(require("./image-size-control/index.cjs"));
var import_inner_blocks = __toESM(require("./inner-blocks/index.cjs"));
var import_inspector_controls = __toESM(require("./inspector-controls/index.cjs"));
var import_justify_content_control = require("./justify-content-control/index.cjs");
var import_link_control = __toESM(require("./link-control/index.cjs"));
var import_search_input = require("./link-control/search-input.cjs");
var import_search_results = require("./link-control/search-results.cjs");
var import_search_item = require("./link-control/search-item.cjs");
var import_line_height_control = __toESM(require("./line-height-control/index.cjs"));
var import_list_view = __toESM(require("./list-view/index.cjs"));
var import_media_replace_flow = __toESM(require("./media-replace-flow/index.cjs"));
var import_media_placeholder = __toESM(require("./media-placeholder/index.cjs"));
var import_media_upload = __toESM(require("./media-upload/index.cjs"));
var import_check = __toESM(require("./media-upload/check.cjs"));
var import_panel_color_settings = __toESM(require("./panel-color-settings/index.cjs"));
var import_plain_text = __toESM(require("./plain-text/index.cjs"));
var import_responsive_block_control = __toESM(require("./responsive-block-control/index.cjs"));
var import_rich_text = __toESM(require("./rich-text/index.cjs"));
var import_unit_control = __toESM(require("./unit-control/index.cjs"));
var import_url_input = __toESM(require("./url-input/index.cjs"));
var import_button = __toESM(require("./url-input/button.cjs"));
var import_url_popover = __toESM(require("./url-popover/index.cjs"));
var import_image_url_input_ui = require("./url-popover/image-url-input-ui.cjs");
var import_with_color_context = __toESM(require("./color-palette/with-color-context.cjs"));
var import_spacing_sizes_control = __toESM(require("./spacing-sizes-control/index.cjs"));
var import_utils = require("./spacing-sizes-control/utils.cjs");
var import_block_settings_menu_first_item = __toESM(require("./block-settings-menu/block-settings-menu-first-item.cjs"));
var import_block_toolbar_last_item = __toESM(require("./block-toolbar/block-toolbar-last-item.cjs"));
var import_inserter_menu_extension = __toESM(require("./inserter-menu-extension/index.cjs"));
var import_preview_options = __toESM(require("./preview-options/index.cjs"));
var import_use_resize_canvas = __toESM(require("./use-resize-canvas/index.cjs"));
var import_block_inspector = __toESM(require("./block-inspector/index.cjs"));
var import_block_list = __toESM(require("./block-list/index.cjs"));
var import_use_block_props = require("./block-list/use-block-props/index.cjs");
var import_block_mover = __toESM(require("./block-mover/index.cjs"));
var import_block_preview = __toESM(require("./block-preview/index.cjs"));
var import_block_selection_clearer = __toESM(require("./block-selection-clearer/index.cjs"));
var import_block_settings_menu = __toESM(require("./block-settings-menu/index.cjs"));
var import_block_settings_menu_controls = __toESM(require("./block-settings-menu-controls/index.cjs"));
var import_block_title = __toESM(require("./block-title/index.cjs"));
var import_block_toolbar = __toESM(require("./block-toolbar/index.cjs"));
var import_block_tools = __toESM(require("./block-tools/index.cjs"));
var import_copy_handler = __toESM(require("./copy-handler/index.cjs"));
var import_default_block_appender = __toESM(require("./default-block-appender/index.cjs"));
var import_editor_styles = __toESM(require("./editor-styles/index.cjs"));
var import_inserter = __toESM(require("./inserter/index.cjs"));
var import_library = __toESM(require("./inserter/library.cjs"));
var import_keyboard_shortcuts = __toESM(require("./keyboard-shortcuts/index.cjs"));
var import_selection_scroll_into_view = require("./selection-scroll-into-view/index.cjs");
var import_navigable_toolbar = __toESM(require("./navigable-toolbar/index.cjs"));
var import_observe_typing = __toESM(require("./observe-typing/index.cjs"));
var import_skip_to_selected_block = __toESM(require("./skip-to-selected-block/index.cjs"));
var import_typewriter = __toESM(require("./typewriter/index.cjs"));
var import_warning = __toESM(require("./warning/index.cjs"));
var import_writing_flow = __toESM(require("./writing-flow/index.cjs"));
var import_use_block_display_information = __toESM(require("./use-block-display-information/index.cjs"));
var import_iframe = __toESM(require("./iframe/index.cjs"));
var import_recursion_provider = require("./recursion-provider/index.cjs");
var import_block_patterns_list = __toESM(require("./block-patterns-list/index.cjs"));
var import_publish_date_time_picker = __toESM(require("./publish-date-time-picker/index.cjs"));
var import_inspector_popover_header = __toESM(require("./inspector-popover-header/index.cjs"));
var import_block_popover = __toESM(require("./block-popover/index.cjs"));
var import_block_editing_mode = require("./block-editing-mode/index.cjs");
var import_provider = __toESM(require("./provider/index.cjs"));
var import_use_settings = require("./use-settings/index.cjs");
var import_use_block_commands = require("./use-block-commands/index.cjs");
var import_tool_selector = __toESM(require("./tool-selector/index.cjs"));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AlignmentControl,
  AlignmentToolbar,
  Autocomplete,
  BlockAlignmentControl,
  BlockAlignmentToolbar,
  BlockBindingsAttributeControl,
  BlockBindingsSourceFieldsList,
  BlockBreadcrumb,
  BlockCanvas,
  BlockColorsStyleSelector,
  BlockContextProvider,
  BlockControls,
  BlockEdit,
  BlockEditorKeyboardShortcuts,
  BlockEditorProvider,
  BlockFormatControls,
  BlockIcon,
  BlockInspector,
  BlockList,
  BlockMover,
  BlockNavigationDropdown,
  BlockPopover,
  BlockPreview,
  BlockSelectionClearer,
  BlockSettingsMenu,
  BlockSettingsMenuControls,
  BlockStyles,
  BlockTitle,
  BlockToolbar,
  BlockTools,
  BlockVerticalAlignmentControl,
  BlockVerticalAlignmentToolbar,
  ButtonBlockAppender,
  ButtonBlockerAppender,
  ColorPalette,
  ColorPaletteControl,
  ContrastChecker,
  CopyHandler,
  DefaultBlockAppender,
  DimensionControl,
  HeadingLevelDropdown,
  HeightControl,
  InnerBlocks,
  Inserter,
  InspectorAdvancedControls,
  InspectorControls,
  JustifyContentControl,
  JustifyToolbar,
  LineHeightControl,
  LinkControl,
  MediaPlaceholder,
  MediaReplaceFlow,
  MediaUpload,
  MediaUploadCheck,
  MultiSelectScrollIntoView,
  NavigableToolbar,
  ObserveTyping,
  PanelColorSettings,
  PlainText,
  RecursionProvider,
  RichText,
  RichTextShortcut,
  RichTextToolbarButton,
  SkipToSelectedBlock,
  ToolSelector,
  Typewriter,
  URLInput,
  URLInputButton,
  URLPopover,
  Warning,
  WritingFlow,
  __experimentalBlockAlignmentMatrixControl,
  __experimentalBlockFullHeightAligmentControl,
  __experimentalBlockPatternSetup,
  __experimentalBlockPatternsList,
  __experimentalBlockVariationPicker,
  __experimentalBlockVariationTransforms,
  __experimentalBorderRadiusControl,
  __experimentalColorGradientControl,
  __experimentalColorGradientSettingsDropdown,
  __experimentalDateFormatPicker,
  __experimentalDuotoneControl,
  __experimentalFontAppearanceControl,
  __experimentalFontFamilyControl,
  __experimentalImageEditor,
  __experimentalImageSizeControl,
  __experimentalImageURLInputUI,
  __experimentalInspectorPopoverHeader,
  __experimentalLetterSpacingControl,
  __experimentalLibrary,
  __experimentalLinkControl,
  __experimentalLinkControlSearchInput,
  __experimentalLinkControlSearchItem,
  __experimentalLinkControlSearchResults,
  __experimentalListView,
  __experimentalPanelColorGradientSettings,
  __experimentalPreviewOptions,
  __experimentalPublishDateTimePicker,
  __experimentalRecursionProvider,
  __experimentalResponsiveBlockControl,
  __experimentalSpacingSizesControl,
  __experimentalTextDecorationControl,
  __experimentalTextTransformControl,
  __experimentalUnitControl,
  __experimentalUseBlockOverlayActive,
  __experimentalUseBlockPreview,
  __experimentalUseHasRecursion,
  __experimentalUseMultipleOriginColorsAndGradients,
  __experimentalUseResizeCanvas,
  __experimentalWritingModeControl,
  __unstableBlockSettingsMenuFirstItem,
  __unstableBlockToolbarLastItem,
  __unstableEditorStyles,
  __unstableIframe,
  __unstableInserterMenuExtension,
  __unstableRichTextInputEvent,
  __unstableUseBlockSelectionClearer,
  __unstableUseClipboardHandler,
  __unstableUseMouseMoveTypingReset,
  __unstableUseTypewriter,
  __unstableUseTypingObserver,
  getCustomValueFromPreset,
  getSpacingPresetCssVar,
  isValueSpacingPreset,
  useBlockBindingsUtils,
  useBlockCommands,
  useBlockDisplayInformation,
  useBlockEditContext,
  useBlockEditingMode,
  useBlockProps,
  useHasRecursion,
  useInnerBlocksProps,
  useSetting,
  useSettings,
  withColorContext,
  ...require("./colors/index.cjs"),
  ...require("./gradients/index.cjs"),
  ...require("./font-sizes/index.cjs")
});
//# sourceMappingURL=index.cjs.map
