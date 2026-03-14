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

// packages/router/src/private-apis.ts
var private_apis_exports = {};
__export(private_apis_exports, {
  privateApis: () => privateApis
});
module.exports = __toCommonJS(private_apis_exports);
var import_router = require("./router.cjs");
var import_link = require("./link.cjs");
var import_lock_unlock = require("./lock-unlock.cjs");
var privateApis = {};
(0, import_lock_unlock.lock)(privateApis, {
  useHistory: import_router.useHistory,
  useLocation: import_router.useLocation,
  RouterProvider: import_router.RouterProvider,
  useLink: import_link.useLink,
  Link: import_link.Link
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  privateApis
});
//# sourceMappingURL=private-apis.cjs.map
