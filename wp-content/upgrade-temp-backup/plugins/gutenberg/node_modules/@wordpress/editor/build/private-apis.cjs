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

// packages/editor/src/private-apis.js
var private_apis_exports = {};
__export(private_apis_exports, {
  privateApis: () => privateApis
});
module.exports = __toCommonJS(private_apis_exports);
var import_fields = require("@wordpress/fields");
var interfaceApis = __toESM(require("@wordpress/interface"));
var import_lock_unlock = require("./lock-unlock.cjs");
var import_entities_saved_states = require("./components/entities-saved-states/index.cjs");
var import_back_button = __toESM(require("./components/header/back-button.cjs"));
var import_editor = __toESM(require("./components/editor/index.cjs"));
var import_plugin = __toESM(require("./components/post-excerpt/plugin.cjs"));
var import_post_card_panel = __toESM(require("./components/post-card-panel/index.cjs"));
var import_preferences_modal = __toESM(require("./components/preferences-modal/index.cjs"));
var import_actions = require("./components/post-actions/actions.cjs");
var import_post_fields = __toESM(require("./components/post-fields/index.cjs"));
var import_tools_more_menu_group = __toESM(require("./components/more-menu/tools-more-menu-group.cjs"));
var import_view_more_menu_group = __toESM(require("./components/more-menu/view-more-menu-group.cjs"));
var import_resizable_editor = __toESM(require("./components/resizable-editor/index.cjs"));
var import_api = require("./bindings/api.cjs");
var import_get_template_info = require("./utils/get-template-info.cjs");
var import_global_styles = __toESM(require("./components/global-styles/index.cjs"));
var import_style_book = require("./components/style-book/index.cjs");
var import_hooks = require("./components/global-styles/hooks.cjs");
var import_menu = require("./components/global-styles/menu.cjs");
var { store: interfaceStore, ...remainingInterfaceApis } = interfaceApis;
var privateApis = {};
(0, import_lock_unlock.lock)(privateApis, {
  CreateTemplatePartModal: import_fields.CreateTemplatePartModal,
  patternTitleField: import_fields.patternTitleField,
  templateTitleField: import_fields.templateTitleField,
  BackButton: import_back_button.default,
  EntitiesSavedStatesExtensible: import_entities_saved_states.EntitiesSavedStatesExtensible,
  Editor: import_editor.default,
  PluginPostExcerpt: import_plugin.default,
  PostCardPanel: import_post_card_panel.default,
  PreferencesModal: import_preferences_modal.default,
  usePostActions: import_actions.usePostActions,
  usePostFields: import_post_fields.default,
  ToolsMoreMenuGroup: import_tools_more_menu_group.default,
  ViewMoreMenuGroup: import_view_more_menu_group.default,
  ResizableEditor: import_resizable_editor.default,
  registerCoreBlockBindingsSources: import_api.registerCoreBlockBindingsSources,
  getTemplateInfo: import_get_template_info.getTemplateInfo,
  // Global Styles
  GlobalStylesUIWrapper: import_global_styles.default,
  GlobalStylesActionMenu: import_menu.GlobalStylesActionMenu,
  StyleBookPreview: import_style_book.StyleBookPreview,
  useGlobalStyles: import_hooks.useGlobalStyles,
  useStyle: import_hooks.useStyle,
  // This is a temporary private API while we're updating the site editor to use EditorProvider.
  interfaceStore,
  ...remainingInterfaceApis
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  privateApis
});
//# sourceMappingURL=private-apis.cjs.map
