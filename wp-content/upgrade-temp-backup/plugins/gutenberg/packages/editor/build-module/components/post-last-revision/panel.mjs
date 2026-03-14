// packages/editor/src/components/post-last-revision/panel.js
import { PanelBody } from "@wordpress/components";
import PostLastRevision from "./index.mjs";
import PostLastRevisionCheck from "./check.mjs";
import { jsx } from "react/jsx-runtime";
function PostLastRevisionPanel() {
  return /* @__PURE__ */ jsx(PostLastRevisionCheck, { children: /* @__PURE__ */ jsx(PanelBody, { className: "editor-post-last-revision__panel", children: /* @__PURE__ */ jsx(PostLastRevision, {}) }) });
}
var panel_default = PostLastRevisionPanel;
export {
  panel_default as default
};
//# sourceMappingURL=panel.mjs.map
