// packages/nux/src/index.js
import deprecated from "@wordpress/deprecated";
import { store } from "./store/index.mjs";
import { default as default2 } from "./components/dot-tip/index.mjs";
deprecated("wp.nux", {
  since: "5.4",
  hint: "wp.components.Guide can be used to show a user guide.",
  version: "6.2"
});
export {
  default2 as DotTip,
  store
};
//# sourceMappingURL=index.mjs.map
