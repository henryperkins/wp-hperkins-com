// packages/edit-post/src/components/welcome-guide/index.js
import { useSelect } from "@wordpress/data";
import WelcomeGuideDefault from "./default.mjs";
import WelcomeGuideTemplate from "./template.mjs";
import { store as editPostStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
function WelcomeGuide({ postType }) {
  const { isActive, isEditingTemplate } = useSelect(
    (select) => {
      const { isFeatureActive } = select(editPostStore);
      const _isEditingTemplate = postType === "wp_template";
      const feature = _isEditingTemplate ? "welcomeGuideTemplate" : "welcomeGuide";
      return {
        isActive: isFeatureActive(feature),
        isEditingTemplate: _isEditingTemplate
      };
    },
    [postType]
  );
  if (!isActive) {
    return null;
  }
  return isEditingTemplate ? /* @__PURE__ */ jsx(WelcomeGuideTemplate, {}) : /* @__PURE__ */ jsx(WelcomeGuideDefault, {});
}
export {
  WelcomeGuide as default
};
//# sourceMappingURL=index.mjs.map
