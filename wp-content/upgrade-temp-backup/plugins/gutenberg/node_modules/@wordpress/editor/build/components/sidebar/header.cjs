"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/sidebar/header.js
var header_exports = {};
__export(header_exports, {
  default: () => header_default
});
module.exports = __toCommonJS(header_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_html_entities = require("@wordpress/html-entities");
var import_store = require("../../store/index.cjs");
var import_constants = require("../../store/constants.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_constants2 = require("./constants.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { Tabs } = (0, import_lock_unlock.unlock)(import_components.privateApis);
var SidebarHeader = (_, ref) => {
  const { postTypeLabel, isAttachment, isRevisionsMode } = (0, import_data.useSelect)(
    (select) => {
      const { getPostTypeLabel, getCurrentPostType } = select(import_store.store);
      const { isRevisionsMode: _isRevisionsMode } = (0, import_lock_unlock.unlock)(
        select(import_store.store)
      );
      return {
        postTypeLabel: getPostTypeLabel(),
        isAttachment: getCurrentPostType() === import_constants.ATTACHMENT_POST_TYPE && window?.__experimentalMediaEditor,
        isRevisionsMode: _isRevisionsMode()
      };
    },
    []
  );
  let documentLabel;
  if (isRevisionsMode) {
    documentLabel = (0, import_i18n.__)("Revision");
  } else if (postTypeLabel) {
    documentLabel = (0, import_html_entities.decodeEntities)(postTypeLabel);
  } else {
    documentLabel = (0, import_i18n._x)("Document", "noun, panel");
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs.TabList, { ref, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      Tabs.Tab,
      {
        tabId: import_constants2.sidebars.document,
        "data-tab-id": import_constants2.sidebars.document,
        children: documentLabel
      }
    ),
    !isAttachment && !isRevisionsMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      Tabs.Tab,
      {
        tabId: import_constants2.sidebars.block,
        "data-tab-id": import_constants2.sidebars.block,
        children: (0, import_i18n.__)("Block")
      }
    )
  ] });
};
var header_default = (0, import_element.forwardRef)(SidebarHeader);
//# sourceMappingURL=header.cjs.map
