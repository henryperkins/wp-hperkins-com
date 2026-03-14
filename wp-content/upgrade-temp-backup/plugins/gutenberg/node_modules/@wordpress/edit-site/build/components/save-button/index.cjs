"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/edit-site/src/components/save-button/index.js
var save_button_exports = {};
__export(save_button_exports, {
  default: () => SaveButton
});
module.exports = __toCommonJS(save_button_exports);
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_core_data = require("@wordpress/core-data");
var import_keycodes = require("@wordpress/keycodes");
var import_router = require("@wordpress/router");
var import_editor = require("@wordpress/editor");
var import_store = require("../../store/index.cjs");
var import_is_previewing_theme = require("../../utils/is-previewing-theme.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useLocation } = (0, import_lock_unlock.unlock)(import_router.privateApis);
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
  const { setIsSaveViewOpened } = (0, import_data.useDispatch)(import_store.store);
  const { saveDirtyEntities } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_editor.store));
  const { dirtyEntityRecords } = (0, import_editor.useEntitiesSavedStatesIsDirty)();
  const { isSaving, isSaveViewOpen, previewingThemeName } = (0, import_data.useSelect)(
    (select) => {
      const { isSavingEntityRecord, isResolving } = select(import_core_data.store);
      const { isSaveViewOpened } = select(import_store.store);
      const isActivatingTheme = isResolving("activateTheme");
      const currentlyPreviewingThemeId = (0, import_is_previewing_theme.currentlyPreviewingTheme)();
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
        previewingThemeName: currentlyPreviewingThemeId ? select(import_core_data.store).getTheme(currentlyPreviewingThemeId)?.name?.rendered : void 0
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
  const disabled = isSaving || !hasDirtyEntities && !(0, import_is_previewing_theme.isPreviewingTheme)();
  const getLabel = () => {
    if ((0, import_is_previewing_theme.isPreviewingTheme)()) {
      if (isSaving) {
        return (0, import_i18n.sprintf)(
          /* translators: %s: The name of theme to be activated. */
          (0, import_i18n.__)("Activating %s"),
          previewingThemeName
        );
      } else if (disabled) {
        return (0, import_i18n.__)("Saved");
      } else if (hasDirtyEntities) {
        return (0, import_i18n.sprintf)(
          /* translators: %s: The name of theme to be activated. */
          (0, import_i18n.__)("Activate %s & Save"),
          previewingThemeName
        );
      }
      return (0, import_i18n.sprintf)(
        /* translators: %s: The name of theme to be activated. */
        (0, import_i18n.__)("Activate %s"),
        previewingThemeName
      );
    }
    if (isSaving) {
      return (0, import_i18n.__)("Saving");
    }
    if (disabled) {
      return (0, import_i18n.__)("Saved");
    }
    if (!isOnlyCurrentEntityDirty && showReviewMessage) {
      return (0, import_i18n.sprintf)(
        // translators: %d: number of unsaved changes (number).
        (0, import_i18n._n)(
          "Review %d change\u2026",
          "Review %d changes\u2026",
          dirtyEntityRecords.length
        ),
        dirtyEntityRecords.length
      );
    }
    return (0, import_i18n.__)("Save");
  };
  const label = getLabel();
  const onClick = isOnlyCurrentEntityDirty ? () => saveDirtyEntities({ dirtyEntityRecords }) : () => setIsSaveViewOpened(true);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Button,
    {
      variant,
      className,
      "aria-disabled": disabled,
      "aria-expanded": isSaveViewOpen,
      isBusy: isSaving,
      onClick: disabled ? void 0 : onClick,
      label,
      shortcut: disabled ? void 0 : import_keycodes.displayShortcut.primary("s"),
      showTooltip,
      icon,
      __next40pxDefaultSize,
      size,
      children: label
    }
  );
}
//# sourceMappingURL=index.cjs.map
