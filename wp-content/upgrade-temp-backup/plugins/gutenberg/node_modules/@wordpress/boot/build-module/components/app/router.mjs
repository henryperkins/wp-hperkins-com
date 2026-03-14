// packages/boot/src/components/app/router.tsx
import { __ } from "@wordpress/i18n";
import { useMemo } from "@wordpress/element";
import { Page } from "@wordpress/admin-ui";
import {
  privateApis as routePrivateApis
} from "@wordpress/route";
import { resolveSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import Root from "../root/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var {
  createLazyRoute,
  createRouter,
  createRootRoute,
  createRoute,
  RouterProvider,
  createBrowserHistory,
  parseHref,
  useLoaderData
} = unlock(routePrivateApis);
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "boot-layout__stage", children: /* @__PURE__ */ jsx(Page, { title: __("Route not found"), hasPadding: true, children: __("The page you're looking for does not exist") }) });
}
function createRouteFromDefinition(route, parentRoute) {
  let tanstackRoute = createRoute({
    getParentRoute: () => parentRoute,
    path: route.path,
    beforeLoad: async (opts) => {
      if (route.route_module) {
        const module = await import(route.route_module);
        const routeConfig = module.route || {};
        if (routeConfig.beforeLoad) {
          return routeConfig.beforeLoad({
            params: opts.params || {},
            search: opts.search || {}
          });
        }
      }
    },
    loader: async (opts) => {
      let routeConfig = {};
      if (route.route_module) {
        const module = await import(route.route_module);
        routeConfig = module.route || {};
      }
      const context = {
        params: opts.params || {},
        search: opts.deps || {}
      };
      const [, loaderData, canvasData, titleData] = await Promise.all([
        resolveSelect(coreStore).getEntityRecord(
          "root",
          "__unstableBase"
        ),
        routeConfig.loader ? routeConfig.loader(context) : Promise.resolve(void 0),
        routeConfig.canvas ? routeConfig.canvas(context) : Promise.resolve(void 0),
        routeConfig.title ? routeConfig.title(context) : Promise.resolve(void 0)
      ]);
      let inspector = true;
      if (routeConfig.inspector) {
        inspector = await routeConfig.inspector(context);
      }
      return {
        ...loaderData,
        canvas: canvasData,
        inspector,
        title: titleData,
        routeContentModule: route.content_module
      };
    },
    loaderDeps: (opts) => opts.search
  });
  tanstackRoute = tanstackRoute.lazy(async () => {
    const module = route.content_module ? await import(route.content_module) : {};
    const Stage = module.stage;
    const Inspector = module.inspector;
    return createLazyRoute(route.path)({
      component: function RouteComponent() {
        const { inspector: showInspector } = useLoaderData({ from: route.path }) ?? {};
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          Stage && /* @__PURE__ */ jsx("div", { className: "boot-layout__stage", children: /* @__PURE__ */ jsx(Stage, {}) }),
          Inspector && showInspector && /* @__PURE__ */ jsx("div", { className: "boot-layout__inspector", children: /* @__PURE__ */ jsx(Inspector, {}) })
        ] });
      }
    });
  });
  return tanstackRoute;
}
function createRouteTree(routes, rootComponent = Root) {
  const rootRoute = createRootRoute({
    component: rootComponent,
    context: () => ({})
  });
  const dynamicRoutes = routes.map(
    (route) => createRouteFromDefinition(route, rootRoute)
  );
  return rootRoute.addChildren(dynamicRoutes);
}
function createPathHistory() {
  return createBrowserHistory({
    parseLocation: () => {
      const url = new URL(window.location.href);
      const path = url.searchParams.get("p") || "/";
      const pathHref = `${path}${url.hash}`;
      return parseHref(pathHref, window.history.state);
    },
    createHref: (href) => {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("p", href);
      return `${window.location.pathname}?${searchParams}`;
    }
  });
}
function Router({
  routes,
  rootComponent = Root
}) {
  const router = useMemo(() => {
    const history = createPathHistory();
    const routeTree = createRouteTree(routes, rootComponent);
    return createRouter({
      history,
      routeTree,
      defaultPreload: "intent",
      defaultNotFoundComponent: NotFoundComponent,
      defaultViewTransition: {
        types: ({
          fromLocation
        }) => {
          if (!fromLocation) {
            return false;
          }
          return ["navigate"];
        }
      }
    });
  }, [routes, rootComponent]);
  return /* @__PURE__ */ jsx(RouterProvider, { router });
}
export {
  Router as default
};
//# sourceMappingURL=router.mjs.map
