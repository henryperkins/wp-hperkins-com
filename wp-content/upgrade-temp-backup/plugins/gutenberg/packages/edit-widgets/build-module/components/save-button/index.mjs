// packages/edit-widgets/src/components/save-button/index.js
import { Button } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useDispatch, useSelect } from "@wordpress/data";
import { store as editWidgetsStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
function SaveButton() {
  const { hasEditedWidgetAreaIds, isSaving, isWidgetSaveLocked } = useSelect(
    (select) => {
      const {
        getEditedWidgetAreas,
        isSavingWidgetAreas,
        isWidgetSavingLocked
      } = select(editWidgetsStore);
      return {
        hasEditedWidgetAreaIds: getEditedWidgetAreas()?.length > 0,
        isSaving: isSavingWidgetAreas(),
        isWidgetSaveLocked: isWidgetSavingLocked()
      };
    },
    []
  );
  const { saveEditedWidgetAreas } = useDispatch(editWidgetsStore);
  const isDisabled = isWidgetSaveLocked || isSaving || !hasEditedWidgetAreaIds;
  return /* @__PURE__ */ jsx(
    Button,
    {
      variant: "primary",
      isBusy: isSaving,
      "aria-disabled": isDisabled,
      onClick: isDisabled ? void 0 : saveEditedWidgetAreas,
      size: "compact",
      children: isSaving ? __("Saving\u2026") : __("Update")
    }
  );
}
var save_button_default = SaveButton;
export {
  save_button_default as default
};
//# sourceMappingURL=index.mjs.map
