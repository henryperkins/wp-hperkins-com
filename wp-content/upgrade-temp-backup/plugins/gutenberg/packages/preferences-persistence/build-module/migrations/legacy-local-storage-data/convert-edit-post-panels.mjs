// packages/preferences-persistence/src/migrations/legacy-local-storage-data/convert-edit-post-panels.js
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
export {
  convertEditPostPanels as default
};
//# sourceMappingURL=convert-edit-post-panels.mjs.map
