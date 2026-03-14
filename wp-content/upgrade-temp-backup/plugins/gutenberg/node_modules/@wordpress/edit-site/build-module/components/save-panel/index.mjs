// packages/edit-site/src/components/save-panel/index.js
import clsx from "clsx";
import { NavigableRegion } from "@wordpress/admin-ui";
import { Button, Modal } from "@wordpress/components";
import {
  EntitiesSavedStates,
  useEntitiesSavedStatesIsDirty,
  privateApis
} from "@wordpress/editor";
import { useDispatch, useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { store as coreStore } from "@wordpress/core-data";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { useEffect } from "@wordpress/element";
import { store as editSiteStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { useActivateTheme } from "../../utils/use-activate-theme.mjs";
import { useActualCurrentTheme } from "../../utils/use-actual-current-theme.mjs";
import { isPreviewingTheme } from "../../utils/is-previewing-theme.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { EntitiesSavedStatesExtensible } = unlock(privateApis);
var { useLocation } = unlock(routerPrivateApis);
var EntitiesSavedStatesForPreview = ({
  onClose,
  renderDialog,
  variant
}) => {
  const isDirtyProps = useEntitiesSavedStatesIsDirty();
  let activateSaveLabel, successNoticeContent;
  if (isDirtyProps.isDirty) {
    activateSaveLabel = __("Activate & Save");
    successNoticeContent = __("Theme activated and site updated.");
  } else {
    activateSaveLabel = __("Activate");
    successNoticeContent = __("Theme activated.");
  }
  const currentTheme = useActualCurrentTheme();
  const previewingTheme = useSelect(
    (select) => select(coreStore).getCurrentTheme(),
    []
  );
  const additionalPrompt = /* @__PURE__ */ jsx("p", { children: sprintf(
    /* translators: 1: The name of active theme, 2: The name of theme to be activated. */
    __(
      "Saving your changes will change your active theme from %1$s to %2$s."
    ),
    currentTheme?.name?.rendered ?? "...",
    previewingTheme?.name?.rendered ?? "..."
  ) });
  const activateTheme = useActivateTheme();
  const onSave = async (values) => {
    await activateTheme();
    return values;
  };
  return /* @__PURE__ */ jsx(
    EntitiesSavedStatesExtensible,
    {
      ...{
        ...isDirtyProps,
        additionalPrompt,
        close: onClose,
        onSave,
        saveEnabled: true,
        saveLabel: activateSaveLabel,
        renderDialog,
        variant,
        successNoticeContent
      }
    }
  );
};
var _EntitiesSavedStates = ({ onClose, renderDialog, variant }) => {
  if (isPreviewingTheme()) {
    return /* @__PURE__ */ jsx(
      EntitiesSavedStatesForPreview,
      {
        onClose,
        renderDialog,
        variant
      }
    );
  }
  return /* @__PURE__ */ jsx(
    EntitiesSavedStates,
    {
      close: onClose,
      renderDialog,
      variant
    }
  );
};
function SavePanel() {
  const { query } = useLocation();
  const { canvas = "view" } = query;
  const { isSaveViewOpen, isDirty, isSaving } = useSelect((select) => {
    const {
      __experimentalGetDirtyEntityRecords,
      isSavingEntityRecord,
      isResolving
    } = select(coreStore);
    const dirtyEntityRecords = __experimentalGetDirtyEntityRecords();
    const isActivatingTheme = isResolving("activateTheme");
    const { isSaveViewOpened } = unlock(select(editSiteStore));
    return {
      isSaveViewOpen: isSaveViewOpened(),
      isDirty: dirtyEntityRecords.length > 0,
      isSaving: dirtyEntityRecords.some(
        (record) => isSavingEntityRecord(record.kind, record.name, record.key)
      ) || isActivatingTheme
    };
  }, []);
  const { setIsSaveViewOpened } = useDispatch(editSiteStore);
  const onClose = () => setIsSaveViewOpened(false);
  useEffect(() => {
    setIsSaveViewOpened(false);
  }, [canvas, setIsSaveViewOpened]);
  if (canvas === "view") {
    return isSaveViewOpen ? /* @__PURE__ */ jsx(
      Modal,
      {
        className: "edit-site-save-panel__modal",
        onRequestClose: onClose,
        title: __("Review changes"),
        size: "small",
        children: /* @__PURE__ */ jsx(_EntitiesSavedStates, { onClose, variant: "inline" })
      }
    ) : null;
  }
  const activateSaveEnabled = isPreviewingTheme() || isDirty;
  const disabled = isSaving || !activateSaveEnabled;
  return /* @__PURE__ */ jsxs(
    NavigableRegion,
    {
      className: clsx("edit-site-layout__actions", {
        "is-entity-save-view-open": isSaveViewOpen
      }),
      ariaLabel: __("Save panel"),
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: clsx("edit-site-editor__toggle-save-panel", {
              "screen-reader-text": isSaveViewOpen
            }),
            children: /* @__PURE__ */ jsx(
              Button,
              {
                __next40pxDefaultSize: true,
                variant: "secondary",
                className: "edit-site-editor__toggle-save-panel-button",
                onClick: () => setIsSaveViewOpened(true),
                "aria-haspopup": "dialog",
                disabled,
                accessibleWhenDisabled: true,
                children: __("Open save panel")
              }
            )
          }
        ),
        isSaveViewOpen && /* @__PURE__ */ jsx(_EntitiesSavedStates, { onClose, renderDialog: true })
      ]
    }
  );
}
export {
  SavePanel as default
};
//# sourceMappingURL=index.mjs.map
