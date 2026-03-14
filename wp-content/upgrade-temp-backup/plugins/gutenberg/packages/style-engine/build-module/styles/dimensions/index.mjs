// packages/style-engine/src/styles/dimensions/index.ts
import { generateRule } from "../utils.mjs";
var height = {
  name: "height",
  generate: (style, options) => {
    return generateRule(
      style,
      options,
      ["dimensions", "height"],
      "height"
    );
  }
};
var minHeight = {
  name: "minHeight",
  generate: (style, options) => {
    return generateRule(
      style,
      options,
      ["dimensions", "minHeight"],
      "minHeight"
    );
  }
};
var aspectRatio = {
  name: "aspectRatio",
  generate: (style, options) => {
    return generateRule(
      style,
      options,
      ["dimensions", "aspectRatio"],
      "aspectRatio"
    );
  }
};
var width = {
  name: "width",
  generate: (style, options) => {
    return generateRule(
      style,
      options,
      ["dimensions", "width"],
      "width"
    );
  }
};
var dimensions_default = [height, minHeight, aspectRatio, width];
export {
  dimensions_default as default
};
//# sourceMappingURL=index.mjs.map
