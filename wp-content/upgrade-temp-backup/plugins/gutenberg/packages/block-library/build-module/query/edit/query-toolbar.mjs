// packages/block-library/src/query/edit/query-toolbar.js
import {
  ToolbarButton,
  Dropdown,
  __experimentalDropdownContentWrapper as DropdownContentWrapper
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import {
  BlockControls,
  store as blockEditorStore
} from "@wordpress/block-editor";
import PatternSelection, { useBlockPatterns } from "./pattern-selection.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
function PatternPicker({ clientId, attributes, hasInnerBlocks }) {
  const hasPatterns = useBlockPatterns(clientId, attributes).length;
  if (!hasPatterns) {
    return null;
  }
  const buttonLabel = hasInnerBlocks ? __("Change design") : __("Choose pattern");
  return /* @__PURE__ */ jsx(BlockControls, { group: "other", children: /* @__PURE__ */ jsx(DropdownContentWrapper, { children: /* @__PURE__ */ jsx(
    Dropdown,
    {
      contentClassName: "block-editor-block-settings-menu__popover",
      focusOnMount: "firstElement",
      expandOnMobile: true,
      renderToggle: ({ isOpen, onToggle }) => /* @__PURE__ */ jsx(
        ToolbarButton,
        {
          "aria-haspopup": "true",
          "aria-expanded": isOpen,
          onClick: onToggle,
          children: buttonLabel
        }
      ),
      renderContent: () => /* @__PURE__ */ jsx(
        PatternSelection,
        {
          clientId,
          attributes,
          showSearch: false,
          showTitlesAsTooltip: true
        }
      )
    }
  ) }) });
}
function QueryToolbar(props) {
  const isLocked = useSelect(
    (select) => {
      const { isLockedBlock } = unlock(select(blockEditorStore));
      return isLockedBlock(props.clientId);
    },
    [props.clientId]
  );
  if (isLocked) {
    return null;
  }
  return /* @__PURE__ */ jsx(PatternPicker, { ...props });
}
export {
  QueryToolbar as default
};
//# sourceMappingURL=query-toolbar.mjs.map
