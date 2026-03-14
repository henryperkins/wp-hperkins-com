// packages/reusable-blocks/src/components/reusable-blocks-menu-items/index.js
import { BlockSettingsMenuControls } from "@wordpress/block-editor";
import ReusableBlockConvertButton from "./reusable-block-convert-button.mjs";
import ReusableBlocksManageButton from "./reusable-blocks-manage-button.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function ReusableBlocksMenuItems({ rootClientId }) {
  return /* @__PURE__ */ jsx(BlockSettingsMenuControls, { children: ({ onClose, selectedClientIds }) => /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      ReusableBlockConvertButton,
      {
        clientIds: selectedClientIds,
        rootClientId,
        onClose
      }
    ),
    selectedClientIds.length === 1 && /* @__PURE__ */ jsx(
      ReusableBlocksManageButton,
      {
        clientId: selectedClientIds[0]
      }
    )
  ] }) });
}
export {
  ReusableBlocksMenuItems as default
};
//# sourceMappingURL=index.mjs.map
