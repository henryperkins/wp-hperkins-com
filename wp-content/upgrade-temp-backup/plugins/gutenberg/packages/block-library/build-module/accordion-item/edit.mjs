// packages/block-library/src/accordion-item/edit.js
import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  useInnerBlocksProps,
  InspectorControls,
  store as blockEditorStore
} from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import {
  ToggleControl,
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem
} from "@wordpress/components";
import clsx from "clsx";
import { useToolsPanelDropdownMenuProps } from "../utils/hooks.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var TEMPLATE = [["core/accordion-heading"], ["core/accordion-panel"]];
function Edit({
  attributes,
  clientId,
  setAttributes,
  isSelected: isSingleSelected
}) {
  const { openByDefault } = attributes;
  const dropdownMenuProps = useToolsPanelDropdownMenuProps();
  const { isSelected } = useSelect(
    (select) => {
      if (isSingleSelected || openByDefault) {
        return { isSelected: true };
      }
      return {
        isSelected: select(blockEditorStore).hasSelectedInnerBlock(
          clientId,
          true
        )
      };
    },
    [clientId, isSingleSelected, openByDefault]
  );
  const blockProps = useBlockProps({
    className: clsx({
      "is-open": openByDefault || isSelected
    })
  });
  const innerBlocksProps = useInnerBlocksProps(blockProps, {
    template: TEMPLATE,
    templateLock: "all",
    directInsert: true,
    templateInsertUpdatesSelection: true
  });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(InspectorControls, { children: /* @__PURE__ */ jsx(
      ToolsPanel,
      {
        label: __("Settings"),
        resetAll: () => {
          setAttributes({ openByDefault: false });
        },
        dropdownMenuProps,
        children: /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            label: __("Open by default"),
            isShownByDefault: true,
            hasValue: () => !!openByDefault,
            onDeselect: () => {
              setAttributes({ openByDefault: false });
            },
            children: /* @__PURE__ */ jsx(
              ToggleControl,
              {
                label: __("Open by default"),
                onChange: (value) => {
                  setAttributes({
                    openByDefault: value
                  });
                },
                checked: openByDefault,
                help: __(
                  "Accordion content will be displayed by default."
                )
              }
            )
          }
        )
      }
    ) }, "setting"),
    /* @__PURE__ */ jsx("div", { ...innerBlocksProps })
  ] });
}
export {
  Edit as default
};
//# sourceMappingURL=edit.mjs.map
