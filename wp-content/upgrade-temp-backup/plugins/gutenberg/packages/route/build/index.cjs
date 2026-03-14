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

// packages/route/src/index.ts
var index_exports = {};
__export(index_exports, {
  Link: () => import_react_router2.Link,
  notFound: () => import_react_router2.notFound,
  privateApis: () => import_private_apis.privateApis,
  redirect: () => import_react_router2.redirect,
  useInvalidate: () => useInvalidate,
  useLinkProps: () => import_react_router2.useLinkProps,
  useNavigate: () => import_react_router2.useNavigate,
  useParams: () => import_react_router2.useParams,
  useSearch: () => import_react_router2.useSearch
});
module.exports = __toCommonJS(index_exports);
var import_react_router = require("@tanstack/react-router");
var import_react_router2 = require("@tanstack/react-router");
var import_private_apis = require("./private-apis.cjs");
function useInvalidate() {
  const router = (0, import_react_router.useRouter)();
  return () => router.invalidate();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Link,
  notFound,
  privateApis,
  redirect,
  useInvalidate,
  useLinkProps,
  useNavigate,
  useParams,
  useSearch
});
//# sourceMappingURL=index.cjs.map
