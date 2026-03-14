// packages/block-library/src/tabs-menu-item/controls.js
import clsx from "clsx";
import { __, isRTL } from "@wordpress/i18n";
import {
  BlockControls,
  store as blockEditorStore
} from "@wordpress/block-editor";
import { ToolbarGroup, ToolbarItem, Button } from "@wordpress/components";
import {
  chevronLeft,
  chevronRight,
  chevronUp,
  chevronDown
} from "@wordpress/icons";
import { useDispatch, useSelect } from "@wordpress/data";
import AddTabToolbarControl from "../tab/add-tab-toolbar-control.mjs";
import RemoveTabToolbarControl from "../tab/remove-tab-toolbar-control.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function TabBlockMover({
  tabClientId,
  tabIndex,
  tabsCount,
  tabsMenuClientId,
  tabsClientId
}) {
  const {
    moveBlocksUp,
    moveBlocksDown,
    updateBlockAttributes,
    __unstableMarkNextChangeAsNotPersistent
  } = useDispatch(blockEditorStore);
  const { tabPanelClientId, orientation } = useSelect(
    (select) => {
      const { getBlockRootClientId, getBlockAttributes } = select(blockEditorStore);
      const tabsMenuAttributes = tabsMenuClientId ? getBlockAttributes(tabsMenuClientId) : null;
      return {
        tabPanelClientId: getBlockRootClientId(tabClientId),
        orientation: tabsMenuAttributes?.layout?.orientation || "horizontal"
      };
    },
    [tabClientId, tabsMenuClientId]
  );
  const isFirst = tabIndex === 0;
  const isLast = tabIndex === tabsCount - 1;
  const isHorizontal = orientation === "horizontal";
  let upIcon, downIcon, upLabel, downLabel;
  if (isHorizontal) {
    if (isRTL()) {
      upIcon = chevronRight;
      downIcon = chevronLeft;
      upLabel = __("Move tab right");
      downLabel = __("Move tab left");
    } else {
      upIcon = chevronLeft;
      downIcon = chevronRight;
      upLabel = __("Move tab left");
      downLabel = __("Move tab right");
    }
  } else {
    upIcon = chevronUp;
    downIcon = chevronDown;
    upLabel = __("Move tab up");
    downLabel = __("Move tab down");
  }
  const handleMoveUp = () => {
    moveBlocksUp([tabClientId], tabPanelClientId);
    if (tabsClientId) {
      __unstableMarkNextChangeAsNotPersistent();
      updateBlockAttributes(tabsClientId, {
        editorActiveTabIndex: tabIndex - 1
      });
    }
  };
  const handleMoveDown = () => {
    moveBlocksDown([tabClientId], tabPanelClientId);
    if (tabsClientId) {
      __unstableMarkNextChangeAsNotPersistent();
      updateBlockAttributes(tabsClientId, {
        editorActiveTabIndex: tabIndex + 1
      });
    }
  };
  if (tabsCount <= 1) {
    return null;
  }
  return /* @__PURE__ */ jsx(BlockControls, { group: "parent", children: /* @__PURE__ */ jsx(
    ToolbarGroup,
    {
      className: clsx("block-editor-block-mover", {
        "is-horizontal": isHorizontal
      }),
      children: /* @__PURE__ */ jsxs("div", { className: "block-editor-block-mover__move-button-container", children: [
        /* @__PURE__ */ jsx(ToolbarItem, { children: (itemProps) => /* @__PURE__ */ jsx(
          Button,
          {
            className: clsx(
              "block-editor-block-mover-button",
              "is-up-button"
            ),
            icon: upIcon,
            label: upLabel,
            disabled: isFirst,
            accessibleWhenDisabled: true,
            onClick: handleMoveUp,
            __next40pxDefaultSize: true,
            ...itemProps
          }
        ) }),
        /* @__PURE__ */ jsx(ToolbarItem, { children: (itemProps) => /* @__PURE__ */ jsx(
          Button,
          {
            className: clsx(
              "block-editor-block-mover-button",
              "is-down-button"
            ),
            icon: downIcon,
            label: downLabel,
            disabled: isLast,
            accessibleWhenDisabled: true,
            onClick: handleMoveDown,
            __next40pxDefaultSize: true,
            ...itemProps
          }
        ) })
      ] })
    }
  ) });
}
function Controls({
  tabsClientId,
  tabClientId,
  tabIndex,
  tabsCount,
  tabsMenuClientId
}) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      TabBlockMover,
      {
        tabClientId,
        tabIndex,
        tabsCount,
        tabsMenuClientId,
        tabsClientId
      }
    ),
    /* @__PURE__ */ jsx(AddTabToolbarControl, { tabsClientId }),
    /* @__PURE__ */ jsx(RemoveTabToolbarControl, { tabsClientId })
  ] });
}
export {
  Controls as default
};
//# sourceMappingURL=controls.mjs.map
