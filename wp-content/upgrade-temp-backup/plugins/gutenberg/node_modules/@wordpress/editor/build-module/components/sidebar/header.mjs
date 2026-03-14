// packages/editor/src/components/sidebar/header.js
import { privateApis as componentsPrivateApis } from "@wordpress/components";
import { __, _x } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { forwardRef } from "@wordpress/element";
import { decodeEntities } from "@wordpress/html-entities";
import { store as editorStore } from "../../store/index.mjs";
import { ATTACHMENT_POST_TYPE } from "../../store/constants.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { sidebars } from "./constants.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { Tabs } = unlock(componentsPrivateApis);
var SidebarHeader = (_, ref) => {
  const { postTypeLabel, isAttachment, isRevisionsMode } = useSelect(
    (select) => {
      const { getPostTypeLabel, getCurrentPostType } = select(editorStore);
      const { isRevisionsMode: _isRevisionsMode } = unlock(
        select(editorStore)
      );
      return {
        postTypeLabel: getPostTypeLabel(),
        isAttachment: getCurrentPostType() === ATTACHMENT_POST_TYPE && window?.__experimentalMediaEditor,
        isRevisionsMode: _isRevisionsMode()
      };
    },
    []
  );
  let documentLabel;
  if (isRevisionsMode) {
    documentLabel = __("Revision");
  } else if (postTypeLabel) {
    documentLabel = decodeEntities(postTypeLabel);
  } else {
    documentLabel = _x("Document", "noun, panel");
  }
  return /* @__PURE__ */ jsxs(Tabs.TabList, { ref, children: [
    /* @__PURE__ */ jsx(
      Tabs.Tab,
      {
        tabId: sidebars.document,
        "data-tab-id": sidebars.document,
        children: documentLabel
      }
    ),
    !isAttachment && !isRevisionsMode && /* @__PURE__ */ jsx(
      Tabs.Tab,
      {
        tabId: sidebars.block,
        "data-tab-id": sidebars.block,
        children: __("Block")
      }
    )
  ] });
};
var header_default = forwardRef(SidebarHeader);
export {
  header_default as default
};
//# sourceMappingURL=header.mjs.map
