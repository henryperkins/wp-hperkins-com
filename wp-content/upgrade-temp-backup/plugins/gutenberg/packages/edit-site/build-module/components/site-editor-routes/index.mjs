// packages/edit-site/src/components/site-editor-routes/index.js
import { useRegistry, useDispatch } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
import { unlock } from "../../lock-unlock.mjs";
import { store as siteEditorStore } from "../../store/index.mjs";
import { homeRoute } from "./home.mjs";
import { identityRoute } from "./identity.mjs";
import { stylesRoute } from "./styles.mjs";
import { navigationRoute } from "./navigation.mjs";
import { navigationItemRoute } from "./navigation-item.mjs";
import { patternsRoute } from "./patterns.mjs";
import { patternItemRoute } from "./pattern-item.mjs";
import { templatePartItemRoute } from "./template-part-item.mjs";
import { templatesRoute } from "./templates.mjs";
import { templateItemRoute } from "./template-item.mjs";
import { pagesRoute } from "./pages.mjs";
import { pageItemRoute } from "./page-item.mjs";
import { attachmentItemRoute } from "./attachment-item.mjs";
import { stylebookRoute } from "./stylebook.mjs";
import { notFoundRoute } from "./notfound.mjs";
var routes = [
  ...window?.__experimentalMediaEditor ? [attachmentItemRoute] : [],
  pageItemRoute,
  pagesRoute,
  templateItemRoute,
  templatesRoute,
  templatePartItemRoute,
  patternItemRoute,
  patternsRoute,
  navigationItemRoute,
  navigationRoute,
  identityRoute,
  stylesRoute,
  homeRoute,
  stylebookRoute,
  notFoundRoute
];
function useRegisterSiteEditorRoutes() {
  const registry = useRegistry();
  const { registerRoute } = unlock(useDispatch(siteEditorStore));
  useEffect(() => {
    registry.batch(() => {
      routes.forEach(registerRoute);
    });
  }, [registry, registerRoute]);
}
export {
  useRegisterSiteEditorRoutes
};
//# sourceMappingURL=index.mjs.map
