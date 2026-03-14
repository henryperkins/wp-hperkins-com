// packages/block-library/src/tab/controls.js
import {
  InspectorControls,
  store as blockEditorStore
} from "@wordpress/block-editor";
import {
  CheckboxControl,
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useDispatch } from "@wordpress/data";
import AddTabToolbarControl from "./add-tab-toolbar-control.mjs";
import RemoveTabToolbarControl from "./remove-tab-toolbar-control.mjs";
import { useToolsPanelDropdownMenuProps } from "../utils/hooks.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function Controls({ tabsClientId, blockIndex, isDefaultTab }) {
  const { updateBlockAttributes } = useDispatch(blockEditorStore);
  const dropdownMenuProps = useToolsPanelDropdownMenuProps();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(AddTabToolbarControl, { tabsClientId }),
    /* @__PURE__ */ jsx(RemoveTabToolbarControl, { tabsClientId }),
    /* @__PURE__ */ jsx(InspectorControls, { children: /* @__PURE__ */ jsx(
      ToolsPanel,
      {
        label: __("Settings"),
        resetAll: () => {
          updateBlockAttributes(tabsClientId, {
            activeTabIndex: 0
          });
        },
        dropdownMenuProps,
        children: /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            label: __("Default tab"),
            hasValue: () => isDefaultTab && blockIndex !== 0,
            onDeselect: () => {
              updateBlockAttributes(tabsClientId, {
                activeTabIndex: 0
              });
            },
            isShownByDefault: true,
            children: /* @__PURE__ */ jsx(
              CheckboxControl,
              {
                label: __("Default tab"),
                checked: isDefaultTab,
                onChange: (value) => {
                  updateBlockAttributes(tabsClientId, {
                    activeTabIndex: value ? blockIndex : 0
                  });
                }
              }
            )
          }
        )
      }
    ) })
  ] });
}
export {
  Controls as default
};
//# sourceMappingURL=controls.mjs.map
