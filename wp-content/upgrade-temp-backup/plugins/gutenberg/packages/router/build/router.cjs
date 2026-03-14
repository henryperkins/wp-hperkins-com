"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/router/src/router.tsx
var router_exports = {};
__export(router_exports, {
  ConfigContext: () => ConfigContext,
  RouterProvider: () => RouterProvider,
  default: () => useMatch,
  useHistory: () => useHistory,
  useLocation: () => useLocation
});
module.exports = __toCommonJS(router_exports);
var import_route_recognizer = __toESM(require("route-recognizer"));
var import_history = require("history");
var import_element = require("@wordpress/element");
var import_url = require("@wordpress/url");
var import_compose = require("@wordpress/compose");
var import_jsx_runtime = require("react/jsx-runtime");
var history = (0, import_history.createBrowserHistory)();
var RoutesContext = (0, import_element.createContext)(null);
RoutesContext.displayName = "RoutesContext";
var ConfigContext = (0, import_element.createContext)({ pathArg: "p" });
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
  const context = (0, import_element.useContext)(RoutesContext);
  if (!context) {
    throw new Error("useLocation must be used within a RouterProvider");
  }
  return context;
}
function useHistory() {
  const { pathArg, beforeNavigate } = (0, import_element.useContext)(ConfigContext);
  const navigate = (0, import_compose.useEvent)(
    async (rawPath, options = {}) => {
      const query = (0, import_url.getQueryArgs)(rawPath);
      const path = (0, import_url.getPath)("http://domain.com/" + rawPath) ?? "";
      const performPush = () => {
        const result = beforeNavigate ? beforeNavigate({ path, query }) : { path, query };
        return history.push(
          {
            search: (0, import_url.buildQueryString)({
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
  return (0, import_element.useMemo)(
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
  const [resolvedMatch, setMatch] = (0, import_element.useState)();
  (0, import_element.useEffect)(() => {
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
        path: (0, import_url.addQueryArgs)(path, query)
      });
    }
    if (!ret) {
      setMatch({
        name: "404",
        path: (0, import_url.addQueryArgs)(path, query),
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
  const location = (0, import_element.useSyncExternalStore)(
    history.listen,
    getLocationWithQuery,
    getLocationWithQuery
  );
  const matcher = (0, import_element.useMemo)(() => {
    const ret = new import_route_recognizer.default();
    (routes ?? []).forEach((route) => {
      ret.add([{ path: route.path, handler: route }], {
        as: route.name
      });
    });
    return ret;
  }, [routes]);
  const match = useMatch(location, matcher, pathArg, matchResolverArgs);
  const previousMatch = (0, import_compose.usePrevious)(match);
  const config = (0, import_element.useMemo)(
    () => ({ beforeNavigate, pathArg }),
    [beforeNavigate, pathArg]
  );
  const renderedMatch = match || previousMatch;
  if (!renderedMatch) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigContext.Provider, { value: config, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoutesContext.Provider, { value: renderedMatch, children }) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ConfigContext,
  RouterProvider,
  useHistory,
  useLocation
});
//# sourceMappingURL=router.cjs.map
