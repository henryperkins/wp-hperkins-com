// packages/block-library/src/math/index.js
import { math as icon } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import edit from "./edit.mjs";
import metadata from "./block.json";
import save from "./save.mjs";
import deprecated from "./deprecated.mjs";
var { name } = metadata;
var settings = {
  icon,
  example: {
    attributes: {
      latex: "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}",
      mathML: '<semantics><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo lspace="0em" rspace="0em">\u2212</mo><mi>b</mi><mo>\xB1</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>\u2212</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}</annotation></semantics>'
    },
    viewportWidth: 300
  },
  edit,
  save,
  deprecated
};
var init = () => initBlock({ name, metadata, settings });
export {
  init,
  metadata,
  name,
  settings
};
//# sourceMappingURL=index.mjs.map
