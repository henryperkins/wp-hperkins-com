// packages/editor/src/components/save-publish-panels/index.js
import { useSelect, useDispatch } from "@wordpress/data";
import { Button, createSlotFill } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useCallback } from "@wordpress/element";
import EntitiesSavedStates from "../entities-saved-states/index.mjs";
import PostPublishPanel from "../post-publish-panel/index.mjs";
import PluginPrePublishPanel from "../plugin-pre-publish-panel/index.mjs";
import PluginPostPublishPanel from "../plugin-post-publish-panel/index.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { Fill, Slot } = createSlotFill("ActionsPanel");
var ActionsPanelFill = Fill;
function SavePublishPanels({
  setEntitiesSavedStatesCallback,
  closeEntitiesSavedStates,
  isEntitiesSavedStatesOpen,
  forceIsDirtyPublishPanel
}) {
  const { closePublishSidebar, togglePublishSidebar } = useDispatch(editorStore);
  const {
    publishSidebarOpened,
    isPublishable,
    isDirty,
    hasOtherEntitiesChanges
  } = useSelect((select) => {
    const {
      isPublishSidebarOpened,
      isEditedPostPublishable,
      isCurrentPostPublished,
      isEditedPostDirty,
      hasNonPostEntityChanges
    } = select(editorStore);
    const _hasOtherEntitiesChanges = hasNonPostEntityChanges();
    return {
      publishSidebarOpened: isPublishSidebarOpened(),
      isPublishable: !isCurrentPostPublished() && isEditedPostPublishable(),
      isDirty: _hasOtherEntitiesChanges || isEditedPostDirty(),
      hasOtherEntitiesChanges: _hasOtherEntitiesChanges
    };
  }, []);
  const openEntitiesSavedStates = useCallback(
    () => setEntitiesSavedStatesCallback(true),
    []
  );
  let unmountableContent;
  if (publishSidebarOpened) {
    unmountableContent = /* @__PURE__ */ jsx(
      PostPublishPanel,
      {
        onClose: closePublishSidebar,
        forceIsDirty: forceIsDirtyPublishPanel,
        PrePublishExtension: PluginPrePublishPanel.Slot,
        PostPublishExtension: PluginPostPublishPanel.Slot
      }
    );
  } else if (isPublishable && !hasOtherEntitiesChanges) {
    unmountableContent = /* @__PURE__ */ jsx("div", { className: "editor-layout__toggle-publish-panel", children: /* @__PURE__ */ jsx(
      Button,
      {
        __next40pxDefaultSize: true,
        variant: "secondary",
        onClick: togglePublishSidebar,
        "aria-expanded": false,
        children: __("Open publish panel")
      }
    ) });
  } else {
    unmountableContent = /* @__PURE__ */ jsx("div", { className: "editor-layout__toggle-entities-saved-states-panel", children: /* @__PURE__ */ jsx(
      Button,
      {
        __next40pxDefaultSize: true,
        variant: "secondary",
        onClick: openEntitiesSavedStates,
        "aria-expanded": false,
        "aria-haspopup": "dialog",
        disabled: !isDirty,
        accessibleWhenDisabled: true,
        children: __("Open save panel")
      }
    ) });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    isEntitiesSavedStatesOpen && /* @__PURE__ */ jsx(
      EntitiesSavedStates,
      {
        close: closeEntitiesSavedStates,
        renderDialog: true
      }
    ),
    /* @__PURE__ */ jsx(Slot, { bubblesVirtually: true }),
    !isEntitiesSavedStatesOpen && unmountableContent
  ] });
}
export {
  ActionsPanelFill,
  SavePublishPanels as default
};
//# sourceMappingURL=index.mjs.map
