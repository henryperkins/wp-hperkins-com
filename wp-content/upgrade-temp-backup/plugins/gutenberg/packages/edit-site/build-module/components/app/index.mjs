// packages/edit-site/src/components/app/index.js
import { useSelect } from "@wordpress/data";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { useCallback, useMemo } from "@wordpress/element";
import { store as coreStore } from "@wordpress/core-data";
import Layout from "../layout/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { store as editSiteStore } from "../../store/index.mjs";
import { useCommonCommands } from "../../hooks/commands/use-common-commands.mjs";
import useSetCommandContext from "../../hooks/commands/use-set-command-context.mjs";
import { useRegisterSiteEditorRoutes } from "../site-editor-routes/index.mjs";
import {
  currentlyPreviewingTheme,
  isPreviewingTheme
} from "../../utils/is-previewing-theme.mjs";
import { jsx } from "react/jsx-runtime";
var { RouterProvider } = unlock(routerPrivateApis);
function AppLayout() {
  useCommonCommands();
  useSetCommandContext();
  return /* @__PURE__ */ jsx(Layout, {});
}
function App() {
  useRegisterSiteEditorRoutes();
  const { routes, currentTheme, editorSettings } = useSelect((select) => {
    return {
      routes: unlock(select(editSiteStore)).getRoutes(),
      currentTheme: select(coreStore).getCurrentTheme(),
      // This is a temp solution until the has_theme_json value is available for the current theme.
      editorSettings: select(editSiteStore).getSettings()
    };
  }, []);
  const beforeNavigate = useCallback(({ path, query }) => {
    if (!isPreviewingTheme()) {
      return { path, query };
    }
    return {
      path,
      query: {
        ...query,
        wp_theme_preview: "wp_theme_preview" in query ? query.wp_theme_preview : currentlyPreviewingTheme()
      }
    };
  }, []);
  const matchResolverArgsValue = useMemo(
    () => ({
      siteData: { currentTheme, editorSettings }
    }),
    [currentTheme, editorSettings]
  );
  return /* @__PURE__ */ jsx(
    RouterProvider,
    {
      routes,
      pathArg: "p",
      beforeNavigate,
      matchResolverArgs: matchResolverArgsValue,
      children: /* @__PURE__ */ jsx(AppLayout, {})
    }
  );
}
export {
  App as default
};
//# sourceMappingURL=index.mjs.map
