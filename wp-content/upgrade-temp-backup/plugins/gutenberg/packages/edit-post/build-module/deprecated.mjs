// packages/edit-post/src/deprecated.js
import {
  privateApis as editorPrivateApis,
  PluginBlockSettingsMenuItem as EditorPluginBlockSettingsMenuItem,
  PluginDocumentSettingPanel as EditorPluginDocumentSettingPanel,
  PluginMoreMenuItem as EditorPluginMoreMenuItem,
  PluginPrePublishPanel as EditorPluginPrePublishPanel,
  PluginPostPublishPanel as EditorPluginPostPublishPanel,
  PluginPostStatusInfo as EditorPluginPostStatusInfo,
  PluginSidebar as EditorPluginSidebar,
  PluginSidebarMoreMenuItem as EditorPluginSidebarMoreMenuItem
} from "@wordpress/editor";
import { getPath } from "@wordpress/url";
import deprecated from "@wordpress/deprecated";
import { unlock } from "./lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var { PluginPostExcerpt } = unlock(editorPrivateApis);
var isSiteEditor = getPath(window.location.href)?.includes(
  "site-editor.php"
);
var deprecateSlot = (name) => {
  deprecated(`wp.editPost.${name}`, {
    since: "6.6",
    alternative: `wp.editor.${name}`
  });
};
function PluginBlockSettingsMenuItem(props) {
  if (isSiteEditor) {
    return null;
  }
  deprecateSlot("PluginBlockSettingsMenuItem");
  return /* @__PURE__ */ jsx(EditorPluginBlockSettingsMenuItem, { ...props });
}
function PluginDocumentSettingPanel(props) {
  if (isSiteEditor) {
    return null;
  }
  deprecateSlot("PluginDocumentSettingPanel");
  return /* @__PURE__ */ jsx(EditorPluginDocumentSettingPanel, { ...props });
}
function PluginMoreMenuItem(props) {
  if (isSiteEditor) {
    return null;
  }
  deprecateSlot("PluginMoreMenuItem");
  return /* @__PURE__ */ jsx(EditorPluginMoreMenuItem, { ...props });
}
function PluginPrePublishPanel(props) {
  if (isSiteEditor) {
    return null;
  }
  deprecateSlot("PluginPrePublishPanel");
  return /* @__PURE__ */ jsx(EditorPluginPrePublishPanel, { ...props });
}
function PluginPostPublishPanel(props) {
  if (isSiteEditor) {
    return null;
  }
  deprecateSlot("PluginPostPublishPanel");
  return /* @__PURE__ */ jsx(EditorPluginPostPublishPanel, { ...props });
}
function PluginPostStatusInfo(props) {
  if (isSiteEditor) {
    return null;
  }
  deprecateSlot("PluginPostStatusInfo");
  return /* @__PURE__ */ jsx(EditorPluginPostStatusInfo, { ...props });
}
function PluginSidebar(props) {
  if (isSiteEditor) {
    return null;
  }
  deprecateSlot("PluginSidebar");
  return /* @__PURE__ */ jsx(EditorPluginSidebar, { ...props });
}
function PluginSidebarMoreMenuItem(props) {
  if (isSiteEditor) {
    return null;
  }
  deprecateSlot("PluginSidebarMoreMenuItem");
  return /* @__PURE__ */ jsx(EditorPluginSidebarMoreMenuItem, { ...props });
}
function __experimentalPluginPostExcerpt() {
  if (isSiteEditor) {
    return null;
  }
  deprecated("wp.editPost.__experimentalPluginPostExcerpt", {
    since: "6.6",
    hint: "Core and custom panels can be access programmatically using their panel name.",
    link: "https://developer.wordpress.org/block-editor/reference-guides/slotfills/plugin-document-setting-panel/#accessing-a-panel-programmatically"
  });
  return PluginPostExcerpt;
}
export {
  PluginBlockSettingsMenuItem,
  PluginDocumentSettingPanel,
  PluginMoreMenuItem,
  PluginPostPublishPanel,
  PluginPostStatusInfo,
  PluginPrePublishPanel,
  PluginSidebar,
  PluginSidebarMoreMenuItem,
  __experimentalPluginPostExcerpt
};
//# sourceMappingURL=deprecated.mjs.map
