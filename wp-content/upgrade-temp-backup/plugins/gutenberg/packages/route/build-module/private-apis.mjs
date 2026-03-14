// packages/route/src/private-apis.ts
import { parseHref } from "@tanstack/history";
import {
  createBrowserHistory,
  createLazyRoute,
  createLink,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
  RouterProvider,
  useBlocker,
  useCanGoBack,
  useLoaderData,
  useLocation,
  useMatches,
  useRouter,
  useRouterState
} from "@tanstack/react-router";
import { lock } from "./lock-unlock.mjs";
var privateApis = {};
lock(privateApis, {
  // Router creation and setup
  createBrowserHistory,
  createLazyRoute,
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
  RouterProvider,
  // Internal routing utilities
  redirect,
  createLink,
  useCanGoBack,
  useLoaderData,
  useLocation,
  useMatches,
  useRouter,
  useRouterState,
  useBlocker,
  // History utilities
  parseHref
});
export {
  privateApis
};
//# sourceMappingURL=private-apis.mjs.map
