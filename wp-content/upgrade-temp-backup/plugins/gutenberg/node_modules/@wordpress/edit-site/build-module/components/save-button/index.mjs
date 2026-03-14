// packages/edit-site/src/components/save-button/index.js
import { useSelect, useDispatch } from "@wordpress/data";
import { Button } from "@wordpress/components";
import { __, _n, sprintf } from "@wordpress/i18n";
import { store as coreStore } from "@wordpress/core-data";
import { displayShortcut } from "@wordpress/keycodes";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import {
  useEntitiesSavedStatesIsDirty,
  store as editorStore
} from "@wordpress/editor";
import { store as editSiteStore } from "../../store/index.mjs";
import {
  currentlyPreviewingTheme,
  isPreviewingTheme
} from "../../utils/is-previewing-theme.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var { useLocation } = unlock(routerPrivateApis);
function SaveButton({
  className = "edit-site-save-button__button",
  variant = "primary",
  showTooltip = true,
  showReviewMessage,
  icon,
  size,
  __next40pxDefaultSize = false
}) {
  const { params } = useLocation();
  const { setIsSaveViewOpened } = useDispatch(editSiteStore);
  const { saveDirtyEntities } = unlock(useDispatch(editorStore));
  const { dirtyEntityRecords } = useEntitiesSavedStatesIsDirty();
  const { isSaving, isSaveViewOpen, previewingThemeName } = useSelect(
    (select) => {
      const { isSavingEntityRecord, isResolving } = select(coreStore);
      const { isSaveViewOpened } = select(editSiteStore);
      const isActivatingTheme = isResolving("activateTheme");
      const currentlyPreviewingThemeId = currentlyPreviewingTheme();
      return {
        isSaving: dirtyEntityRecords.some(
          (record) => isSavingEntityRecord(
            record.kind,
            record.name,
            record.key
          )
        ) || isActivatingTheme,
        isSaveViewOpen: isSaveViewOpened(),
        // Do not call `getTheme` with null, it will cause a request to
        // the server.
        previewingThemeName: currentlyPreviewingThemeId ? select(coreStore).getTheme(currentlyPreviewingThemeId)?.name?.rendered : void 0
      };
    },
    [dirtyEntityRecords]
  );
  const hasDirtyEntities = !!dirtyEntityRecords.length;
  let isOnlyCurrentEntityDirty;
  if (dirtyEntityRecords.length === 1) {
    if (params.postId) {
      isOnlyCurrentEntityDirty = `${dirtyEntityRecords[0].key}` === params.postId && dirtyEntityRecords[0].name === params.postType;
    } else if (params.path?.includes("wp_global_styles")) {
      isOnlyCurrentEntityDirty = dirtyEntityRecords[0].name === "globalStyles";
    }
  }
  const disabled = isSaving || !hasDirtyEntities && !isPreviewingTheme();
  const getLabel = () => {
    if (isPreviewingTheme()) {
      if (isSaving) {
        return sprintf(
          /* translators: %s: The name of theme to be activated. */
          __("Activating %s"),
          previewingThemeName
        );
      } else if (disabled) {
        return __("Saved");
      } else if (hasDirtyEntities) {
        return sprintf(
          /* translators: %s: The name of theme to be activated. */
          __("Activate %s & Save"),
          previewingThemeName
        );
      }
      return sprintf(
        /* translators: %s: The name of theme to be activated. */
        __("Activate %s"),
        previewingThemeName
      );
    }
    if (isSaving) {
      return __("Saving");
    }
    if (disabled) {
      return __("Saved");
    }
    if (!isOnlyCurrentEntityDirty && showReviewMessage) {
      return sprintf(
        // translators: %d: number of unsaved changes (number).
        _n(
          "Review %d change\u2026",
          "Review %d changes\u2026",
          dirtyEntityRecords.length
        ),
        dirtyEntityRecords.length
      );
    }
    return __("Save");
  };
  const label = getLabel();
  const onClick = isOnlyCurrentEntityDirty ? () => saveDirtyEntities({ dirtyEntityRecords }) : () => setIsSaveViewOpened(true);
  return /* @__PURE__ */ jsx(
    Button,
    {
      variant,
      className,
      "aria-disabled": disabled,
      "aria-expanded": isSaveViewOpen,
      isBusy: isSaving,
      onClick: disabled ? void 0 : onClick,
      label,
      shortcut: disabled ? void 0 : displayShortcut.primary("s"),
      showTooltip,
      icon,
      __next40pxDefaultSize,
      size,
      children: label
    }
  );
}
export {
  SaveButton as default
};
//# sourceMappingURL=index.mjs.map
