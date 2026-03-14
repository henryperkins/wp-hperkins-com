// packages/patterns/src/components/index.js
import { BlockSettingsMenuControls } from "@wordpress/block-editor";
import PatternConvertButton from "./pattern-convert-button.mjs";
import PatternsManageButton from "./patterns-manage-button.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function PatternsMenuItems({ rootClientId }) {
  return /* @__PURE__ */ jsx(BlockSettingsMenuControls, { children: ({ selectedClientIds, onClose }) => /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      PatternConvertButton,
      {
        clientIds: selectedClientIds,
        rootClientId,
        closeBlockSettingsMenu: onClose
      }
    ),
    selectedClientIds.length === 1 && /* @__PURE__ */ jsx(
      PatternsManageButton,
      {
        clientId: selectedClientIds[0],
        onClose
      }
    )
  ] }) });
}
export {
  PatternsMenuItems as default
};
//# sourceMappingURL=index.mjs.map
