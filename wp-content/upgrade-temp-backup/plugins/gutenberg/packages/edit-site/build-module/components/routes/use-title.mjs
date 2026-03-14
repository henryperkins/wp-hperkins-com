// packages/edit-site/src/components/routes/use-title.js
import { useEffect, useRef } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { __, sprintf } from "@wordpress/i18n";
import { speak } from "@wordpress/a11y";
import { decodeEntities } from "@wordpress/html-entities";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { unlock } from "../../lock-unlock.mjs";
var { useLocation } = unlock(routerPrivateApis);
function useTitle(title) {
  const location = useLocation();
  const siteTitle = useSelect(
    (select) => select(coreStore).getEntityRecord("root", "site")?.title,
    []
  );
  const isInitialLocationRef = useRef(true);
  useEffect(() => {
    isInitialLocationRef.current = false;
  }, [location]);
  useEffect(() => {
    if (isInitialLocationRef.current) {
      return;
    }
    if (title && siteTitle) {
      const formattedTitle = sprintf(
        /* translators: Admin document title. 1: Admin screen name, 2: Network or site name. */
        __("%1$s \u2039 %2$s \u2039 Editor \u2014 WordPress"),
        decodeEntities(title),
        decodeEntities(siteTitle)
      );
      document.title = formattedTitle;
      speak(title, "assertive");
    }
  }, [title, siteTitle, location]);
}
export {
  useTitle as default
};
//# sourceMappingURL=use-title.mjs.map
