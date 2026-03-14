// packages/block-editor/src/components/inspector-controls-tabs/content-tab.js
import { PanelBody } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import BlockQuickNavigation from "../block-quick-navigation/index.mjs";
import { Fragment, jsx } from "react/jsx-runtime";
var ContentTab = ({
  contentClientIds,
  onSwitchToListView,
  hasListViewTab
}) => {
  if (!contentClientIds || contentClientIds.length === 0) {
    return null;
  }
  const shouldShowBlockFields = window?.__experimentalContentOnlyInspectorFields;
  return /* @__PURE__ */ jsx(Fragment, { children: !shouldShowBlockFields && /* @__PURE__ */ jsx(PanelBody, { title: __("Content"), children: /* @__PURE__ */ jsx(
    BlockQuickNavigation,
    {
      clientIds: contentClientIds,
      onSwitchToListView,
      hasListViewTab
    }
  ) }) });
};
var content_tab_default = ContentTab;
export {
  content_tab_default as default
};
//# sourceMappingURL=content-tab.mjs.map
