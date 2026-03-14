// packages/boot/src/components/app/use-route-title.ts
import { useEffect, useRef } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { __, sprintf } from "@wordpress/i18n";
import { speak } from "@wordpress/a11y";
import { decodeEntities } from "@wordpress/html-entities";
import { privateApis as routePrivateApis } from "@wordpress/route";
import { unlock } from "../../lock-unlock.mjs";
var { useLocation, useMatches } = unlock(routePrivateApis);
function useRouteTitle() {
  const location = useLocation();
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];
  const routeTitle = currentMatch?.loaderData?.title;
  const siteTitle = useSelect(
    (select) => select(coreStore).getEntityRecord(
      "root",
      "__unstableBase"
    )?.name,
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
    if (routeTitle && typeof routeTitle === "string" && siteTitle && typeof siteTitle === "string") {
      const decodedRouteTitle = decodeEntities(routeTitle);
      const decodedSiteTitle = decodeEntities(siteTitle);
      const formattedTitle = sprintf(
        /* translators: Admin document title. 1: Admin screen name, 2: Site name. */
        __("%1$s \u2039 %2$s \u2014 WordPress"),
        decodedRouteTitle,
        decodedSiteTitle
      );
      document.title = formattedTitle;
      if (decodedRouteTitle) {
        speak(decodedRouteTitle, "assertive");
      }
    }
  }, [routeTitle, siteTitle, location]);
}
export {
  useRouteTitle as default
};
//# sourceMappingURL=use-route-title.mjs.map
