// packages/editor/src/components/entities-saved-states/index.js
import clsx from "clsx";
import { Button, Flex, FlexItem } from "@wordpress/components";
import { __, _n, sprintf } from "@wordpress/i18n";
import {
  useCallback,
  useRef,
  createInterpolateElement
} from "@wordpress/element";
import {
  __experimentalUseDialog as useDialog,
  useInstanceId
} from "@wordpress/compose";
import { useDispatch } from "@wordpress/data";
import EntityTypeList from "./entity-type-list.mjs";
import { useIsDirty } from "./hooks/use-is-dirty.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function identity(values) {
  return values;
}
function EntitiesSavedStates({
  close,
  renderDialog,
  variant
}) {
  const isDirtyProps = useIsDirty();
  return /* @__PURE__ */ jsx(
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
  saveLabel = __("Save"),
  renderDialog,
  dirtyEntityRecords,
  isDirty,
  setUnselectedEntities,
  unselectedEntities,
  variant = "default",
  successNoticeContent
}) {
  const saveButtonRef = useRef();
  const { saveDirtyEntities } = unlock(useDispatch(editorStore));
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
  const dismissPanel = useCallback(() => close(), [close]);
  const [saveDialogRef, saveDialogProps] = useDialog({
    onClose: () => dismissPanel()
  });
  const dialogLabelId = useInstanceId(
    EntitiesSavedStatesExtensible,
    "entities-saved-states__panel-label"
  );
  const dialogDescriptionId = useInstanceId(
    EntitiesSavedStatesExtensible,
    "entities-saved-states__panel-description"
  );
  const selectItemsToSaveDescription = !!dirtyEntityRecords.length ? __("Select the items you want to save.") : void 0;
  const isInline = variant === "inline";
  const actionButtons = /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      FlexItem,
      {
        isBlock: isInline ? false : true,
        as: Button,
        variant: isInline ? "tertiary" : "secondary",
        size: isInline ? void 0 : "compact",
        onClick: dismissPanel,
        children: __("Cancel")
      }
    ),
    /* @__PURE__ */ jsx(
      FlexItem,
      {
        isBlock: isInline ? false : true,
        as: Button,
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
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: renderDialog ? saveDialogRef : void 0,
      ...renderDialog && saveDialogProps,
      className: clsx("entities-saved-states__panel", {
        "is-inline": isInline
      }),
      role: renderDialog ? "dialog" : void 0,
      "aria-labelledby": renderDialog ? dialogLabelId : void 0,
      "aria-describedby": renderDialog ? dialogDescriptionId : void 0,
      children: [
        !isInline && /* @__PURE__ */ jsx(Flex, { className: "entities-saved-states__panel-header", gap: 2, children: actionButtons }),
        /* @__PURE__ */ jsxs("div", { className: "entities-saved-states__text-prompt", children: [
          /* @__PURE__ */ jsx("div", { className: "entities-saved-states__text-prompt--header-wrapper", children: /* @__PURE__ */ jsx(
            "strong",
            {
              id: renderDialog ? dialogLabelId : void 0,
              className: "entities-saved-states__text-prompt--header",
              children: __("Are you ready to save?")
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { id: renderDialog ? dialogDescriptionId : void 0, children: [
            additionalPrompt,
            /* @__PURE__ */ jsx("p", { className: "entities-saved-states__text-prompt--changes-count", children: isDirty ? createInterpolateElement(
              sprintf(
                /* translators: %d: number of site changes waiting to be saved. */
                _n(
                  "There is <strong>%d site change</strong> waiting to be saved.",
                  "There are <strong>%d site changes</strong> waiting to be saved.",
                  dirtyEntityRecords.length
                ),
                dirtyEntityRecords.length
              ),
              { strong: /* @__PURE__ */ jsx("strong", {}) }
            ) : selectItemsToSaveDescription })
          ] })
        ] }),
        sortedPartitionedSavables.map((list) => {
          return /* @__PURE__ */ jsx(
            EntityTypeList,
            {
              list,
              unselectedEntities,
              setUnselectedEntities
            },
            list[0].name
          );
        }),
        isInline && /* @__PURE__ */ jsx(
          Flex,
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
export {
  EntitiesSavedStatesExtensible,
  EntitiesSavedStates as default
};
//# sourceMappingURL=index.mjs.map
