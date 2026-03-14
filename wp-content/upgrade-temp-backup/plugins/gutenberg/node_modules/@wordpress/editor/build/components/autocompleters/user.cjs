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

// packages/editor/src/components/autocompleters/user.js
var user_exports = {};
__export(user_exports, {
  default: () => user_default,
  getUserLabel: () => getUserLabel
});
module.exports = __toCommonJS(user_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_jsx_runtime = require("react/jsx-runtime");
function getUserLabel(user) {
  const avatar = user.avatar_urls && user.avatar_urls[24] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "img",
    {
      className: "editor-autocompleters__user-avatar",
      alt: "",
      src: user.avatar_urls[24]
    }
  ) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "editor-autocompleters__no-avatar" });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    avatar,
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "editor-autocompleters__user-name", children: user.name }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "editor-autocompleters__user-slug", children: user.slug })
  ] });
}
var user_default = {
  name: "users",
  className: "editor-autocompleters__user",
  triggerPrefix: "@",
  useItems(filterValue) {
    const users = (0, import_data.useSelect)(
      (select) => {
        const { getUsers } = select(import_core_data.store);
        return getUsers({
          context: "view",
          search: encodeURIComponent(filterValue)
        });
      },
      [filterValue]
    );
    const options = (0, import_element.useMemo)(
      () => users ? users.map((user) => ({
        key: `user-${user.slug}`,
        value: user,
        label: getUserLabel(user)
      })) : [],
      [users]
    );
    return [options];
  },
  getOptionCompletion(user) {
    return `@${user.slug}`;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getUserLabel
});
//# sourceMappingURL=user.cjs.map
