// packages/router/src/private-apis.ts
import { useHistory, useLocation, RouterProvider } from "./router.mjs";
import { useLink, Link } from "./link.mjs";
import { lock } from "./lock-unlock.mjs";
var privateApis = {};
lock(privateApis, {
  useHistory,
  useLocation,
  RouterProvider,
  useLink,
  Link
});
export {
  privateApis
};
//# sourceMappingURL=private-apis.mjs.map
