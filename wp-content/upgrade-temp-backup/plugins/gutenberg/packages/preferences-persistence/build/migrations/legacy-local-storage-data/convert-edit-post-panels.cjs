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

// packages/preferences-persistence/src/migrations/legacy-local-storage-data/convert-edit-post-panels.js
var convert_edit_post_panels_exports = {};
__export(convert_edit_post_panels_exports, {
  default: () => convertEditPostPanels
});
module.exports = __toCommonJS(convert_edit_post_panels_exports);
function convertEditPostPanels(preferences) {
  const panels = preferences?.panels ?? {};
  return Object.keys(panels).reduce(
    (convertedData, panelName) => {
      const panel = panels[panelName];
      if (panel?.enabled === false) {
        convertedData.inactivePanels.push(panelName);
      }
      if (panel?.opened === true) {
        convertedData.openPanels.push(panelName);
      }
      return convertedData;
    },
    { inactivePanels: [], openPanels: [] }
  );
}
//# sourceMappingURL=convert-edit-post-panels.cjs.map
