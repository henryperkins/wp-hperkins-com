// packages/block-editor/src/layouts/index.js
import flex from "./flex.mjs";
import flow from "./flow.mjs";
import constrained from "./constrained.mjs";
import grid from "./grid.mjs";
var layoutTypes = [flow, flex, constrained, grid];
function getLayoutType(name = "default") {
  return layoutTypes.find((layoutType) => layoutType.name === name);
}
function getLayoutTypes() {
  return layoutTypes;
}
export {
  getLayoutType,
  getLayoutTypes
};
//# sourceMappingURL=index.mjs.map
