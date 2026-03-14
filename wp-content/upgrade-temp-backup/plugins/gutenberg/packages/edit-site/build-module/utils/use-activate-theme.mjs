// packages/edit-site/src/utils/use-activate-theme.js
import { store as coreStore } from "@wordpress/core-data";
import { useDispatch } from "@wordpress/data";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { addQueryArgs } from "@wordpress/url";
import { unlock } from "../lock-unlock.mjs";
import {
  isPreviewingTheme,
  currentlyPreviewingTheme
} from "./is-previewing-theme.mjs";
var { useHistory, useLocation } = unlock(routerPrivateApis);
function useActivateTheme() {
  const history = useHistory();
  const { path } = useLocation();
  const { startResolution, finishResolution } = useDispatch(coreStore);
  return async () => {
    if (isPreviewingTheme()) {
      const activationURL = "themes.php?action=activate&stylesheet=" + currentlyPreviewingTheme() + "&_wpnonce=" + window.WP_BLOCK_THEME_ACTIVATE_NONCE;
      startResolution("activateTheme");
      await window.fetch(activationURL);
      finishResolution("activateTheme");
      history.navigate(addQueryArgs(path, { wp_theme_preview: "" }));
    }
  };
}
export {
  useActivateTheme
};
//# sourceMappingURL=use-activate-theme.mjs.map
