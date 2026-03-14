// packages/edit-site/src/utils/use-actual-current-theme.js
import apiFetch from "@wordpress/api-fetch";
import { useState, useEffect } from "@wordpress/element";
import { addQueryArgs } from "@wordpress/url";
var ACTIVE_THEMES_URL = "/wp/v2/themes?status=active";
function useActualCurrentTheme() {
  const [currentTheme, setCurrentTheme] = useState();
  useEffect(() => {
    const path = addQueryArgs(ACTIVE_THEMES_URL, {
      context: "edit",
      wp_theme_preview: ""
    });
    apiFetch({ path }).then((activeThemes) => setCurrentTheme(activeThemes[0])).catch(() => {
    });
  }, []);
  return currentTheme;
}
export {
  useActualCurrentTheme
};
//# sourceMappingURL=use-actual-current-theme.mjs.map
