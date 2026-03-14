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

// packages/block-editor/src/hooks/list-view.js
var list_view_exports = {};
__export(list_view_exports, {
  LIST_VIEW_SUPPORT_KEY: () => LIST_VIEW_SUPPORT_KEY,
  ListViewPanel: () => ListViewPanel,
  default: () => list_view_default,
  hasListViewSupport: () => hasListViewSupport
});
module.exports = __toCommonJS(list_view_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_blocks = require("@wordpress/blocks");
var import_element = require("@wordpress/element");
var import_store = require("../store/index.cjs");
var import_list_view = require("../components/list-view/index.cjs");
var import_fill = __toESM(require("../components/inspector-controls/fill.cjs"));
var import_private_block_context = require("../components/block-list/private-block-context.cjs");
var import_use_list_view_panel_state = __toESM(require("../components/use-list-view-panel-state/index.cjs"));
var import_lock_unlock = require("../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var LIST_VIEW_SUPPORT_KEY = "listView";
function hasListViewSupport(nameOrType) {
  return (0, import_blocks.hasBlockSupport)(nameOrType, LIST_VIEW_SUPPORT_KEY);
}
function ListViewPanel({ clientId, name }) {
  const { isSelectionWithinCurrentSection } = (0, import_element.useContext)(import_private_block_context.PrivateBlockContext);
  const { isOpened, expandRevision, handleToggle } = (0, import_use_list_view_panel_state.default)(clientId);
  const { openListViewContentPanel } = (0, import_lock_unlock.unlock)(
    (0, import_data.useDispatch)(import_store.store)
  );
  const isEnabled = hasListViewSupport(name);
  const { hasChildren, isNestedListView } = (0, import_data.useSelect)(
    (select) => {
      const { getBlockCount, getBlockParents, getBlockName } = select(import_store.store);
      const parents = getBlockParents(clientId, false);
      const _isNestedListView = parents.find((parentId) => {
        const parentName = getBlockName(parentId);
        return parentName === "core/navigation" || (0, import_blocks.hasBlockSupport)(parentName, "listView");
      });
      return {
        hasChildren: !!getBlockCount(clientId),
        isNestedListView: _isNestedListView
      };
    },
    [clientId]
  );
  const blockType = (0, import_blocks.getBlockType)(name);
  const title = blockType?.title || name;
  if (!isEnabled || isNestedListView) {
    return null;
  }
  const showBlockTitle = isSelectionWithinCurrentSection;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_fill.default, { group: "list", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.PanelBody,
    {
      title: showBlockTitle ? title : void 0,
      opened: isOpened,
      onToggle: handleToggle,
      children: [
        !hasChildren && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "block-editor-block-inspector__no-blocks", children: (0, import_i18n.__)("No items yet.") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_list_view.PrivateListView,
          {
            rootClientId: clientId,
            isExpanded: true,
            description: title,
            showAppender: true,
            onSelect: openListViewContentPanel
          },
          `${clientId}-${expandRevision}`
        )
      ]
    }
  ) });
}
var list_view_default = {
  edit: ListViewPanel,
  hasSupport: hasListViewSupport,
  attributeKeys: [],
  supportsPatternEditing: true
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LIST_VIEW_SUPPORT_KEY,
  ListViewPanel,
  hasListViewSupport
});
//# sourceMappingURL=list-view.cjs.map
