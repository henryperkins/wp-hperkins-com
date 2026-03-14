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

// packages/router/src/link.tsx
var link_exports = {};
__export(link_exports, {
  Link: () => Link,
  useLink: () => useLink
});
module.exports = __toCommonJS(link_exports);
var import_element = require("@wordpress/element");
var import_url = require("@wordpress/url");
var import_router = require("./router.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function useLink(to, options = {}) {
  const history = (0, import_router.useHistory)();
  const { pathArg, beforeNavigate } = (0, import_element.useContext)(import_router.ConfigContext);
  function onClick(event) {
    event?.preventDefault();
    history.navigate(to, options);
  }
  const query = (0, import_url.getQueryArgs)(to);
  const path = (0, import_url.getPath)("http://domain.com/" + to) ?? "";
  const link = (0, import_element.useMemo)(() => {
    return beforeNavigate ? beforeNavigate({ path, query }) : { path, query };
  }, [path, query, beforeNavigate]);
  const [before] = window.location.href.split("?");
  return {
    href: `${before}?${(0, import_url.buildQueryString)({
      [pathArg]: link.path,
      ...link.query
    })}`,
    onClick
  };
}
function Link({
  to,
  options,
  children,
  ...props
}) {
  const { href, onClick } = useLink(to, options);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href, onClick, ...props, children });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Link,
  useLink
});
//# sourceMappingURL=link.cjs.map
