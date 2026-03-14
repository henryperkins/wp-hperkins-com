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

// packages/block-editor/src/components/use-list-view-panel-state/index.js
var use_list_view_panel_state_exports = {};
__export(use_list_view_panel_state_exports, {
  default: () => useListViewPanelState
});
module.exports = __toCommonJS(use_list_view_panel_state_exports);
var import_data = require("@wordpress/data");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
function useListViewPanelState(clientId) {
  const { isOpened, expandRevision } = (0, import_data.useSelect)(
    (select) => {
      const { isListViewPanelOpened, getListViewExpandRevision } = (0, import_lock_unlock.unlock)(
        select(import_store.store)
      );
      return {
        isOpened: isListViewPanelOpened(clientId),
        expandRevision: getListViewExpandRevision()
      };
    },
    [clientId]
  );
  const { __unstableToggleListViewPanel: toggleListViewPanel } = (0, import_data.useDispatch)(import_store.store);
  const handleToggle = (opened) => {
    toggleListViewPanel(clientId, opened);
  };
  return {
    isOpened,
    expandRevision,
    handleToggle
  };
}
//# sourceMappingURL=index.cjs.map
