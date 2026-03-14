// packages/editor/src/components/post-template/panel.js
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { store as editorStore } from "../../store/index.mjs";
import ClassicThemeControl from "./classic-theme.mjs";
import BlockThemeControl from "./block-theme.mjs";
import { jsx } from "react/jsx-runtime";
function PostTemplatePanel() {
  const { templateId, isBlockTheme } = useSelect((select) => {
    const { getCurrentTemplateId, getEditorSettings } = select(editorStore);
    return {
      templateId: getCurrentTemplateId(),
      isBlockTheme: getEditorSettings().__unstableIsBlockBasedTheme
    };
  }, []);
  const isVisible = useSelect((select) => {
    const postTypeSlug = select(editorStore).getCurrentPostType();
    const postType = select(coreStore).getPostType(postTypeSlug);
    if (!postType?.viewable) {
      return false;
    }
    const settings = select(editorStore).getEditorSettings();
    const hasTemplates = !!settings.availableTemplates && Object.keys(settings.availableTemplates).length > 0;
    if (hasTemplates) {
      return true;
    }
    if (!settings.supportsTemplateMode) {
      return false;
    }
    const canCreateTemplates = select(coreStore).canUser("create", {
      kind: "postType",
      name: "wp_template"
    }) ?? false;
    return canCreateTemplates;
  }, []);
  const canViewTemplates = useSelect(
    (select) => {
      return isVisible ? select(coreStore).canUser("read", {
        kind: "postType",
        name: "wp_template"
      }) : false;
    },
    [isVisible]
  );
  if ((!isBlockTheme || !canViewTemplates) && isVisible) {
    return /* @__PURE__ */ jsx(ClassicThemeControl, {});
  }
  if (isBlockTheme && !!templateId) {
    return /* @__PURE__ */ jsx(BlockThemeControl, { id: templateId });
  }
  return null;
}
export {
  PostTemplatePanel as default
};
//# sourceMappingURL=panel.mjs.map
