// packages/editor/src/components/table-of-contents/index.js
import { __ } from "@wordpress/i18n";
import { Dropdown, Button } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { info } from "@wordpress/icons";
import { forwardRef } from "@wordpress/element";
import { store as blockEditorStore } from "@wordpress/block-editor";
import TableOfContentsPanel from "./panel.mjs";
import { jsx } from "react/jsx-runtime";
function TableOfContents({ hasOutlineItemsDisabled, repositionDropdown, ...props }, ref) {
  const hasBlocks = useSelect(
    (select) => !!select(blockEditorStore).getBlockCount(),
    []
  );
  return /* @__PURE__ */ jsx(
    Dropdown,
    {
      popoverProps: {
        placement: repositionDropdown ? "right" : "bottom"
      },
      className: "table-of-contents",
      contentClassName: "table-of-contents__popover",
      renderToggle: ({ isOpen, onToggle }) => /* @__PURE__ */ jsx(
        Button,
        {
          __next40pxDefaultSize: true,
          ...props,
          ref,
          onClick: hasBlocks ? onToggle : void 0,
          icon: info,
          "aria-expanded": isOpen,
          "aria-haspopup": "true",
          label: __("Details"),
          tooltipPosition: "bottom",
          "aria-disabled": !hasBlocks
        }
      ),
      renderContent: ({ onClose }) => /* @__PURE__ */ jsx(
        TableOfContentsPanel,
        {
          onRequestClose: onClose,
          hasOutlineItemsDisabled
        }
      )
    }
  );
}
var table_of_contents_default = forwardRef(TableOfContents);
export {
  table_of_contents_default as default
};
//# sourceMappingURL=index.mjs.map
