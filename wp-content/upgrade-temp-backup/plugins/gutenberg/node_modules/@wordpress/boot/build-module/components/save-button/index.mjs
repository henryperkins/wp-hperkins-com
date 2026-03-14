// packages/boot/src/components/save-button/index.tsx
import { useEffect, useState } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { _n, __, sprintf } from "@wordpress/i18n";
import { store as coreStore } from "@wordpress/core-data";
import { displayShortcut, rawShortcut } from "@wordpress/keycodes";
import { check } from "@wordpress/icons";
import { EntitiesSavedStates } from "@wordpress/editor";
import { Button, Modal, Tooltip } from "@wordpress/components";

// packages/boot/src/components/save-button/style.scss
if (typeof document !== "undefined" && process.env.NODE_ENV !== "test" && !document.head.querySelector("style[data-wp-hash='a012fe845a']")) {
  const style = document.createElement("style");
  style.setAttribute("data-wp-hash", "a012fe845a");
  style.appendChild(document.createTextNode(".boot-save-button{width:100%}"));
  document.head.appendChild(style);
}

// packages/boot/src/components/save-button/index.tsx
import useSaveShortcut from "../save-panel/use-save-shortcut.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function SaveButton() {
  const [isSaveViewOpen, setIsSaveViewOpened] = useState(false);
  const { isSaving, dirtyEntityRecordsCount } = useSelect((select) => {
    const { isSavingEntityRecord, __experimentalGetDirtyEntityRecords } = select(coreStore);
    const dirtyEntityRecords = __experimentalGetDirtyEntityRecords();
    return {
      isSaving: dirtyEntityRecords.some(
        (record) => isSavingEntityRecord(record.kind, record.name, record.key)
      ),
      dirtyEntityRecordsCount: dirtyEntityRecords.length
    };
  }, []);
  const [showSavedState, setShowSavedState] = useState(false);
  useEffect(() => {
    if (isSaving) {
      setShowSavedState(true);
    }
  }, [isSaving]);
  const hasChanges = dirtyEntityRecordsCount > 0;
  useEffect(() => {
    if (!isSaving && hasChanges) {
      setShowSavedState(false);
    }
  }, [isSaving, hasChanges]);
  function hideSavedState() {
    if (showSavedState) {
      setShowSavedState(false);
    }
  }
  const shouldShowButton = hasChanges || showSavedState;
  useSaveShortcut({ openSavePanel: () => setIsSaveViewOpened(true) });
  if (!shouldShowButton) {
    return null;
  }
  const isInSavedState = showSavedState && !hasChanges;
  const disabled = isSaving || isInSavedState;
  const getLabel = () => {
    if (isInSavedState) {
      return __("Saved");
    }
    return sprintf(
      // translators: %d: number of unsaved changes (number).
      _n(
        "Review %d change\u2026",
        "Review %d changes\u2026",
        dirtyEntityRecordsCount
      ),
      dirtyEntityRecordsCount
    );
  };
  const label = getLabel();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Tooltip,
      {
        text: hasChanges ? label : void 0,
        shortcut: displayShortcut.primary("s"),
        children: /* @__PURE__ */ jsx(
          Button,
          {
            variant: "primary",
            size: "compact",
            onClick: () => setIsSaveViewOpened(true),
            onBlur: hideSavedState,
            disabled,
            accessibleWhenDisabled: true,
            isBusy: isSaving,
            "aria-keyshortcuts": rawShortcut.primary("s"),
            className: "boot-save-button",
            icon: isInSavedState ? check : void 0,
            children: label
          }
        )
      }
    ),
    isSaveViewOpen && /* @__PURE__ */ jsx(
      Modal,
      {
        title: __("Review changes"),
        onRequestClose: () => setIsSaveViewOpened(false),
        size: "small",
        children: /* @__PURE__ */ jsx(
          EntitiesSavedStates,
          {
            close: () => setIsSaveViewOpened(false),
            variant: "inline"
          }
        )
      }
    )
  ] });
}
export {
  SaveButton as default
};
//# sourceMappingURL=index.mjs.map
