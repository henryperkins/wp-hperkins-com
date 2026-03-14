"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/route/src/private-apis.ts
var private_apis_exports = {};
__export(private_apis_exports, {
  privateApis: () => privateApis
});
module.exports = __toCommonJS(private_apis_exports);
var import_history = require("@tanstack/history");
var import_react_router = require("@tanstack/react-router");
var import_lock_unlock = require("./lock-unlock.cjs");
var privateApis = {};
(0, import_lock_unlock.lock)(privateApis, {
  // Router creation and setup
  createBrowserHistory: import_react_router.createBrowserHistory,
  createLazyRoute: import_react_router.createLazyRoute,
  createRouter: import_react_router.createRouter,
  createRootRoute: import_react_router.createRootRoute,
  createRoute: import_react_router.createRoute,
  Outlet: import_react_router.Outlet,
  RouterProvider: import_react_router.RouterProvider,
  // Internal routing utilities
  redirect: import_react_router.redirect,
  createLink: import_react_router.createLink,
  useCanGoBack: import_react_router.useCanGoBack,
  useLoaderData: import_react_router.useLoaderData,
  useLocation: import_react_router.useLocation,
  useMatches: import_react_router.useMatches,
  useRouter: import_react_router.useRouter,
  useRouterState: import_react_router.useRouterState,
  useBlocker: import_react_router.useBlocker,
  // History utilities
  parseHref: import_history.parseHref
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  privateApis
});
//# sourceMappingURL=private-apis.cjs.map
