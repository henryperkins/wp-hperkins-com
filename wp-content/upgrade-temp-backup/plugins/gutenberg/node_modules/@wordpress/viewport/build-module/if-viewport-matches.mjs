// packages/viewport/src/if-viewport-matches.js
import {
  ifCondition,
  compose,
  createHigherOrderComponent
} from "@wordpress/compose";
import withViewportMatch from "./with-viewport-match.mjs";
var ifViewportMatches = (query) => createHigherOrderComponent(
  compose([
    withViewportMatch({
      isViewportMatch: query
    }),
    ifCondition((props) => props.isViewportMatch)
  ]),
  "ifViewportMatches"
);
var if_viewport_matches_default = ifViewportMatches;
export {
  if_viewport_matches_default as default
};
//# sourceMappingURL=if-viewport-matches.mjs.map
