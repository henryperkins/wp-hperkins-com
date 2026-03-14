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

// packages/block-library/src/tabs-menu/edit.js
var edit_exports = {};
__export(edit_exports, {
  default: () => edit_default
});
module.exports = __toCommonJS(edit_exports);
var import_clsx = __toESM(require("clsx"));
var import_i18n = require("@wordpress/i18n");
var import_block_editor = require("@wordpress/block-editor");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_add_tab_toolbar_control = __toESM(require("../tab/add-tab-toolbar-control.cjs"));
var import_remove_tab_toolbar_control = __toESM(require("../tab/remove-tab-toolbar-control.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var TABS_MENU_ITEM_TEMPLATE = [["core/tabs-menu-item", {}]];
var EMPTY_ARRAY = [];
function TabsMenuItemPreview({
  blocks,
  blockContextId,
  isHidden,
  setActiveBlockContextId
}) {
  const blockPreviewProps = (0, import_block_editor.__experimentalUseBlockPreview)({ blocks });
  const handleOnClick = () => {
    setActiveBlockContextId(blockContextId);
  };
  const style = {
    display: isHidden ? "none" : "flex"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      ...blockPreviewProps,
      tabIndex: 0,
      role: "button",
      onClick: handleOnClick,
      onKeyDown: handleOnClick,
      style
    }
  );
}
var MemoizedTabsMenuItemPreview = (0, import_element.memo)(TabsMenuItemPreview);
function TabsMenuItemTemplateBlocks({ wrapperProps = {}, layout }) {
  const innerBlocksProps = (0, import_block_editor.useInnerBlocksProps)(wrapperProps, {
    template: TABS_MENU_ITEM_TEMPLATE,
    templateLock: "all",
    renderAppender: false,
    layout
  });
  return innerBlocksProps.children;
}
function Edit({
  context,
  clientId,
  __unstableLayoutClassNames: layoutClassNames
}) {
  const { layout } = (0, import_block_editor.useBlockEditContext)();
  const tabsId = context["core/tabs-id"] || null;
  const tabsList = context["core/tabs-list"] || EMPTY_ARRAY;
  const activeTabIndex = context["core/tabs-activeTabIndex"] ?? 0;
  const editorActiveTabIndex = context["core/tabs-editorActiveTabIndex"];
  const effectiveActiveIndex = (0, import_element.useMemo)(() => {
    return editorActiveTabIndex ?? activeTabIndex;
  }, [editorActiveTabIndex, activeTabIndex]);
  const { __unstableMarkNextChangeAsNotPersistent } = (0, import_data.useDispatch)(import_block_editor.store);
  const { updateBlockAttributes } = (0, import_data.useDispatch)(import_block_editor.store);
  const [activeBlockContextId, setActiveBlockContextId] = (0, import_element.useState)(null);
  const { blocks, tabsClientId } = (0, import_data.useSelect)(
    (select) => {
      const { getBlocks, getBlockRootClientId } = select(import_block_editor.store);
      return {
        blocks: getBlocks(clientId),
        tabsClientId: getBlockRootClientId(clientId)
      };
    },
    [clientId]
  );
  const blockContexts = (0, import_element.useMemo)(() => {
    return tabsList.map((tab, index) => ({
      "core/tabs-menu-item-index": index,
      "core/tabs-menu-item-id": tab.id || `tab-${index}`,
      "core/tabs-menu-item-label": tab.label || "",
      "core/tabs-menu-item-clientId": tab.clientId,
      // Pass through parent context
      "core/tabs-id": tabsId,
      "core/tabs-list": tabsList,
      "core/tabs-activeTabIndex": activeTabIndex,
      "core/tabs-editorActiveTabIndex": editorActiveTabIndex
    }));
  }, [tabsList, tabsId, activeTabIndex, editorActiveTabIndex]);
  const getContextId = (0, import_element.useCallback)((blockContext) => {
    return `tab-context-${blockContext["core/tabs-menu-item-index"]}`;
  }, []);
  (0, import_element.useEffect)(() => {
    if (blockContexts.length > 0 && activeBlockContextId === null) {
      setActiveBlockContextId(getContextId(blockContexts[0]));
    }
  }, [blockContexts, activeBlockContextId, getContextId]);
  (0, import_element.useEffect)(() => {
    if (blockContexts.length > 0 && effectiveActiveIndex < blockContexts.length) {
      const newContextId = getContextId(
        blockContexts[effectiveActiveIndex]
      );
      setActiveBlockContextId(
        (prevId) => prevId !== newContextId ? newContextId : prevId
      );
    }
  }, [effectiveActiveIndex, blockContexts, getContextId]);
  const handleTabContextClick = (0, import_element.useCallback)(
    (index) => {
      if (tabsClientId && index !== effectiveActiveIndex) {
        __unstableMarkNextChangeAsNotPersistent();
        updateBlockAttributes(tabsClientId, {
          editorActiveTabIndex: index
        });
      }
    },
    [
      tabsClientId,
      effectiveActiveIndex,
      updateBlockAttributes,
      __unstableMarkNextChangeAsNotPersistent
    ]
  );
  const blockProps = (0, import_block_editor.useBlockProps)({
    className: (0, import_clsx.default)(layoutClassNames),
    role: "tablist"
  });
  if (tabsList.length === 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_add_tab_toolbar_control.default, { tabsClientId }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_remove_tab_toolbar_control.default, { tabsClientId }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ...blockProps, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "tabs__tab-label tabs__tab-label--placeholder", children: (0, import_i18n.__)("Add tabs to display menu") }) })
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_add_tab_toolbar_control.default, { tabsClientId }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_remove_tab_toolbar_control.default, { tabsClientId }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ...blockProps, children: blockContexts.map((blockContext, index) => {
      const contextId = getContextId(blockContext);
      const isVisible = contextId === activeBlockContextId;
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        import_block_editor.BlockContextProvider,
        {
          value: blockContext,
          children: [
            isVisible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              TabsMenuItemTemplateBlocks,
              {
                wrapperProps: {
                  onClick: () => handleTabContextClick(index)
                },
                layout
              }
            ) : null,
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              MemoizedTabsMenuItemPreview,
              {
                blocks,
                blockContextId: contextId,
                setActiveBlockContextId: (id) => {
                  setActiveBlockContextId(id);
                  handleTabContextClick(index);
                },
                isHidden: isVisible
              }
            )
          ]
        },
        contextId
      );
    }) })
  ] });
}
var edit_default = Edit;
//# sourceMappingURL=edit.cjs.map
