// packages/editor/src/components/post-sticky/panel.js
import PostPanelRow from "../post-panel-row/index.mjs";
import PostStickyForm from "./index.mjs";
import PostStickyCheck from "./check.mjs";
import { jsx } from "react/jsx-runtime";
function PostStickyPanel() {
  return /* @__PURE__ */ jsx(PostStickyCheck, { children: /* @__PURE__ */ jsx(PostPanelRow, { children: /* @__PURE__ */ jsx(PostStickyForm, {}) }) });
}
var panel_default = PostStickyPanel;
export {
  PostStickyPanel,
  panel_default as default
};
//# sourceMappingURL=panel.mjs.map
