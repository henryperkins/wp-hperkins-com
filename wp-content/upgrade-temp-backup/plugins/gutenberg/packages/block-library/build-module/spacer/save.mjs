// packages/block-library/src/spacer/save.js
import { useBlockProps, getSpacingPresetCssVar } from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
function save({ attributes }) {
  const { height, width, style } = attributes;
  const { layout: { selfStretch } = {} } = style || {};
  const finalHeight = selfStretch === "fill" || selfStretch === "fit" ? void 0 : height;
  return /* @__PURE__ */ jsx(
    "div",
    {
      ...useBlockProps.save({
        style: {
          height: getSpacingPresetCssVar(finalHeight),
          width: getSpacingPresetCssVar(width)
        },
        "aria-hidden": true
      })
    }
  );
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
