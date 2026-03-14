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

// packages/editor/src/components/save-publish-panels/index.js
var save_publish_panels_exports = {};
__export(save_publish_panels_exports, {
  ActionsPanelFill: () => ActionsPanelFill,
  default: () => SavePublishPanels
});
module.exports = __toCommonJS(save_publish_panels_exports);
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_entities_saved_states = __toESM(require("../entities-saved-states/index.cjs"));
var import_post_publish_panel = __toESM(require("../post-publish-panel/index.cjs"));
var import_plugin_pre_publish_panel = __toESM(require("../plugin-pre-publish-panel/index.cjs"));
var import_plugin_post_publish_panel = __toESM(require("../plugin-post-publish-panel/index.cjs"));
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { Fill, Slot } = (0, import_components.createSlotFill)("ActionsPanel");
var ActionsPanelFill = Fill;
function SavePublishPanels({
  setEntitiesSavedStatesCallback,
  closeEntitiesSavedStates,
  isEntitiesSavedStatesOpen,
  forceIsDirtyPublishPanel
}) {
  const { closePublishSidebar, togglePublishSidebar } = (0, import_data.useDispatch)(import_store.store);
  const {
    publishSidebarOpened,
    isPublishable,
    isDirty,
    hasOtherEntitiesChanges
  } = (0, import_data.useSelect)((select) => {
    const {
      isPublishSidebarOpened,
      isEditedPostPublishable,
      isCurrentPostPublished,
      isEditedPostDirty,
      hasNonPostEntityChanges
    } = select(import_store.store);
    const _hasOtherEntitiesChanges = hasNonPostEntityChanges();
    return {
      publishSidebarOpened: isPublishSidebarOpened(),
      isPublishable: !isCurrentPostPublished() && isEditedPostPublishable(),
      isDirty: _hasOtherEntitiesChanges || isEditedPostDirty(),
      hasOtherEntitiesChanges: _hasOtherEntitiesChanges
    };
  }, []);
  const openEntitiesSavedStates = (0, import_element.useCallback)(
    () => setEntitiesSavedStatesCallback(true),
    []
  );
  let unmountableContent;
  if (publishSidebarOpened) {
    unmountableContent = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_post_publish_panel.default,
      {
        onClose: closePublishSidebar,
        forceIsDirty: forceIsDirtyPublishPanel,
        PrePublishExtension: import_plugin_pre_publish_panel.default.Slot,
        PostPublishExtension: import_plugin_post_publish_panel.default.Slot
      }
    );
  } else if (isPublishable && !hasOtherEntitiesChanges) {
    unmountableContent = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-layout__toggle-publish-panel", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Button,
      {
        __next40pxDefaultSize: true,
        variant: "secondary",
        onClick: togglePublishSidebar,
        "aria-expanded": false,
        children: (0, import_i18n.__)("Open publish panel")
      }
    ) });
  } else {
    unmountableContent = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-layout__toggle-entities-saved-states-panel", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Button,
      {
        __next40pxDefaultSize: true,
        variant: "secondary",
        onClick: openEntitiesSavedStates,
        "aria-expanded": false,
        "aria-haspopup": "dialog",
        disabled: !isDirty,
        accessibleWhenDisabled: true,
        children: (0, import_i18n.__)("Open save panel")
      }
    ) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    isEntitiesSavedStatesOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_entities_saved_states.default,
      {
        close: closeEntitiesSavedStates,
        renderDialog: true
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slot, { bubblesVirtually: true }),
    !isEntitiesSavedStatesOpen && unmountableContent
  ] });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ActionsPanelFill
});
//# sourceMappingURL=index.cjs.map
