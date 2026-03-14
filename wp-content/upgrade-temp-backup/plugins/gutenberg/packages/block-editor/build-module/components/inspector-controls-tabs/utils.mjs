// packages/block-editor/src/components/inspector-controls-tabs/utils.js
import { cog, styles, listView, page } from "@wordpress/icons";
import { __ } from "@wordpress/i18n";
var TAB_SETTINGS = {
  name: "settings",
  title: __("Settings"),
  value: "settings",
  icon: cog
};
var TAB_STYLES = {
  name: "styles",
  title: __("Styles"),
  value: "styles",
  icon: styles
};
var TAB_CONTENT = {
  name: "content",
  title: __("Content"),
  value: "content",
  icon: page
};
var TAB_LIST_VIEW = {
  name: "list",
  title: __("List View"),
  value: "list-view",
  icon: listView
};
export {
  TAB_CONTENT,
  TAB_LIST_VIEW,
  TAB_SETTINGS,
  TAB_STYLES
};
//# sourceMappingURL=utils.mjs.map
