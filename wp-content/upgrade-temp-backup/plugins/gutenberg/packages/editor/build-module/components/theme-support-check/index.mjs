// packages/editor/src/components/theme-support-check/index.js
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { store as editorStore } from "../../store/index.mjs";
function ThemeSupportCheck({ children, supportKeys }) {
  const { postType, themeSupports } = useSelect((select) => {
    return {
      postType: select(editorStore).getEditedPostAttribute("type"),
      themeSupports: select(coreStore).getThemeSupports()
    };
  }, []);
  const isSupported = (Array.isArray(supportKeys) ? supportKeys : [supportKeys]).some((key) => {
    const supported = themeSupports?.[key] ?? false;
    if ("post-thumbnails" === key && Array.isArray(supported)) {
      return supported.includes(postType);
    }
    return supported;
  });
  if (!isSupported) {
    return null;
  }
  return children;
}
export {
  ThemeSupportCheck as default
};
//# sourceMappingURL=index.mjs.map
