// packages/block-library/src/button/utils.js
function isPercentageWidth(width) {
  return typeof width === "string" && width.endsWith("%");
}
function getWidthClasses(width) {
  if (!width) {
    return {};
  }
  if (isPercentageWidth(width)) {
    const legacyWidthClasses = {
      "25%": "wp-block-button__width-25",
      "50%": "wp-block-button__width-50",
      "75%": "wp-block-button__width-75",
      "100%": "wp-block-button__width-100"
    };
    return {
      "has-custom-width": true,
      "wp-block-button__width": true,
      // Maintain legacy class for backwards compatibility.
      ...legacyWidthClasses[width] && {
        [legacyWidthClasses[width]]: true
      }
    };
  }
  return {
    "has-custom-width": true
  };
}
export {
  getWidthClasses,
  isPercentageWidth
};
//# sourceMappingURL=utils.mjs.map
