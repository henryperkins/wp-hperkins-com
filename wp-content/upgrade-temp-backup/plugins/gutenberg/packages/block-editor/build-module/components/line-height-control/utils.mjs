// packages/block-editor/src/components/line-height-control/utils.js
var BASE_DEFAULT_VALUE = 1.5;
var STEP = 0.01;
var SPIN_FACTOR = 10;
var RESET_VALUE = "";
function isLineHeightDefined(lineHeight) {
  return lineHeight !== void 0 && lineHeight !== RESET_VALUE;
}
export {
  BASE_DEFAULT_VALUE,
  RESET_VALUE,
  SPIN_FACTOR,
  STEP,
  isLineHeightDefined
};
//# sourceMappingURL=utils.mjs.map
