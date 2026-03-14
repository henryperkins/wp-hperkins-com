"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/edit-site/src/components/save-panel/index.js
var save_panel_exports = {};
__export(save_panel_exports, {
  default: () => SavePanel
});
module.exports = __toCommonJS(save_panel_exports);
var import_clsx = __toESM(require("clsx"));
var import_admin_ui = require("@wordpress/admin-ui");
var import_components = require("@wordpress/components");
var import_editor = require("@wordpress/editor");
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_core_data = require("@wordpress/core-data");
var import_router = require("@wordpress/router");
var import_element = require("@wordpress/element");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_use_activate_theme = require("../../utils/use-activate-theme.cjs");
var import_use_actual_current_theme = require("../../utils/use-actual-current-theme.cjs");
var import_is_previewing_theme = require("../../utils/is-previewing-theme.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { EntitiesSavedStatesExtensible } = (0, import_lock_unlock.unlock)(import_editor.privateApis);
var { useLocation } = (0, import_lock_unlock.unlock)(import_router.privateApis);
var EntitiesSavedStatesForPreview = ({
  onClose,
  renderDialog,
  variant
}) => {
  const isDirtyProps = (0, import_editor.useEntitiesSavedStatesIsDirty)();
  let activateSaveLabel, successNoticeContent;
  if (isDirtyProps.isDirty) {
    activateSaveLabel = (0, import_i18n.__)("Activate & Save");
    successNoticeContent = (0, import_i18n.__)("Theme activated and site updated.");
  } else {
    activateSaveLabel = (0, import_i18n.__)("Activate");
    successNoticeContent = (0, import_i18n.__)("Theme activated.");
  }
  const currentTheme = (0, import_use_actual_current_theme.useActualCurrentTheme)();
  const previewingTheme = (0, import_data.useSelect)(
    (select) => select(import_core_data.store).getCurrentTheme(),
    []
  );
  const additionalPrompt = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: (0, import_i18n.sprintf)(
    /* translators: 1: The name of active theme, 2: The name of theme to be activated. */
    (0, import_i18n.__)(
      "Saving your changes will change your active theme from %1$s to %2$s."
    ),
    currentTheme?.name?.rendered ?? "...",
    previewingTheme?.name?.rendered ?? "..."
  ) });
  const activateTheme = (0, import_use_activate_theme.useActivateTheme)();
  const onSave = async (values) => {
    await activateTheme();
    return values;
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
  if ((0, import_is_previewing_theme.isPreviewingTheme)()) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      EntitiesSavedStatesForPreview,
      {
        onClose,
        renderDialog,
        variant
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_editor.EntitiesSavedStates,
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
  const { isSaveViewOpen, isDirty, isSaving } = (0, import_data.useSelect)((select) => {
    const {
      __experimentalGetDirtyEntityRecords,
      isSavingEntityRecord,
      isResolving
    } = select(import_core_data.store);
    const dirtyEntityRecords = __experimentalGetDirtyEntityRecords();
    const isActivatingTheme = isResolving("activateTheme");
    const { isSaveViewOpened } = (0, import_lock_unlock.unlock)(select(import_store.store));
    return {
      isSaveViewOpen: isSaveViewOpened(),
      isDirty: dirtyEntityRecords.length > 0,
      isSaving: dirtyEntityRecords.some(
        (record) => isSavingEntityRecord(record.kind, record.name, record.key)
      ) || isActivatingTheme
    };
  }, []);
  const { setIsSaveViewOpened } = (0, import_data.useDispatch)(import_store.store);
  const onClose = () => setIsSaveViewOpened(false);
  (0, import_element.useEffect)(() => {
    setIsSaveViewOpened(false);
  }, [canvas, setIsSaveViewOpened]);
  if (canvas === "view") {
    return isSaveViewOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Modal,
      {
        className: "edit-site-save-panel__modal",
        onRequestClose: onClose,
        title: (0, import_i18n.__)("Review changes"),
        size: "small",
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_EntitiesSavedStates, { onClose, variant: "inline" })
      }
    ) : null;
  }
  const activateSaveEnabled = (0, import_is_previewing_theme.isPreviewingTheme)() || isDirty;
  const disabled = isSaving || !activateSaveEnabled;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_admin_ui.NavigableRegion,
    {
      className: (0, import_clsx.default)("edit-site-layout__actions", {
        "is-entity-save-view-open": isSaveViewOpen
      }),
      ariaLabel: (0, import_i18n.__)("Save panel"),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "div",
          {
            className: (0, import_clsx.default)("edit-site-editor__toggle-save-panel", {
              "screen-reader-text": isSaveViewOpen
            }),
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.Button,
              {
                __next40pxDefaultSize: true,
                variant: "secondary",
                className: "edit-site-editor__toggle-save-panel-button",
                onClick: () => setIsSaveViewOpened(true),
                "aria-haspopup": "dialog",
                disabled,
                accessibleWhenDisabled: true,
                children: (0, import_i18n.__)("Open save panel")
              }
            )
          }
        ),
        isSaveViewOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_EntitiesSavedStates, { onClose, renderDialog: true })
      ]
    }
  );
}
//# sourceMappingURL=index.cjs.map
