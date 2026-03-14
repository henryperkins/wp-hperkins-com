// packages/block-editor/src/hooks/use-shadow-props.js
import { getInlineStyles } from "./style.mjs";
function getShadowClassesAndStyles(attributes) {
  const shadow = attributes.style?.shadow || "";
  return {
    style: getInlineStyles({ shadow })
  };
}
export {
  getShadowClassesAndStyles
};
//# sourceMappingURL=use-shadow-props.mjs.map
