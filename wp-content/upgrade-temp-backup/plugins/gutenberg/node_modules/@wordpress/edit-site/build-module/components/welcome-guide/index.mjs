// packages/edit-site/src/components/welcome-guide/index.js
import WelcomeGuideEditor from "./editor.mjs";
import WelcomeGuidePage from "./page.mjs";
import WelcomeGuideTemplate from "./template.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function WelcomeGuide({ postType }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(WelcomeGuideEditor, {}),
    postType === "page" && /* @__PURE__ */ jsx(WelcomeGuidePage, {}),
    postType === "wp_template" && /* @__PURE__ */ jsx(WelcomeGuideTemplate, {})
  ] });
}
export {
  WelcomeGuide as default
};
//# sourceMappingURL=index.mjs.map
