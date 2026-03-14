// packages/router/src/router.tsx
import RouteRecognizer from "route-recognizer";
import { createBrowserHistory } from "history";
import {
  createContext,
  useContext,
  useSyncExternalStore,
  useMemo,
  useState,
  useEffect
} from "@wordpress/element";
import {
  addQueryArgs,
  getQueryArgs,
  getPath,
  buildQueryString
} from "@wordpress/url";
import { useEvent, usePrevious } from "@wordpress/compose";
import { jsx } from "react/jsx-runtime";
var history = createBrowserHistory();
var RoutesContext = createContext(null);
RoutesContext.displayName = "RoutesContext";
var ConfigContext = createContext({ pathArg: "p" });
ConfigContext.displayName = "ConfigContext";
var locationMemo = /* @__PURE__ */ new WeakMap();
function getLocationWithQuery() {
  const location = history.location;
  let locationWithQuery = locationMemo.get(location);
  if (!locationWithQuery) {
    locationWithQuery = {
      ...location,
      query: Object.fromEntries(new URLSearchParams(location.search))
    };
    locationMemo.set(location, locationWithQuery);
  }
  return locationWithQuery;
}
function useLocation() {
  const context = useContext(RoutesContext);
  if (!context) {
    throw new Error("useLocation must be used within a RouterProvider");
  }
  return context;
}
function useHistory() {
  const { pathArg, beforeNavigate } = useContext(ConfigContext);
  const navigate = useEvent(
    async (rawPath, options = {}) => {
      const query = getQueryArgs(rawPath);
      const path = getPath("http://domain.com/" + rawPath) ?? "";
      const performPush = () => {
        const result = beforeNavigate ? beforeNavigate({ path, query }) : { path, query };
        return history.push(
          {
            search: buildQueryString({
              [pathArg]: result.path,
              ...result.query
            })
          },
          options.state
        );
      };
      const isMediumOrBigger = window.matchMedia("(min-width: 782px)").matches;
      if (!isMediumOrBigger || !document.startViewTransition || !options.transition) {
        performPush();
        return;
      }
      await new Promise((resolve) => {
        const classname = options.transition ?? "";
        document.documentElement.classList.add(classname);
        const transition = document.startViewTransition(
          () => performPush()
        );
        transition.finished.finally(() => {
          document.documentElement.classList.remove(classname);
          resolve();
        });
      });
    }
  );
  return useMemo(
    () => ({
      navigate,
      back: history.back,
      invalidate: () => {
        history.replace({
          search: history.location.search
        });
      }
    }),
    [navigate]
  );
}
function useMatch(location, matcher, pathArg, matchResolverArgs) {
  const { query: rawQuery = {} } = location;
  const [resolvedMatch, setMatch] = useState();
  useEffect(() => {
    const { [pathArg]: path = "/", ...query } = rawQuery;
    const ret = matcher.recognize(path)?.[0];
    async function resolveMatch(result) {
      const matchedRoute = result.handler;
      const resolveFunctions = async (record = {}) => {
        const entries = await Promise.all(
          Object.entries(record).map(async ([key, value]) => {
            if (typeof value === "function") {
              return [
                key,
                await value({
                  query,
                  params: result.params,
                  ...matchResolverArgs
                })
              ];
            }
            return [key, value];
          })
        );
        return Object.fromEntries(entries);
      };
      const [resolvedAreas, resolvedWidths] = await Promise.all([
        resolveFunctions(matchedRoute.areas),
        resolveFunctions(matchedRoute.widths)
      ]);
      setMatch({
        name: matchedRoute.name,
        areas: resolvedAreas,
        widths: resolvedWidths,
        params: result.params,
        query,
        path: addQueryArgs(path, query)
      });
    }
    if (!ret) {
      setMatch({
        name: "404",
        path: addQueryArgs(path, query),
        areas: {},
        widths: {},
        query,
        params: {}
      });
    } else {
      resolveMatch(ret);
    }
    return () => setMatch(void 0);
  }, [matcher, rawQuery, pathArg, matchResolverArgs]);
  return resolvedMatch;
}
function RouterProvider({
  routes,
  pathArg,
  beforeNavigate,
  children,
  matchResolverArgs
}) {
  const location = useSyncExternalStore(
    history.listen,
    getLocationWithQuery,
    getLocationWithQuery
  );
  const matcher = useMemo(() => {
    const ret = new RouteRecognizer();
    (routes ?? []).forEach((route) => {
      ret.add([{ path: route.path, handler: route }], {
        as: route.name
      });
    });
    return ret;
  }, [routes]);
  const match = useMatch(location, matcher, pathArg, matchResolverArgs);
  const previousMatch = usePrevious(match);
  const config = useMemo(
    () => ({ beforeNavigate, pathArg }),
    [beforeNavigate, pathArg]
  );
  const renderedMatch = match || previousMatch;
  if (!renderedMatch) {
    return null;
  }
  return /* @__PURE__ */ jsx(ConfigContext.Provider, { value: config, children: /* @__PURE__ */ jsx(RoutesContext.Provider, { value: renderedMatch, children }) });
}
export {
  ConfigContext,
  RouterProvider,
  useMatch as default,
  useHistory,
  useLocation
};
//# sourceMappingURL=router.mjs.map
