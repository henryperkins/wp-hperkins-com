// packages/edit-site/src/components/save-hub/index.js
import { useSelect } from "@wordpress/data";
import { __experimentalHStack as HStack } from "@wordpress/components";
import { store as coreStore } from "@wordpress/core-data";
import { check } from "@wordpress/icons";
import SaveButton from "../save-button/index.mjs";
import { isPreviewingTheme } from "../../utils/is-previewing-theme.mjs";
import { jsx } from "react/jsx-runtime";
function SaveHub() {
  const { isDisabled, isSaving } = useSelect((select) => {
    const { __experimentalGetDirtyEntityRecords, isSavingEntityRecord } = select(coreStore);
    const dirtyEntityRecords = __experimentalGetDirtyEntityRecords();
    const _isSaving = dirtyEntityRecords.some(
      (record) => isSavingEntityRecord(record.kind, record.name, record.key)
    );
    return {
      isSaving: _isSaving,
      isDisabled: _isSaving || !dirtyEntityRecords.length && !isPreviewingTheme()
    };
  }, []);
  return /* @__PURE__ */ jsx(HStack, { className: "edit-site-save-hub", alignment: "right", spacing: 4, children: /* @__PURE__ */ jsx(
    SaveButton,
    {
      className: "edit-site-save-hub__button",
      variant: isDisabled ? null : "primary",
      showTooltip: false,
      icon: isDisabled && !isSaving ? check : null,
      showReviewMessage: true,
      __next40pxDefaultSize: true
    }
  ) });
}
export {
  SaveHub as default
};
//# sourceMappingURL=index.mjs.map
