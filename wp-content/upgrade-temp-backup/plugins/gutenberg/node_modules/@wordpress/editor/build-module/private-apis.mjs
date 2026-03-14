// packages/editor/src/private-apis.js
import {
  CreateTemplatePartModal,
  patternTitleField,
  templateTitleField
} from "@wordpress/fields";
import * as interfaceApis from "@wordpress/interface";
import { lock } from "./lock-unlock.mjs";
import { EntitiesSavedStatesExtensible } from "./components/entities-saved-states/index.mjs";
import BackButton from "./components/header/back-button.mjs";
import Editor from "./components/editor/index.mjs";
import PluginPostExcerpt from "./components/post-excerpt/plugin.mjs";
import PostCardPanel from "./components/post-card-panel/index.mjs";
import PreferencesModal from "./components/preferences-modal/index.mjs";
import { usePostActions } from "./components/post-actions/actions.mjs";
import usePostFields from "./components/post-fields/index.mjs";
import ToolsMoreMenuGroup from "./components/more-menu/tools-more-menu-group.mjs";
import ViewMoreMenuGroup from "./components/more-menu/view-more-menu-group.mjs";
import ResizableEditor from "./components/resizable-editor/index.mjs";
import { registerCoreBlockBindingsSources } from "./bindings/api.mjs";
import { getTemplateInfo } from "./utils/get-template-info.mjs";
import GlobalStylesUIWrapper from "./components/global-styles/index.mjs";
import { StyleBookPreview } from "./components/style-book/index.mjs";
import { useGlobalStyles, useStyle } from "./components/global-styles/hooks.mjs";
import { GlobalStylesActionMenu } from "./components/global-styles/menu.mjs";
var { store: interfaceStore, ...remainingInterfaceApis } = interfaceApis;
var privateApis = {};
lock(privateApis, {
  CreateTemplatePartModal,
  patternTitleField,
  templateTitleField,
  BackButton,
  EntitiesSavedStatesExtensible,
  Editor,
  PluginPostExcerpt,
  PostCardPanel,
  PreferencesModal,
  usePostActions,
  usePostFields,
  ToolsMoreMenuGroup,
  ViewMoreMenuGroup,
  ResizableEditor,
  registerCoreBlockBindingsSources,
  getTemplateInfo,
  // Global Styles
  GlobalStylesUIWrapper,
  GlobalStylesActionMenu,
  StyleBookPreview,
  useGlobalStyles,
  useStyle,
  // This is a temporary private API while we're updating the site editor to use EditorProvider.
  interfaceStore,
  ...remainingInterfaceApis
});
export {
  privateApis
};
//# sourceMappingURL=private-apis.mjs.map
