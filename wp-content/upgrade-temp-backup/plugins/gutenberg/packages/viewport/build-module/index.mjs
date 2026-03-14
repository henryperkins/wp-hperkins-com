// packages/viewport/src/index.js
import addDimensionsEventListener from "./listener.mjs";
import { store } from "./store/index.mjs";
import { default as default2 } from "./if-viewport-matches.mjs";
import { default as default3 } from "./with-viewport-match.mjs";
var BREAKPOINTS = {
  huge: 1440,
  wide: 1280,
  large: 960,
  medium: 782,
  small: 600,
  mobile: 480
};
var OPERATORS = {
  "<": "max-width",
  ">=": "min-width"
};
addDimensionsEventListener(BREAKPOINTS, OPERATORS);
export {
  default2 as ifViewportMatches,
  store,
  default3 as withViewportMatch
};
//# sourceMappingURL=index.mjs.map
