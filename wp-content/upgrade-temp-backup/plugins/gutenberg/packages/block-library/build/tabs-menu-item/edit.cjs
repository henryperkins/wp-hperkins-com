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

// packages/block-library/src/tabs-menu-item/edit.js
var edit_exports = {};
__export(edit_exports, {
  default: () => Edit
});
module.exports = __toCommonJS(edit_exports);
var import_clsx = __toESM(require("clsx"));
var import_i18n = require("@wordpress/i18n");
var import_block_editor = require("@wordpress/block-editor");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_slug_from_label = __toESM(require("../tab/slug-from-label.cjs"));
var import_controls = __toESM(require("./controls.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function Edit({
  context,
  clientId,
  __unstableLayoutClassNames: layoutClassNames
}) {
  const tabIndex = context["core/tabs-menu-item-index"] ?? 0;
  const tabId = context["core/tabs-menu-item-id"] ?? "";
  const tabLabel = context["core/tabs-menu-item-label"] ?? "";
  const tabClientId = context["core/tabs-menu-item-clientId"] ?? "";
  const contextTabsList = context["core/tabs-list"];
  const tabsList = (0, import_element.useMemo)(
    () => contextTabsList || [],
    [contextTabsList]
  );
  const activeTabIndex = context["core/tabs-activeTabIndex"] ?? 0;
  const editorActiveTabIndex = context["core/tabs-editorActiveTabIndex"];
  const effectiveActiveIndex = (0, import_element.useMemo)(() => {
    return editorActiveTabIndex ?? activeTabIndex;
  }, [editorActiveTabIndex, activeTabIndex]);
  const isActiveTab = tabIndex === effectiveActiveIndex;
  const { __unstableMarkNextChangeAsNotPersistent } = (0, import_data.useDispatch)(import_block_editor.store);
  const { tabsClientId, tabsMenuClientId, selectedTabClientId } = (0, import_data.useSelect)(
    (select) => {
      const {
        getBlockRootClientId,
        getSelectedBlockClientIds,
        hasSelectedInnerBlock
      } = select(import_block_editor.store);
      const _tabsMenuClientId = getBlockRootClientId(clientId);
      const _tabsClientId = _tabsMenuClientId ? getBlockRootClientId(_tabsMenuClientId) : null;
      const selectedIds = getSelectedBlockClientIds();
      let selectedTab = null;
      for (const tab of tabsList) {
        if (selectedIds.includes(tab.clientId) || hasSelectedInnerBlock(tab.clientId, true)) {
          selectedTab = tab.clientId;
          break;
        }
      }
      return {
        tabsClientId: _tabsClientId,
        tabsMenuClientId: _tabsMenuClientId,
        selectedTabClientId: selectedTab
      };
    },
    [clientId, tabsList]
  );
  const isSelectedTab = tabClientId === selectedTabClientId;
  const { updateBlockAttributes } = (0, import_data.useDispatch)(import_block_editor.store);
  const handleLabelChange = (0, import_element.useCallback)(
    (newLabel) => {
      if (tabClientId) {
        updateBlockAttributes(tabClientId, {
          label: newLabel,
          anchor: (0, import_slug_from_label.default)(newLabel, tabIndex)
        });
      }
    },
    [updateBlockAttributes, tabClientId, tabIndex]
  );
  const handleTabClick = (0, import_element.useCallback)(
    (event) => {
      event.preventDefault();
      if (tabsClientId && tabIndex !== effectiveActiveIndex) {
        __unstableMarkNextChangeAsNotPersistent();
        updateBlockAttributes(tabsClientId, {
          editorActiveTabIndex: tabIndex
        });
      }
    },
    [
      tabsClientId,
      tabIndex,
      effectiveActiveIndex,
      updateBlockAttributes,
      __unstableMarkNextChangeAsNotPersistent
    ]
  );
  const tabPanelId = tabId || `tab-${tabIndex}`;
  const tabLabelId = `${tabPanelId}--tab`;
  const blockProps = (0, import_block_editor.useBlockProps)({
    className: (0, import_clsx.default)(layoutClassNames, {
      "is-active": isActiveTab,
      "is-selected": isSelectedTab
    }),
    "aria-controls": tabPanelId,
    "aria-selected": isActiveTab,
    id: tabLabelId,
    role: "tab",
    tabIndex: -1,
    onClick: handleTabClick
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_controls.default,
      {
        tabsClientId,
        tabClientId,
        tabIndex,
        tabsCount: tabsList.length,
        tabsMenuClientId
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ...blockProps, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_editor.RichText,
      {
        tagName: "span",
        withoutInteractiveFormatting: true,
        placeholder: (0, import_i18n.sprintf)(
          /* translators: %d is the tab index + 1 */
          (0, import_i18n.__)("Tab title %d"),
          tabIndex + 1
        ),
        value: tabLabel || "",
        onChange: handleLabelChange
      }
    ) })
  ] });
}
//# sourceMappingURL=edit.cjs.map
