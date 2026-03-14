// packages/edit-widgets/src/components/layout/unsaved-changes-warning.js
import { __ } from "@wordpress/i18n";
import { useEffect } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { store as editWidgetsStore } from "../../store/index.mjs";
function UnsavedChangesWarning() {
  const isDirty = useSelect((select) => {
    const { getEditedWidgetAreas } = select(editWidgetsStore);
    const editedWidgetAreas = getEditedWidgetAreas();
    return editedWidgetAreas?.length > 0;
  }, []);
  useEffect(() => {
    const warnIfUnsavedChanges = (event) => {
      if (isDirty) {
        event.returnValue = __(
          "You have unsaved changes. If you proceed, they will be lost."
        );
        return event.returnValue;
      }
    };
    window.addEventListener("beforeunload", warnIfUnsavedChanges);
    return () => {
      window.removeEventListener("beforeunload", warnIfUnsavedChanges);
    };
  }, [isDirty]);
  return null;
}
export {
  UnsavedChangesWarning as default
};
//# sourceMappingURL=unsaved-changes-warning.mjs.map
