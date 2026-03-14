// packages/editor/src/components/unsaved-changes-warning/index.js
import { __ } from "@wordpress/i18n";
import { useEffect } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
function UnsavedChangesWarning() {
  const { __experimentalGetDirtyEntityRecords } = useSelect(coreStore);
  useEffect(() => {
    const warnIfUnsavedChanges = (event) => {
      const dirtyEntityRecords = __experimentalGetDirtyEntityRecords();
      if (dirtyEntityRecords.length > 0) {
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
  }, [__experimentalGetDirtyEntityRecords]);
  return null;
}
export {
  UnsavedChangesWarning as default
};
//# sourceMappingURL=index.mjs.map
