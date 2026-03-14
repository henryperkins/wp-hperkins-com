// packages/block-editor/src/components/block-toolbar/pattern-overrides-dropdown.js
import {
  Popover,
  ToolbarButton,
  __experimentalText as Text
} from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";
import { useState, useRef } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "../../store/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function PatternOverridesPopoverContent({ clientIds, blockTitle }) {
  const blockMetaName = useSelect(
    (select) => {
      const { getBlockAttributes } = select(blockEditorStore);
      return getBlockAttributes(clientIds?.[0])?.metadata?.name;
    },
    [clientIds]
  );
  const isSingleBlock = clientIds.length === 1;
  let description;
  if (isSingleBlock && blockMetaName) {
    description = sprintf(
      /* translators: 1: The block type's name. 2: The block's user-provided name (the same as the override name). */
      __('This %1$s is editable using the "%2$s" override.'),
      blockTitle.toLowerCase(),
      blockMetaName
    );
  } else {
    description = __("These blocks are editable using overrides.");
  }
  return /* @__PURE__ */ jsx(Text, { children: description });
}
function PatternOverridesDropdown({
  icon,
  clientIds,
  blockTitle,
  label
}) {
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      ToolbarButton,
      {
        ref: anchorRef,
        className: "block-editor-block-toolbar__pattern-overrides-indicator",
        icon,
        label,
        onClick: () => setIsOpen(!isOpen),
        "aria-expanded": isOpen
      }
    ),
    isOpen && /* @__PURE__ */ jsx(
      Popover,
      {
        anchor: anchorRef.current,
        onClose: () => setIsOpen(false),
        placement: "bottom-start",
        offset: 16,
        className: "block-editor-block-toolbar__pattern-overrides-popover",
        children: /* @__PURE__ */ jsx(
          PatternOverridesPopoverContent,
          {
            clientIds,
            blockTitle
          }
        )
      }
    )
  ] });
}
export {
  PatternOverridesDropdown as default
};
//# sourceMappingURL=pattern-overrides-dropdown.mjs.map
