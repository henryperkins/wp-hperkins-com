// packages/block-editor/src/hooks/list-view.js
import { __ } from "@wordpress/i18n";
import { PanelBody } from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { hasBlockSupport, getBlockType } from "@wordpress/blocks";
import { useContext } from "@wordpress/element";
import { store as blockEditorStore } from "../store/index.mjs";
import { PrivateListView } from "../components/list-view/index.mjs";
import InspectorControls from "../components/inspector-controls/fill.mjs";
import { PrivateBlockContext } from "../components/block-list/private-block-context.mjs";
import useListViewPanelState from "../components/use-list-view-panel-state/index.mjs";
import { unlock } from "../lock-unlock.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var LIST_VIEW_SUPPORT_KEY = "listView";
function hasListViewSupport(nameOrType) {
  return hasBlockSupport(nameOrType, LIST_VIEW_SUPPORT_KEY);
}
function ListViewPanel({ clientId, name }) {
  const { isSelectionWithinCurrentSection } = useContext(PrivateBlockContext);
  const { isOpened, expandRevision, handleToggle } = useListViewPanelState(clientId);
  const { openListViewContentPanel } = unlock(
    useDispatch(blockEditorStore)
  );
  const isEnabled = hasListViewSupport(name);
  const { hasChildren, isNestedListView } = useSelect(
    (select) => {
      const { getBlockCount, getBlockParents, getBlockName } = select(blockEditorStore);
      const parents = getBlockParents(clientId, false);
      const _isNestedListView = parents.find((parentId) => {
        const parentName = getBlockName(parentId);
        return parentName === "core/navigation" || hasBlockSupport(parentName, "listView");
      });
      return {
        hasChildren: !!getBlockCount(clientId),
        isNestedListView: _isNestedListView
      };
    },
    [clientId]
  );
  const blockType = getBlockType(name);
  const title = blockType?.title || name;
  if (!isEnabled || isNestedListView) {
    return null;
  }
  const showBlockTitle = isSelectionWithinCurrentSection;
  return /* @__PURE__ */ jsx(InspectorControls, { group: "list", children: /* @__PURE__ */ jsxs(
    PanelBody,
    {
      title: showBlockTitle ? title : void 0,
      opened: isOpened,
      onToggle: handleToggle,
      children: [
        !hasChildren && /* @__PURE__ */ jsx("p", { className: "block-editor-block-inspector__no-blocks", children: __("No items yet.") }),
        /* @__PURE__ */ jsx(
          PrivateListView,
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
export {
  LIST_VIEW_SUPPORT_KEY,
  ListViewPanel,
  list_view_default as default,
  hasListViewSupport
};
//# sourceMappingURL=list-view.mjs.map
