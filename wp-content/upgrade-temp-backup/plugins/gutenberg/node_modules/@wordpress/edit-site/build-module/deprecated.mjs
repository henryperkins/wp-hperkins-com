// packages/edit-site/src/deprecated.js
import {
  PluginMoreMenuItem as EditorPluginMoreMenuItem,
  PluginSidebar as EditorPluginSidebar,
  PluginSidebarMoreMenuItem as EditorPluginSidebarMoreMenuItem
} from "@wordpress/editor";
import { getPath } from "@wordpress/url";
import deprecated from "@wordpress/deprecated";
import { jsx } from "react/jsx-runtime";
var isSiteEditor = getPath(window.location.href)?.includes(
  "site-editor.php"
);
var deprecateSlot = (name) => {
  deprecated(`wp.editPost.${name}`, {
    since: "6.6",
    alternative: `wp.editor.${name}`
  });
};
function PluginMoreMenuItem(props) {
  if (!isSiteEditor) {
    return null;
  }
  deprecateSlot("PluginMoreMenuItem");
  return /* @__PURE__ */ jsx(EditorPluginMoreMenuItem, { ...props });
}
function PluginSidebar(props) {
  if (!isSiteEditor) {
    return null;
  }
  deprecateSlot("PluginSidebar");
  return /* @__PURE__ */ jsx(EditorPluginSidebar, { ...props });
}
function PluginSidebarMoreMenuItem(props) {
  if (!isSiteEditor) {
    return null;
  }
  deprecateSlot("PluginSidebarMoreMenuItem");
  return /* @__PURE__ */ jsx(EditorPluginSidebarMoreMenuItem, { ...props });
}
export {
  PluginMoreMenuItem,
  PluginSidebar,
  PluginSidebarMoreMenuItem
};
//# sourceMappingURL=deprecated.mjs.map
