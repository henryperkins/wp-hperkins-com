// packages/style-engine/src/styles/index.ts
import border from "./border/index.mjs";
import color from "./color/index.mjs";
import dimensions from "./dimensions/index.mjs";
import background from "./background/index.mjs";
import shadow from "./shadow/index.mjs";
import outline from "./outline/index.mjs";
import spacing from "./spacing/index.mjs";
import typography from "./typography/index.mjs";
var styleDefinitions = [
  ...border,
  ...color,
  ...dimensions,
  ...outline,
  ...spacing,
  ...typography,
  ...shadow,
  ...background
];
export {
  styleDefinitions
};
//# sourceMappingURL=index.mjs.map
