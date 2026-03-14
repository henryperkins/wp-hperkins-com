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

// packages/editor/src/components/entities-saved-states/index.js
var entities_saved_states_exports = {};
__export(entities_saved_states_exports, {
  EntitiesSavedStatesExtensible: () => EntitiesSavedStatesExtensible,
  default: () => EntitiesSavedStates
});
module.exports = __toCommonJS(entities_saved_states_exports);
var import_clsx = __toESM(require("clsx"));
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_compose = require("@wordpress/compose");
var import_data = require("@wordpress/data");
var import_entity_type_list = __toESM(require("./entity-type-list.cjs"));
var import_use_is_dirty = require("./hooks/use-is-dirty.cjs");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function identity(values) {
  return values;
}
function EntitiesSavedStates({
  close,
  renderDialog,
  variant
}) {
  const isDirtyProps = (0, import_use_is_dirty.useIsDirty)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    EntitiesSavedStatesExtensible,
    {
      close,
      renderDialog,
      variant,
      ...isDirtyProps
    }
  );
}
function EntitiesSavedStatesExtensible({
  additionalPrompt = void 0,
  close,
  onSave = identity,
  saveEnabled: saveEnabledProp = void 0,
  saveLabel = (0, import_i18n.__)("Save"),
  renderDialog,
  dirtyEntityRecords,
  isDirty,
  setUnselectedEntities,
  unselectedEntities,
  variant = "default",
  successNoticeContent
}) {
  const saveButtonRef = (0, import_element.useRef)();
  const { saveDirtyEntities } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_store.store));
  const partitionedSavables = dirtyEntityRecords.reduce((acc, record) => {
    const { name } = record;
    if (!acc[name]) {
      acc[name] = [];
    }
    acc[name].push(record);
    return acc;
  }, {});
  const {
    site: siteSavables,
    wp_template: templateSavables,
    wp_template_part: templatePartSavables,
    ...contentSavables
  } = partitionedSavables;
  const sortedPartitionedSavables = [
    siteSavables,
    templateSavables,
    templatePartSavables,
    ...Object.values(contentSavables)
  ].filter(Array.isArray);
  const saveEnabled = saveEnabledProp ?? isDirty;
  const dismissPanel = (0, import_element.useCallback)(() => close(), [close]);
  const [saveDialogRef, saveDialogProps] = (0, import_compose.__experimentalUseDialog)({
    onClose: () => dismissPanel()
  });
  const dialogLabelId = (0, import_compose.useInstanceId)(
    EntitiesSavedStatesExtensible,
    "entities-saved-states__panel-label"
  );
  const dialogDescriptionId = (0, import_compose.useInstanceId)(
    EntitiesSavedStatesExtensible,
    "entities-saved-states__panel-description"
  );
  const selectItemsToSaveDescription = !!dirtyEntityRecords.length ? (0, import_i18n.__)("Select the items you want to save.") : void 0;
  const isInline = variant === "inline";
  const actionButtons = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.FlexItem,
      {
        isBlock: isInline ? false : true,
        as: import_components.Button,
        variant: isInline ? "tertiary" : "secondary",
        size: isInline ? void 0 : "compact",
        onClick: dismissPanel,
        children: (0, import_i18n.__)("Cancel")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.FlexItem,
      {
        isBlock: isInline ? false : true,
        as: import_components.Button,
        ref: saveButtonRef,
        variant: "primary",
        size: isInline ? void 0 : "compact",
        disabled: !saveEnabled,
        accessibleWhenDisabled: true,
        onClick: () => saveDirtyEntities({
          onSave,
          dirtyEntityRecords,
          entitiesToSkip: unselectedEntities,
          close,
          successNoticeContent
        }),
        className: "editor-entities-saved-states__save-button",
        children: saveLabel
      }
    )
  ] });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      ref: renderDialog ? saveDialogRef : void 0,
      ...renderDialog && saveDialogProps,
      className: (0, import_clsx.default)("entities-saved-states__panel", {
        "is-inline": isInline
      }),
      role: renderDialog ? "dialog" : void 0,
      "aria-labelledby": renderDialog ? dialogLabelId : void 0,
      "aria-describedby": renderDialog ? dialogDescriptionId : void 0,
      children: [
        !isInline && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Flex, { className: "entities-saved-states__panel-header", gap: 2, children: actionButtons }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "entities-saved-states__text-prompt", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "entities-saved-states__text-prompt--header-wrapper", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "strong",
            {
              id: renderDialog ? dialogLabelId : void 0,
              className: "entities-saved-states__text-prompt--header",
              children: (0, import_i18n.__)("Are you ready to save?")
            }
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { id: renderDialog ? dialogDescriptionId : void 0, children: [
            additionalPrompt,
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "entities-saved-states__text-prompt--changes-count", children: isDirty ? (0, import_element.createInterpolateElement)(
              (0, import_i18n.sprintf)(
                /* translators: %d: number of site changes waiting to be saved. */
                (0, import_i18n._n)(
                  "There is <strong>%d site change</strong> waiting to be saved.",
                  "There are <strong>%d site changes</strong> waiting to be saved.",
                  dirtyEntityRecords.length
                ),
                dirtyEntityRecords.length
              ),
              { strong: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {}) }
            ) : selectItemsToSaveDescription })
          ] })
        ] }),
        sortedPartitionedSavables.map((list) => {
          return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_entity_type_list.default,
            {
              list,
              unselectedEntities,
              setUnselectedEntities
            },
            list[0].name
          );
        }),
        isInline && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Flex,
          {
            direction: "row",
            justify: "flex-end",
            className: "entities-saved-states__panel-footer",
            children: actionButtons
          }
        )
      ]
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EntitiesSavedStatesExtensible
});
//# sourceMappingURL=index.cjs.map
